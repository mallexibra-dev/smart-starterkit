import { createFileRoute, Link } from "@tanstack/react-router";
import { Container } from "@/components/layout/Container";
import { ProductForm } from "./-components/ProductForm";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute('/products/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Tambah Produk</h2>
          <Link to={"/products" as any}>
            <Button variant="outline">Kembali ke List</Button>
          </Link>
        </div>
        <ProductForm onCreated={() => { /* optional navigation */ }} />
      </div>
    </Container>
  )
} 