import { useEffect, useState, useMemo } from "react";
import { listTransactions, deleteTransaction, type TransactionDto } from "@/services/transaction.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/blocks/Table";
import { type TableColumn } from "@/components/blocks/Table";
import { Search } from "@/components/blocks/Search";
import { PriceFilter } from "@/components/blocks/PriceFilter";
import { NumberFilter } from "@/components/blocks/NumberFilter";
import { Trash2, X } from "lucide-react";
import { formatRupiah } from "@/lib/currency";

export function TransactionTable() {
  const [items, setItems] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [minQuantity, setMinQuantity] = useState<number | undefined>();
  const [maxQuantity, setMaxQuantity] = useState<number | undefined>();

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

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search filter
      const searchMatch = searchTerm === "" ||
        item.id.toString().includes(searchTerm) ||
        item.user_id.toString().includes(searchTerm) ||
        item.product_id.toString().includes(searchTerm) ||
        item.transaction_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.payment_method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.created_at.includes(searchTerm);

      // Price filter
      const priceMatch = (minPrice === undefined || item.unit_price >= minPrice) &&
        (maxPrice === undefined || item.unit_price <= maxPrice);

      // Quantity filter
      const quantityMatch = (minQuantity === undefined || item.quantity >= minQuantity) &&
        (maxQuantity === undefined || item.quantity <= maxQuantity);

      return searchMatch && priceMatch && quantityMatch;
    });
  }, [items, searchTerm, minPrice, maxPrice, minQuantity, maxQuantity]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinQuantity(undefined);
    setMaxQuantity(undefined);
  };

  const hasActiveFilters = searchTerm || minPrice !== undefined || maxPrice !== undefined || minQuantity !== undefined || maxQuantity !== undefined;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      completed: "default",
      cancelled: "destructive",
      refunded: "outline"
    };

    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      completed: "bg-green-100 text-green-800 hover:bg-green-200",
      cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
      refunded: "bg-gray-100 text-gray-800 hover:bg-gray-200"
    };

    return (
      <Badge
        variant={variants[status] || "secondary"}
        className={colors[status] || ""}
      >
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      purchase: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      sale: "bg-green-100 text-green-800 hover:bg-green-200",
      return: "bg-orange-100 text-orange-800 hover:bg-orange-200"
    };

    return (
      <Badge
        variant="secondary"
        className={colors[type] || "bg-gray-100 text-gray-800 hover:bg-gray-200"}
      >
        {type}
      </Badge>
    );
  };

  const columns: TableColumn<TransactionDto>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      width: '80px'
    },
    {
      key: 'user_id',
      header: 'User ID',
      sortable: true,
      width: '100px',
      cellRender: (value) => `#${value}`
    },
    {
      key: 'product_id',
      header: 'Product ID',
      sortable: true,
      width: '120px',
      cellRender: (value) => `#${value}`
    },
    {
      key: 'quantity',
      header: 'Qty',
      sortable: true,
      width: '80px',
      cellRender: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'unit_price',
      header: 'Harga Satuan',
      sortable: true,
      cellRender: (value) => (
        <span className="font-mono text-sm">
          {formatRupiah(value)}
        </span>
      )
    },
    {
      key: 'total_price',
      header: 'Total',
      sortable: true,
      cellRender: (value) => (
        <span className="font-mono font-semibold text-sm">
          {formatRupiah(value)}
        </span>
      )
    },
    {
      key: 'transaction_type',
      header: 'Tipe',
      sortable: true,
      cellRender: (value) => getTypeBadge(value)
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cellRender: (value) => getStatusBadge(value)
    },
    {
      key: 'payment_method',
      header: 'Metode Pembayaran',
      sortable: true,
      cellRender: (value) => value || '-'
    },
    {
      key: 'created_at',
      header: 'Tanggal',
      sortable: true,
      cellRender: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
    {
      key: 'actions' as keyof TransactionDto,
      header: 'Aksi',
      align: 'left',
      cellRender: (_: any, row: TransactionDto) => (
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex items-center gap-1">
                <Trash2 className="h-3 w-3" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Hapus Transaksi</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus transaksi #{row.id}?
                  Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.id)}>
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          {/* Search di kiri */}
          <div className="flex-1 max-w-md">
            <Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Cari transaksi..."
            />
          </div>

          {/* Filters di kanan */}
          <div className="flex gap-2 items-center">
            {/* Price Filter */}
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
            />

            {/* Quantity Filter */}
            <NumberFilter
              min={minQuantity}
              max={maxQuantity}
              preset="quantity"
              onChange={(min, max) => {
                setMinQuantity(min);
                setMaxQuantity(max);
              }}
            />

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button variant="ghost" onClick={handleClearFilters} className="flex items-center gap-1">
                <X className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredItems}
        columns={columns}
        loading={loading}
        striped={true}
        bordered={true}
        showHover={true}
        emptyStateConfig={{
          message: 'Tidak Ada Transaksi',
          description: hasActiveFilters ? 'Tidak ada transaksi yang cocok dengan filter yang diterapkan.' : 'Belum ada transaksi yang tersedia.',
        }}
      />
    </div>
  );
}