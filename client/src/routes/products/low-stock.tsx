import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { productService } from "@/services/product.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  BarChart3,
  Eye,
  RefreshCw,
  Edit,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";
import { useToastHelpers } from "@/components/blocks/toast";

export const Route = createFileRoute("/products/low-stock")({
  component: ProductLowStock,
});

function ProductLowStock() {
  const navigate = useNavigate();
  const toast = useToastHelpers();
  const [loading, setLoading] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const loadLowStockProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getLowStockProducts();
      setLowStockProducts(data);
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
    await loadLowStockProducts();
    toast.success("Success", "Low stock data refreshed");
  };

  const getStockStatus = (current: number, minimum: number) => {
    const percentage = (current / minimum) * 100;
    if (percentage <= 25)
      return {
        level: "critical",
        color: "text-red-600 bg-red-50 border-red-200",
        icon: AlertTriangle,
      };
    if (percentage <= 50)
      return {
        level: "warning",
        color: "text-orange-600 bg-orange-50 border-orange-200",
        icon: TrendingDown,
      };
    return {
      level: "low",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      icon: Package,
    };
  };

  return (
    <ContainerLayout title="Low Stock Products">
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Low Stock Products
                </h1>
                <p className="text-muted-foreground">
                  Products that need restocking soon
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                onClick={() => navigate({ to: "/products/" })}
                className="gap-2"
              >
                <Package className="h-4 w-4" />
                All Products
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm text-red-600 font-medium">
                      Critical Stock
                    </p>
                    <p className="text-2xl font-bold text-red-700">
                      {
                        lowStockProducts.filter((p) => {
                          const status = getStockStatus(
                            p.stock_quantity,
                            p.min_stock_level,
                          );
                          return status.level === "critical";
                        }).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-orange-600 font-medium">
                      Warning Level
                    </p>
                    <p className="text-2xl font-bold text-orange-700">
                      {
                        lowStockProducts.filter((p) => {
                          const status = getStockStatus(
                            p.stock_quantity,
                            p.min_stock_level,
                          );
                          return status.level === "warning";
                        }).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">
                      Low Stock
                    </p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {
                        lowStockProducts.filter((p) => {
                          const status = getStockStatus(
                            p.stock_quantity,
                            p.min_stock_level,
                          );
                          return status.level === "low";
                        }).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">
              Products Needing Attention
            </h2>
            <Badge variant="secondary" className="ml-2">
              {lowStockProducts.length} items
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lowStockProducts.map((product) => {
              const stockStatus = getStockStatus(
                product.stock_quantity,
                product.min_stock_level,
              );
              const StatusIcon = stockStatus.icon;

              return (
                <Card
                  key={product.id}
                  className={`hover:shadow-lg transition-all duration-200 border-2 ${stockStatus.color.split(" ")[2]}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg ${stockStatus.color.split(" ")[1]}`}
                        >
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {product.category_name || "Unknown"}
                        </Badge>
                      </div>
                      <Badge
                        variant={
                          product.status === "active" ? "default" : "secondary"
                        }
                        className={
                          product.status === "active"
                            ? "text-green-700 bg-green-100"
                            : "text-orange-600 bg-orange-100"
                        }
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-1">
                      {product.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stock Information */}
                    <div
                      className={`p-3 rounded-lg border ${stockStatus.color}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Stock Status
                        </span>
                        <div className="flex items-center gap-1">
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-sm font-bold capitalize">
                            {stockStatus.level}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Current
                          </p>
                          <p className="text-lg font-bold">
                            {product.stock_quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Minimum
                          </p>
                          <p className="text-lg font-bold">
                            {product.min_stock_level}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              stockStatus.level === "critical"
                                ? "bg-red-500"
                                : stockStatus.level === "warning"
                                  ? "bg-orange-500"
                                  : "bg-yellow-500"
                            }`}
                            style={{
                              width: `${Math.min((product.stock_quantity / product.min_stock_level) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Product Description */}
                    {product.description && (
                      <div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    )}

                    {/* Price and Actions */}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="text-lg font-bold text-green-600">
                          {productService.formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate({ to: `/products/${product.id}` })
                          }
                          className="gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            navigate({
                              to: `/products/edit/${product.id}`,
                              state: {
                                from: "/categories",
                                category: product.category_slug,
                              },
                            })
                          }
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {lowStockProducts.length === 0 && !loading && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-green-100 rounded-full mb-4">
                <Package className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-700">
                All Stock Levels Healthy!
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Great job! All products have sufficient stock levels. Your
                inventory is well-maintained.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate({ to: "/products/" })}
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  View All Products
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && lowStockProducts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Checking Stock Levels...
              </h3>
              <p className="text-muted-foreground text-center">
                Analyzing your inventory for low stock items
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ContainerLayout>
  );
}
