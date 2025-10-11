import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormCard } from "@/components/blocks/FormCard";
import { createProduct, type CreateProductInput, type ProductDto, type UpdateProductInput } from "@/services/product.service";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/currency";

interface ProductFormProps {
  onCreated?: () => void;
  initialData?: ProductDto;
  isEditing?: boolean;
  isLoading?: boolean;
  onSubmit?: (data: UpdateProductInput) => void;
}

export function ProductForm({
  onCreated,
  initialData,
  isEditing = false,
  isLoading = false,
  onSubmit
}: ProductFormProps) {
  const [form, setForm] = useState<CreateProductInput>({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    status: initialData?.status || "active",
    category: initialData?.category || "",
    sku: initialData?.sku || "",
    description: initialData?.description || "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateProductInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = (data: CreateProductInput): boolean => {
    // Basic validation - check if required fields are filled
    const newErrors: Partial<Record<keyof CreateProductInput, string>> = {};

    if (!data.name || data.name.trim() === '') {
      newErrors.name = "Product name is required";
    }

    if (data.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (data.stock < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key: keyof CreateProductInput, value: any) => {
    const newForm = { ...form, [key]: value };
    setForm(newForm);

    // Clear error for this field when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();

    if (!validateForm(form)) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && onSubmit) {
        const updateData: UpdateProductInput = {};
        Object.entries(form).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // Convert price and stock to numbers for update
            if (key === 'price' || key === 'stock') {
              updateData[key as keyof UpdateProductInput] = Number(value) as any;
            } else {
              updateData[key as keyof UpdateProductInput] = value as any;
            }
          }
        });
        await onSubmit(updateData);
      } else {
        await createProduct({
          name: form.name,
          description: form.description || undefined,
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category || undefined,
          sku: form.sku || undefined,
          status: form.status ?? "active",
        });

        toast.success("Produk berhasil ditambahkan!");
        setForm({ name: "", price: 0, stock: 0, status: "active", category: undefined, description: undefined, sku: undefined });
        setErrors({});

        if (onCreated) {
          onCreated();
        } else {
          navigate({ to: "/products" });
        }
      }
    } catch (error: any) {
      // Handle specific validation errors
      if (error.message?.includes('SKU already exists')) {
        setErrors({ sku: 'Product with this SKU already exists' });
        toast.error('Product with this SKU already exists');
      } else if (error.message?.includes('already exists')) {
        toast.error(error.message);
      } else {
        toast.error(error.message || (isEditing ? "Gagal memperbarui produk" : "Gagal menambahkan produk"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditing && initialData) {
      setForm({
        name: initialData.name,
        price: initialData.price,
        stock: initialData.stock,
        status: initialData.status,
        category: initialData.category || "",
        sku: initialData.sku || "",
        description: initialData.description || "",
      });
    } else {
      setForm({ name: "", price: 0, stock: 0, status: "active", category: undefined, description: undefined, sku: undefined });
    }
    setErrors({});
  };

  return (
    <FormCard
      title={isEditing ? "Edit Produk" : "Tambah Produk"}
      description={isEditing ? "Form untuk mengubah data produk" : "Form untuk menambah produk baru"}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting || isLoading}
      submitText={isEditing ? "Perbarui" : "Simpan"}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Produk *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Nama produk"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={form.sku ?? ""}
            onChange={(e) => handleChange("sku", e.target.value)}
            placeholder="ASUS-GAM-001"
            className={errors.sku ? "border-red-500" : ""}
          />
          {errors.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Input
            id="category"
            value={form.category ?? ""}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="Electronics"
            className={errors.category ? "border-red-500" : ""}
          />
          {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => handleChange("status", v as "active" | "inactive")}
          >
            <SelectTrigger className={errors.status ? "border-red-500" : ""}>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Harga *</Label>
          <Input
            id="price"
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.valueAsNumber || 0)}
            placeholder="15000000"
            min="0"
            step="0.01"
            className={errors.price ? "border-red-500" : ""}
          />
          {form.price > 0 && (
            <p className="text-sm text-gray-500">{formatRupiah(form.price)}</p>
          )}
          {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stok *</Label>
          <Input
            id="stock"
            type="number"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.valueAsNumber || 0)}
            placeholder="25"
            min="0"
            className={errors.stock ? "border-red-500" : ""}
          />
          {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Input
            id="description"
            value={form.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Deskripsi produk"
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
        </div>
      </div>
    </FormCard>
  );
}
