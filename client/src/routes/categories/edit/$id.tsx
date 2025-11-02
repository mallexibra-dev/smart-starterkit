import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";
import { CategoryForm } from "../-components/category-form";

export const Route = createFileRoute("/categories/edit/$id")({
  component: CategoryEditPage,
});

function CategoryEditPage() {
  const { id } = Route.useParams();

  return (
    <ContainerLayout title="Edit Category">
      <CategoryForm mode="edit" categoryId={parseInt(id)} />
    </ContainerLayout>
  );
}
