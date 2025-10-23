import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";
import { ProductDetail } from "./-components/product-detail";

export const Route = createFileRoute("/categories/edit/$id")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();

  return (
    <ContainerLayout title="Product Detail">
      <ProductDetail productId={parseInt(id)} />
    </ContainerLayout>
  );
}
