import { useState, useMemo } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { ProductQuery, Product, ProductStatusOptions, ProductStatus } from "@/types/product";
import { TableAdvanced } from "@/components/blocks/tables/table-advanced";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Filter, Package, AlertTriangle, Eye, Edit, Trash } from "lucide-react";
import { useToastHelpers } from "@/components/blocks/custom-toast";

export function ProductList() {
  const navigate = useNavigate();
  const toast = useToastHelpers();
  const queryClient = useQueryClient();

  // Get URL search params
  const searchParams = useSearch({ from: "/products/" });

  // Build query from URL params
  const query: ProductQuery = useMemo(() => ({
    page: (searchParams.page as number) || 1,
    limit: (searchParams.limit as number) || 10,
    sort_by: (searchParams.sort_by as 'name' | 'price' | 'created_at' | 'updated_at') || 'created_at',
    sort_order: (searchParams.sort_order as 'asc' | 'desc') || 'desc',
    search: (searchParams.search as string) || undefined,
    category_id: (searchParams.category_id as number) || undefined,
    status: (searchParams.status as ProductStatus) || undefined,
  }), [searchParams]);

  // TanStack Query hooks
  const { data: productsData, isLoading: loading, error: productsError } = useQuery({
    queryKey: ['products', query],
    queryFn: () => productService.getProducts(query),
    staleTime: 30 * 1000, // 30 seconds
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['category-options'],
    queryFn: () => categoryService.getCategoryOptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log("Categories:", categories);

  const { data: stats = {
    total_products: 0,
    low_stock: 0,
    out_of_stock: 0,
    active: 0
  } } = useQuery({
    queryKey: ['product-stats'],
    queryFn: () => productService.getProductStats(),
    staleTime: 60 * 1000, // 1 minute
  });

  // Extract data from query results
  const products = productsData?.data || [];
  const pagination = productsData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0
  };

  // Handle query errors
  if (productsError) {
    toast.error("Error", "Failed to load products");
    console.error("Error loading products:", productsError);
  }

  const updateUrl = (newParams: Partial<ProductQuery>) => {
    navigate({
      to: "/products",
      search: (prev: any) => ({ ...prev, ...newParams }),
    });
  };

  const handleSearch = (value: string) => {
    updateUrl({ search: value || undefined, page: 1 });
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'category_id') {
      updateUrl({ category_id: value === "all" || value === "" ? undefined : Number(value), page: 1 });
    } else {
      updateUrl({ [key]: value === "all" || value === "" ? undefined : value, page: 1 });
    }
  };

  const handlePageChange = (page: number) => {
    updateUrl({ page });
  };

  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (productId: number) => productService.deleteProduct(productId),
    onSuccess: () => {
      toast.success("Success", "Product deleted successfully");
      // Invalidate related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
    },
    onError: (error) => {
      toast.error("Error", "Failed to delete product");
      console.error("Error deleting product:", error);
    },
  });

  const handleDelete = async (product: Product) => {
    deleteMutation.mutate(product.id);
  };

  const getStatusBadge = (status: string) => {
    const statusOption = ProductStatusOptions.find(opt => opt.value === status);
    return (
      <Badge variant={statusOption?.color === 'green' ? 'default' : 'secondary'}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const getStockBadge = (product: Product) => {
    const stockStatus = productService.getStockStatus(product);
    if (stockStatus === 'out') {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stockStatus === 'low') {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Low Stock</Badge>;
    }
    return <Badge variant="outline" className="border-green-500 text-green-700">In Stock</Badge>;
  };

  const columns = [
    { key: "name", header: "Product Name" },
    { key: "sku", header: "SKU" },
    { key: "category", header: "Category" },
    { key: "price", header: "Price" },
    { key: "stock", header: "Stock Status" },
    { key: "status", header: "Status" },
    { key: "created_at", header: "Created" },
  ];

  const renderPrice = (price: number) => (
    <span className="font-bold text-green-600">
      {productService.formatPrice(price)}
    </span>
  );

  const renderStock = (product: Product | undefined) => {
    if (!product) {
      return <div className="text-sm text-gray-500">No data</div>;
    }

    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm">{product.stock_quantity || 0} units</span>
        {getStockBadge(product)}
      </div>
    );
  };

  const renderCategory = (category: any) => {
    if (!category) {
      return <div className="text-sm text-gray-500">No category</div>;
    }

    // If category is an object with name property
    if (typeof category === 'object' && category.name) {
      return (
        <Badge variant="outline">
          {category.name}
        </Badge>
      );
    }

    
    // Fallback
    return <Badge variant="outline">Unknown</Badge>;
  };

  const DeleteMenuItem = ({ product, onDelete }: { product: Product; onDelete: () => void }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive focus:text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product "{product.name}" and remove all associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const actions = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: Product) => navigate({ to: `/products/${row.id}` }),
      variant: "ghost" as const,
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: Product) => navigate({ to: `/products/edit/${row.id}` }),
      variant: "ghost" as const,
    },
    {
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      onClick: (_row: Product) => {}, // No-op - handled by DeleteMenuItem
      variant: "destructive" as const,
      customComponent: (row: Product) => (
        <DeleteMenuItem
          product={row}
          onDelete={() => handleDelete(row)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={() => navigate({ to: "/products/create" })}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_products}</div>
            <p className="text-xs text-muted-foreground">In your inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.low_stock}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.out_of_stock}
            </div>
            <p className="text-xs text-muted-foreground">Require restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground">Currently selling</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={query.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={query.category_id?.toString() || "all"} onValueChange={(value) => handleFilterChange('category_id', value)}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value.toString()}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={query.status || "all"} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {ProductStatusOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-muted-foreground">Loading products...</div>
        </div>
      ) : (
        <TableAdvanced
          data={products}
          columns={columns}
          renderers={{
            price: renderPrice,
            stock: renderStock,
            category: renderCategory,
            status: getStatusBadge,
            created_at: (value: string) => new Date(value).toLocaleDateString(),
          }}
          actions={actions}
          selectionEnabled
          showBulkActions
          paginationEnabled
          currentPage={pagination.page}
          totalPages={pagination.total_pages}
          pageSize={pagination.limit}
          totalItems={pagination.total}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}