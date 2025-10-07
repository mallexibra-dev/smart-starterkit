import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/layout/Container";
import { TransactionTable } from "./-components/TransactionTable";

export const Route = createFileRoute('/transactions/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Container>
      <TransactionTable />
    </Container>
  )
}
