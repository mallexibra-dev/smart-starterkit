import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableAdvanced } from "@/components/blocks/tables/table-advanced";
import {
  AlertTriangle,
  RefreshCw,
  Package,
  Box,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useToastHelpers } from "@/components/blocks/toast";

export function LowStockAlert() {
  const navigate = useNavigate();
  const toast = useToastHelpers();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLowStockProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getLowStockProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Error", "Failed to load low stock products");
      console.error("Error loading low stock products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLowStockProducts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLowStockProducts();
    setRefreshing(false);
  };

  const handleViewProduct = (product: Product) => {
    navigate({ to: `/products/${product.id}` });
  };

  const getStockBadge = (product: Product) => {
    if (product.stock_quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Low Stock</Badge>;
  };

  const getUrgencyLevel = (product: Product) => {
    if (product.stock_quantity === 0) return 'critical';
    if (product.stock_quantity <= product.min_stock_level / 2) return 'high';
    return 'medium';
  };

  const getUrgencyBadge = (product: Product) => {
    const level = getUrgencyLevel(product);
    switch (level) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="outline" className="border-red-500 text-red-700">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const columns = [
    { key: "name", header: "Product Name" },
    { key: "sku", header: "SKU" },
    { key: "stock", header: "Stock Level" },
    { key: "min_stock", header: "Min Level" },
    { key: "urgency", header: "Urgency" },
    { key: "price", header: "Price" },
  ];

  const renderStock = (product: Product) => (
    <div className="text-right">
      <div className="font-bold text-red-600">{product.stock_quantity}</div>
      <div className="text-sm text-gray-500">units</div>
    </div>
  );

  const renderMinStock = (product: Product) => (
    <div className="text-center">
      <div className="font-semibold">{product.min_stock_level}</div>
      {getStockBadge(product)}
    </div>
  );

  const renderPrice = (price: number) => (
    <span className="font-bold text-green-600">
      {productService.formatPrice(price)}
    </span>
  );

  const renderActions = (product: Product) => [
    {
      label: "View Details",
      icon: <ArrowRight className="h-4 w-4" />,
      onClick: () => handleViewProduct(product),
      variant: "outline" as const,
    },
  ];

  const criticalCount = products.filter(p => p.stock_quantity === 0).length;
  const highCount = products.filter(p => p.stock_quantity <= p.min_stock_level / 2 && p.stock_quantity > 0).length;
  const mediumCount = products.filter(p => p.stock_quantity > p.min_stock_level / 2 && p.stock_quantity <= p.min_stock_level).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Low Stock Alerts</h1>
          <p className="text-muted-foreground">Products that need your attention</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Out of stock</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highCount}</div>
            <p className="text-xs text-muted-foreground">Very low stock</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mediumCount}</div>
            <p className="text-xs text-muted-foreground">Below minimum</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Message */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Stock Levels Good!</h3>
              <p className="text-gray-600">
                All products are above their minimum stock levels. No immediate action required.
              </p>
              <Button onClick={() => navigate({ to: "/products/" })} className="mt-4">
                View All Products
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Alert Banner */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    {criticalCount > 0 ? "Immediate Action Required" : "Attention Required"}
                  </h3>
                  <p className="text-yellow-700 text-sm">
                    {criticalCount > 0
                      ? `${criticalCount} product${criticalCount > 1 ? 's' : ''} ${criticalCount === 1 ? 'is' : 'are'} out of stock and need immediate restocking.`
                      : `You have ${products.length} product${products.length > 1 ? 's' : ''} that need restocking attention.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
              <CardDescription>
                Products that are at or below their minimum stock levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableAdvanced
                data={products}
                columns={columns}
                renderers={{
                  stock: renderStock,
                  min_stock: renderMinStock,
                  urgency: getUrgencyBadge,
                  price: renderPrice,
                }}
                actions={renderActions}
                selectionEnabled
                showBulkActions
                bulkActions={[
                  {
                    label: "Create Purchase Order",
                    onClick: (selected) => {
                      toast.info("Feature Coming Soon", "Purchase order creation will be available soon");
                    },
                    variant: "default",
                  },
                  {
                    label: "Mark as In Stock",
                    onClick: (selected) => {
                      toast.info("Feature Coming Soon", "Stock updates will be available soon");
                    },
                    variant: "outline",
                  },
                ]}
                loading={loading}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}