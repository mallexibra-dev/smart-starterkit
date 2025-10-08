import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/layout/Container";
import { TransactionForm } from "./-components/TransactionForm";

export const Route = createFileRoute('/transactions/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Container>
      <TransactionForm />
    </Container>
  )
} 