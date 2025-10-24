import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";
import { CategoryDetail } from "../-components/category-detail";

export const Route = createFileRoute("/categories/edit/$id")({
  component: CategoryEditPage,
});

function CategoryEditPage() {
  const { id } = Route.useParams();

  return (
    <ContainerLayout title="Edit Category">
      <CategoryDetail categoryId={parseInt(id)} />
    </ContainerLayout>
  );
}
