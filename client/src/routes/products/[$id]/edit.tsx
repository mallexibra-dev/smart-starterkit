import { createFileRoute, Link } from "@tanstack/react-router";
import { Container } from "@/components/layout/Container";
import { ProductForm } from "../-components/ProductForm";
import { Button } from "@/components/ui/button";
import { getProduct, type ProductDto, type UpdateProductInput, updateProduct } from "@/services/product.service";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute('/products/$id/edit')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const product = await getProduct(parseInt(params.id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { product };
  },
});

function RouteComponent() {
  const { product } = Route.useLoaderData() as { product: ProductDto };
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (data: UpdateProductInput) => {
    setIsLoading(true);
    try {
      await updateProduct(product.id, data);
      toast.success("Produk berhasil diperbarui!");
      navigate({ to: "/products" });
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui produk");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Edit Produk</h2>
            <p className="text-gray-600 mt-1">Ubah informasi produk "{product.name}"</p>
          </div>
          <Link to={"/products" as any}>
            <Button variant="outline">Kembali ke List</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductForm
              initialData={product}
              onSubmit={handleUpdate}
              isEditing={true}
              isLoading={isLoading}
            />
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Produk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p className="font-mono">{product.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dibuat Pada</p>
                  <p className="text-sm">{new Date(product.created_at).toLocaleString('id-ID')}</p>
                </div>
                {product.updated_at && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Terakhir Diperbarui</p>
                    <p className="text-sm">{new Date(product.updated_at).toLocaleString('id-ID')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}