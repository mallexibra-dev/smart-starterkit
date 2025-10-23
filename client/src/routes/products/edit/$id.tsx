import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";
import { ProductForm } from "../-components/product-form";

export const Route = createFileRoute("/products/edit/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();

  return (
    <ContainerLayout title="Edit Product">
      <ProductForm mode="edit" productId={parseInt(id)} />
    </ContainerLayout>
  );
}
