import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";
import { ProductDetail } from "./-components/product-detail";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetailPage,
  validateSearch: (search: Record<string, string>) => {
    return {
      tab: search.tab || "details",
    };
  },
});

function ProductDetailPage() {
  const { id } = Route.useParams();

  return (
    <ContainerLayout title="Product Details">
      <ProductDetail productId={Number(id)} />
    </ContainerLayout>
  );
}
