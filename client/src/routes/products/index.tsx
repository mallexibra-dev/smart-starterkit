import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/layout/Container";
import { ProductTable } from "./-components/ProductTable";

export const Route = createFileRoute("/products/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container>
      <ProductTable />
    </Container>
  );
}
