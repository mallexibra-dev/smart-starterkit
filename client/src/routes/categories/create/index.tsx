import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";
import { CategoryForm } from "../-components/category-form";

export const Route = createFileRoute("/categories/create/")({
  component: CreateCategory,
});

function CreateCategory() {
  return (
    <ContainerLayout title="Create Category">
      <CategoryForm mode="create" />
    </ContainerLayout>
  );
}