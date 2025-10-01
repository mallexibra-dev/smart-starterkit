import { createFileRoute, Link } from "@tanstack/react-router";
import { Container } from "@/components/layout/Container";
import { TransactionForm } from "./-components/TransactionForm";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute('/transactions/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Tambah Transaksi</h2>
          <Link to={"/transactions" as any}>
            <Button variant="outline">Kembali ke List</Button>
          </Link>
        </div>
        <TransactionForm onCreated={() => { /* optional navigation */ }} />
      </div>
    </Container>
  )
} 