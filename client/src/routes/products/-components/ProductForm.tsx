import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormCard } from "@/components/blocks/FormCard";
import { createProduct, type CreateProductInput } from "@/services/product.service";

export function ProductForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState<CreateProductInput>({
    name: "",
    price: 0,
    stock: 0,
    status: "active",
  });

  const handleChange = (key: keyof CreateProductInput, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    await createProduct({
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category || undefined,
      sku: form.sku || undefined,
      status: form.status ?? "active",
    });
    setForm({ name: "", price: 0, stock: 0, status: "active", category: undefined, description: undefined, sku: undefined });
    onCreated?.();
  };

  const handleReset = () => {
    setForm({ name: "", price: 0, stock: 0, status: "active" });
  };

  return (
    <FormCard title="Tambah Produk" description="Form untuk menambah produk baru" onSubmit={handleSubmit} onReset={handleReset}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nama</Label>
          <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Nama produk" />
        </div>
        <div className="space-y-2">
          <Label>SKU</Label>
          <Input value={form.sku ?? ""} onChange={(e) => handleChange("sku", e.target.value)} placeholder="ASUS-GAM-001" />
        </div>
        <div className="space-y-2">
          <Label>Kategori</Label>
          <Input value={form.category ?? ""} onChange={(e) => handleChange("category", e.target.value)} placeholder="Electronics" />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => handleChange("status", v as "active" | "inactive")}> 
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Harga</Label>
          <Input type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} placeholder="15000000" />
        </div>
        <div className="space-y-2">
          <Label>Stok</Label>
          <Input type="number" value={form.stock} onChange={(e) => handleChange("stock", e.target.value)} placeholder="25" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>Deskripsi</Label>
          <Input value={form.description ?? ""} onChange={(e) => handleChange("description", e.target.value)} placeholder="Deskripsi produk" />
        </div>
      </div>
    </FormCard>
  );
}
