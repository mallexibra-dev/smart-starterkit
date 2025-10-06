import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/blocks/Table";
import { type TableColumn } from "@/components/blocks/Table";
import { RecentTransaction } from "shared/types";
import { formatRupiah } from "@/lib/currency";

interface RecentTransactionsTableProps {
  data: RecentTransaction[];
}

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  refunded: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

export function RecentTransactionsTable({ data }: RecentTransactionsTableProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns: TableColumn<RecentTransaction>[] = [
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      cellRender: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'productName',
      header: 'Product',
      sortable: true,
      truncate: true,
      cellRender: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      cellRender: (value) => (
        <span className="font-mono text-sm">
          {formatRupiah(value)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cellRender: (value) => getStatusBadge(value)
    },
    {
      key: 'paymentMethod',
      header: 'Payment',
      sortable: true,
      cellRender: (value) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      cellRender: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(value)}
        </span>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Latest customer transactions
        </p>
      </div>
      <DataTable
        data={data}
        columns={columns}
        striped={true}
        showHover={true}
        emptyStateConfig={{
          message: 'No recent transactions found',
          description: 'No transactions available at the moment.'
        }}
      />
    </div>
  );
}