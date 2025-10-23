import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/ContainerLayout";
import { ProductList } from "./-components/product-list";

export const Route = createFileRoute("/products/")({
  component: ProductsIndex,
  validateSearch: (search: Record<string, string>) => {
    return {
      page: Number(search.page) || 1,
      limit: Number(search.limit) || 10,
      sort_by: search.sort_by || 'created_at',
      sort_order: search.sort_order || 'desc',
      search: search.search,
      category_id: search.category_id ? Number(search.category_id) : undefined,
      status: search.status,
    };
  },
});

function ProductsIndex() {
  return (
    <ContainerLayout title="Product Management">
      <ProductList />
    </ContainerLayout>
  );
}