import { useEffect, useState } from "react";
import { listPaginatedProducts, deleteProduct, type ProductDto, type ProductFilters, type PaginationInfo } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SearchFilter } from "@/components/blocks";
import { Link } from "@tanstack/react-router";
import { Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/blocks/Table";
import { type TableColumn } from "@/components/blocks/Table";
import { formatRupiah } from "@/lib/currency";

export function ProductTable() {
  const [items, setItems] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const load = async (currentFilters?: ProductFilters, page: number = currentPage, currentSortBy?: string, currentSortOrder?: "asc" | "desc") => {
    setLoading(true);
    try {
      const requestFilters = {
        ...currentFilters || filters,
        page,
        limit: pageSize,
        sortBy: currentSortBy || sortBy,
        sortOrder: currentSortOrder || sortOrder
      };
      const result = await listPaginatedProducts(requestFilters);
      setItems(result.data);
      setPagination(result.pagination);
      setCurrentPage(result.pagination.page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    load();
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    setCurrentPage(1);
    load(newFilters, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    load(filters, page);
  };

  const handleSort = (sortState: any) => {
    const column = sortState.sortBy;
    const order = sortState.sortOrder;
    setSortBy(column);
    setSortOrder(order);
    setCurrentPage(1);
    load(filters, 1, column, order);
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge
        variant={status === 'active' ? 'default' : 'secondary'}
        className={status === 'active' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' : ''}
      >
        {status}
      </Badge>
    );
  };

  const columns: TableColumn<ProductDto>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      width: '80px'
    },
    {
      key: 'name',
      header: 'Nama Produk',
      sortable: true,
      truncate: true,
      cellRender: (value) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-xs">
              {value.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="max-w-[200px] truncate" title={value}>
            {value}
          </div>
        </div>
      )
    },
    {
      key: 'sku',
      header: 'SKU',
      sortable: true,
      cellRender: (value) => value || '-'
    },
    {
      key: 'category',
      header: 'Kategori',
      sortable: true,
      cellRender: (value) => value || '-'
    },
    {
      key: 'price',
      header: 'Harga',
      sortable: true,
      cellRender: (value) => (
        <span className="font-mono">
          {formatRupiah(value)}
        </span>
      )
    },
    {
      key: 'stock',
      header: 'Stok',
      sortable: true,
      cellRender: (value) => (
        <span className={`font-medium ${value <= 10 ? 'text-orange-600' : 'text-green-600'}`}>
          {value}
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
      key: 'actions' as keyof ProductDto,
      header: 'Aksi',
      align: 'left',
      cellRender: (_: any, row: ProductDto) => (
        <div className="flex gap-2">
          <Link to={`/products/${row.id}/edit` as any}>
            <Button variant="outline" size="sm" className="flex items-center gap-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300">
              <Edit className="h-3 w-3" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex items-center gap-1">
                <Trash2 className="h-3 w-3" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Hapus Produk</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus produk "{row.name}"?
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-300">Daftar Produk</h1>
          <p className="text-gray-600">Data produk yang tersedia</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" asChild>
          <Link to="/products/new">New Product</Link>
        </Button>
      </div>

      {/* Search and Filters Section */}
      <SearchFilter
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Table */}
      <DataTable
        data={items}
        columns={columns}
        loading={loading}
        pagination={pagination || undefined}
        striped={true}
        bordered={true}
        showHover={true}
        onPageChange={handlePageChange}
        onSortChange={handleSort}
        emptyStateConfig={{
          message: 'Tidak Ada Produk Ditemukan',
          description: 'Produk yang Anda cari tidak tersedia. Coba ubah filter atau kata kunci pencarian.',
          action: (
            <Button className="bg-purple-600 hover:bg-purple-700" asChild>
              <Link to="/products/new">New Product</Link>
            </Button>
          )
        }}
      />
    </div>
  );
}