import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calculator, DollarSign, Package, ShoppingCart, CreditCard, X } from "lucide-react";
import { createTransaction, type CreateTransactionInput } from "@/services/transaction.service";
import { listProducts, type ProductDto } from "@/services/product.service";
import { formatRupiah } from "@/lib/currency";
import { createTransactionSchema as CreateTransactionSchema, type CreateTransactionInput as CreateTransactionType } from "shared";
import { z } from "zod";

export function TransactionForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateTransactionType>({
    user_id: 1,
    product_id: 0,
    quantity: 1,
    unit_price: 0,
    total_price: 0,
    transaction_type: "sale",
    status: "pending",
  });
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    listProducts().then(setProducts);
  }, []);

  const validateForm = (data: CreateTransactionType) => {
    try {
      // Validate manually for product_id to ensure it's not 0 or undefined
      if (!data.product_id || data.product_id === 0) {
        setErrors({ product_id: "Produk harus dipilih" });
        return false;
      }

      CreateTransactionSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError && error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0] as string] = err.message;
        });

        // Special case for product_id being 0 or undefined
        if (!data.product_id || data.product_id === 0) {
          newErrors.product_id = "Produk harus dipilih";
        }

        setErrors(newErrors);
      } else {
        // Handle other types of errors
        setErrors({ submit: "Validasi gagal. Periksa kembali input Anda." });
      }
      return false;
    }
  };

  const handleChange = (key: keyof CreateTransactionType, value: any) => {
    // Convert numeric fields to numbers
    let processedValue = value;
    if (key === 'unit_price' || key === 'quantity' || key === 'total_price' || key === 'product_id' || key === 'user_id') {
      processedValue = Number(value) || 0;
    }

    setForm((prev) => ({ ...prev, [key]: processedValue }));

    // Clear error for this field when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleProductChange = (productId: string | undefined) => {
    // Handle the case when no product is selected (undefined or empty)
    if (!productId) {
      setSelectedProduct(null);
      setForm((prev) => ({
        ...prev,
        product_id: 0,
        unit_price: 0,
        total_price: 0,
      }));
      return;
    }

    const id = Number(productId);
    const product = products.find(p => p.id === id) || null;
    setSelectedProduct(product);

    if (product) {
      setForm((prev) => ({
        ...prev,
        product_id: id,
        unit_price: Number(product.price),
        quantity: 1,
        total_price: Number(product.price),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        product_id: 0,
        unit_price: 0,
        total_price: 0,
      }));
    }
  };

  useEffect(() => {
    const total = Number(form.quantity ?? 0) * Number(form.unit_price ?? 0);
    setForm((prev) => ({ ...prev, total_price: total }));
  }, [form.quantity, form.unit_price]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();

    if (!validateForm(form)) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await createTransaction(form);
      navigate({ to: "/transactions" });
    } catch (error: any) {
      console.error("Failed to create transaction:", error);

      let errorMessage = "Gagal membuat transaksi. Silakan coba lagi.";

      // Handle different types of API errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) {
          errorMessage = data?.message || "Data transaksi tidak valid. Periksa kembali input Anda.";
        } else if (status === 422) {
          errorMessage = data?.message || "Validasi gagal. Periksa kembali input Anda.";
        } else if (status === 403) {
          errorMessage = "Anda tidak memiliki izin untuk membuat transaksi.";
        } else if (status === 500) {
          errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
        } else {
          errorMessage = data?.message || `Terjadi kesalahan (${status}).`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      } else if (error.message) {
        // Other errors
        errorMessage = error.message;
      }

      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      user_id: 1,
      product_id: 0,
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      transaction_type: "sale",
      status: "pending",
    });
    setSelectedProduct(null);
    setErrors({});
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <Package className="h-4 w-4" />;
      case "sale":
        return <ShoppingCart className="h-4 w-4" />;
      case "return":
        return <ArrowLeft className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "sale":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "return":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            Buat Transaksi Baru
          </h1>
          <p className="text-gray-600">Tambah transaksi penjualan, pembelian, atau retur</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/transactions" })}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </div>

      {errors.submit && (
        <Alert variant="destructive" className="relative">
          <AlertDescription>{errors.submit}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-6 w-6 p-0"
            onClick={() => setErrors((prev) => ({ ...prev, submit: "" }))}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Informasi Transaksi
              </CardTitle>
              <CardDescription>
                Masukkan detail transaksi yang ingin dibuat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="product">Produk *</Label>
                  <Select
                    value={form.product_id === 0 ? undefined : String(form.product_id)}
                    onValueChange={handleProductChange}
                  >
                    <SelectTrigger className={errors.product_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Pilih produk" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name} - {formatRupiah(p.price)} (Stok: {p.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.product_id && (
                    <p className="text-sm text-red-500">{errors.product_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction_type">Jenis Transaksi *</Label>
                  <Select
                    value={form.transaction_type}
                    onValueChange={(v) => handleChange("transaction_type", v as any)}
                  >
                    <SelectTrigger className={errors.transaction_type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Pilih jenis transaksi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Purchase (Pembelian)
                        </div>
                      </SelectItem>
                      <SelectItem value="sale">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Sale (Penjualan)
                        </div>
                      </SelectItem>
                      <SelectItem value="return">
                        <div className="flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Return (Retur)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.transaction_type && (
                    <p className="text-sm text-red-500">{errors.transaction_type}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Kuantitas *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={form.quantity ?? 1}
                    onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 1)}
                    className={errors.quantity ? "border-red-500" : ""}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500">{errors.quantity}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_price">Harga Satuan *</Label>
                  <Input
                    id="unit_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.unit_price}
                    onChange={(e) => handleChange("unit_price", parseFloat(e.target.value) || 0)}
                    className={errors.unit_price ? "border-red-500" : ""}
                  />
                  {form.unit_price > 0 && (
                    <p className="text-sm text-gray-500">{formatRupiah(form.unit_price)}</p>
                  )}
                  {errors.unit_price && (
                    <p className="text-sm text-red-500">{errors.unit_price}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => handleChange("status", v as any)}
                  >
                    <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                          Pending
                        </Badge>
                      </SelectItem>
                      <SelectItem value="completed">
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                          Completed
                        </Badge>
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                          Cancelled
                        </Badge>
                      </SelectItem>
                      <SelectItem value="refunded">
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                          Refunded
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500">{errors.status}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_method">Metode Pembayaran</Label>
                  <Input
                    id="payment_method"
                    value={form.payment_method ?? ""}
                    onChange={(e) => handleChange("payment_method", e.target.value)}
                    placeholder="Cash, Transfer, E-Wallet, dll"
                    className={errors.payment_method ? "border-red-500" : ""}
                  />
                  {errors.payment_method && (
                    <p className="text-sm text-red-500">{errors.payment_method}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference_number">Nomor Referensi</Label>
                  <Input
                    id="reference_number"
                    value={form.reference_number ?? ""}
                    onChange={(e) => handleChange("reference_number", e.target.value)}
                    placeholder="INV-2024-001, TRX-001, dll"
                    className={errors.reference_number ? "border-red-500" : ""}
                  />
                  {errors.reference_number && (
                    <p className="text-sm text-red-500">{errors.reference_number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    value={form.notes ?? ""}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Catatan tambahan tentang transaksi..."
                    className={errors.notes ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.notes && (
                    <p className="text-sm text-red-500">{errors.notes}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Ringkasan Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Jenis Transaksi</span>
                  <Badge className={getTransactionTypeColor(form.transaction_type)}>
                    <div className="flex items-center gap-1">
                      {getTransactionTypeIcon(form.transaction_type)}
                      {form.transaction_type.charAt(0).toUpperCase() + form.transaction_type.slice(1)}
                    </div>
                  </Badge>
                </div>

                {selectedProduct && (
                  <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-xs">
                          {selectedProduct.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{selectedProduct.name}</p>
                        <p className="text-xs text-gray-500">
                          Stok: {selectedProduct.stock} | SKU: {selectedProduct.sku || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kuantitas</span>
                  <span className="font-medium">{form.quantity} pcs</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Harga Satuan</span>
                  <span className="font-medium">{formatRupiah(form.unit_price)}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Harga</span>
                  <span className="font-bold text-lg text-purple-600">
                    {formatRupiah(form.total_price)}
                  </span>
                </div>

                {errors.total_price && (
                  <p className="text-sm text-red-500">{errors.total_price}</p>
                )}
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? "Menyimpan..." : "Simpan Transaksi"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setForm(prev => ({ ...prev, transaction_type: "sale", status: "completed" }));
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Penjualan Langsung
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setForm(prev => ({ ...prev, transaction_type: "purchase", status: "pending" }));
                }}
              >
                <Package className="h-4 w-4 mr-2" />
                Pesanan Pembelian
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setForm(prev => ({ ...prev, transaction_type: "return", status: "pending" }));
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Proses Retur
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}