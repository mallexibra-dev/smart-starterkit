import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormCard } from "@/components/blocks/FormCard";
import { createTransaction, type CreateTransactionInput } from "@/services/transaction.service";
import { listProducts, type ProductDto } from "@/services/product.service";

export function TransactionForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState<CreateTransactionInput>({
    user_id: 1,
    product_id: 0,
    quantity: 1,
    unit_price: 0,
    total_price: 0,
    transaction_type: "sale",
    status: "pending",
  });
  const [products, setProducts] = useState<ProductDto[]>([]);

  useEffect(() => {
    listProducts().then(setProducts);
  }, []);

  const handleChange = (key: keyof CreateTransactionInput, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const total = Number(form.quantity ?? 0) * Number(form.unit_price ?? 0);
    setForm((prev) => ({ ...prev, total_price: total }));
  }, [form.quantity, form.unit_price]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    await createTransaction({
      user_id: Number(form.user_id),
      product_id: Number(form.product_id),
      quantity: Number(form.quantity ?? 1),
      unit_price: Number(form.unit_price),
      total_price: Number(form.total_price),
      transaction_type: form.transaction_type ?? "sale",
      status: form.status ?? "pending",
      payment_method: form.payment_method || undefined,
      reference_number: form.reference_number || undefined,
      notes: form.notes || undefined,
    });
    setForm({ user_id: 1, product_id: 0, quantity: 1, unit_price: 0, total_price: 0, transaction_type: "sale", status: "pending" });
    onCreated?.();
  };

  const handleReset = () => {
    setForm({ user_id: 1, product_id: 0, quantity: 1, unit_price: 0, total_price: 0, transaction_type: "sale", status: "pending" });
  };

  return (
    <FormCard title="Tambah Transaksi" description="Form transaksi penjualan/pembelian" onSubmit={handleSubmit} onReset={handleReset}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Produk</Label>
          <Select value={String(form.product_id)} onValueChange={(v) => handleChange("product_id", Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih produk" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Jenis Transaksi</Label>
          <Select value={form.transaction_type} onValueChange={(v) => handleChange("transaction_type", v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="return">Return</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Kuantitas</Label>
          <Input type="number" value={form.quantity ?? 1} onChange={(e) => handleChange("quantity", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Harga Satuan</Label>
          <Input type="number" value={form.unit_price} onChange={(e) => handleChange("unit_price", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Total Harga</Label>
          <Input type="number" value={form.total_price} onChange={(e) => handleChange("total_price", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => handleChange("status", v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Metode Pembayaran</Label>
          <Input value={form.payment_method ?? ""} onChange={(e) => handleChange("payment_method", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Reference Number</Label>
          <Input value={form.reference_number ?? ""} onChange={(e) => handleChange("reference_number", e.target.value)} />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>Catatan</Label>
          <Input value={form.notes ?? ""} onChange={(e) => handleChange("notes", e.target.value)} />
        </div>
      </div>
    </FormCard>
  );
} 