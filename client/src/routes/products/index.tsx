import { createFileRoute, Link } from "@tanstack/react-router";
import { Container } from "@/components/layout/Container";
import { ProductTable } from "./-components/ProductTable";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute('/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Products</h2>
          <Link to={"/products/new" as any}>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">New</Button>
          </Link>
        </div>
        <ProductTable />
      </div>
    </Container>
  )
}
