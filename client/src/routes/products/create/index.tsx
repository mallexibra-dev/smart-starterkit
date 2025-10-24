import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";
import { ProductForm } from "../-components/product-form";

export const Route = createFileRoute("/products/create")({
  component: CreateProduct,
});

function CreateProduct() {
  return (
    <ContainerLayout title="Create Product">
      <ProductForm mode="create" />
    </ContainerLayout>
  );
}