import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableCard } from "@/components/blocks/TableCard";
import { listTransactions, deleteTransaction, type TransactionDto } from "@/services/transaction.service";
import { Button } from "@/components/ui/button";

export function TransactionTable() {
  const [items, setItems] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listTransactions();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteTransaction(id);
    load();
  };

  return (
    <TableCard title="Daftar Transaksi" description="Riwayat transaksi">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Harga Satuan</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9}>Memuat...</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>Tidak ada data</TableCell>
              </TableRow>
            ) : (
              items.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.user_id}</TableCell>
                  <TableCell>{t.product_id}</TableCell>
                  <TableCell>{t.quantity}</TableCell>
                  <TableCell>{t.unit_price.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{t.total_price.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{t.transaction_type}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(t.id)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </TableCard>
  );
} 