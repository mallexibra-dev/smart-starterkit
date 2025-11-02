import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { MetricCard } from "@/components/blocks/cards/metric-card";
import { StatusCard } from "@/components/blocks/cards/status-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToastHelpers } from "@/components/blocks/toast";
import { productService } from "@/services/product.service";
import { Package, Tag, BarChart3, Eye, Edit, FolderOpen, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/categories/")({
  component: ProductCategories,
});

function ProductCategories() {
  const navigate = useNavigate();
  const toast = useToastHelpers();

  // Category Stats Query
  const {
    data: categoryStats = [],
    isLoading: categoryStatsLoading,
    error: categoryStatsError,
  } = useQuery({
    queryKey: ["categoryStats"],
    queryFn: async () => {
      return await categoryService.getCategoryStats();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Error handling
  if (categoryStatsError) {
    toast.error("Error", "Failed to load category statistics");
    console.error("Error loading category stats:", categoryStatsError);
  }

  const getCategoryInfo = (categorySlug: string) => {
    const descriptions: Record<string, string> = {
      electronics: "Electronic devices and accessories",
      clothing: "Apparel and fashion items",
      food: "Food and beverages",
      books: "Books, movies, and digital media",
      home: "Home improvement and garden supplies",
      sports: "Sports equipment and outdoor gear",
      toys: "Children's toys and games",
      health: "Health and beauty products",
      automotive: "Automotive parts and accessories",
      other: "Miscellaneous products",
    };

    return {
      label: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
      description: descriptions[categorySlug] || "Various products",
    };
  };

  const totalProducts = categoryStats.reduce(
    (sum, cat) => sum + (cat.product_count || 0),
    0,
  );
  const totalLowStock = categoryStats.reduce(
    (sum, cat) => sum + (cat.low_stock_count || 0),
    0,
  );

  const handleAddCategory = () => {
    navigate({ to: "/categories/create" });
  };

  const handleEditCategory = (categoryId: number) => {
    navigate({ to: `/categories/edit/${categoryId}` });
  };

  if (categoryStatsLoading) {
    return (
      <ContainerLayout title="Product Categories">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">
            Loading category statistics...
          </div>
        </div>
      </ContainerLayout>
    );
  }

  return (
    <ContainerLayout title="Product Categories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Product Categories</h1>
            <p className="text-muted-foreground">
              Manage and view your product categories
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                navigate({
                  to: "/products",
                  search: {
                    page: 1,
                    limit: 10,
                    sort_by: "name",
                    sort_order: "asc",
                    search: "",
                    category_id: undefined,
                    status: "",
                  },
                })
              }
            >
              <Package className="h-4 w-4 mr-2" />
              View All Products
            </Button>
            <Button onClick={handleAddCategory}>
              <Tag className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Total Categories"
            value={categoryStats.length}
            icon={<Package className="h-4 w-4" />}
          />

          <MetricCard
            title="Total Products"
            value={totalProducts.toLocaleString()}
            icon={<BarChart3 className="h-4 w-4" />}
          />

          <StatusCard
            title="Low Stock Alert"
            status={`${totalLowStock} products`}
            description="Products need restocking"
            icon={<AlertTriangle className="h-4 w-4" />}
            variant={totalLowStock > 0 ? "warning" : "success"}
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryStats.map((categoryStat) => {
            const categoryInfo = getCategoryInfo(categoryStat.slug);
            const avgPrice =
              categoryStat.product_count > 0
                ? categoryStat.total_value / categoryStat.product_count
                : 0;

            return (
              <Card
                key={categoryStat.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">
                        {categoryInfo.label}
                      </CardTitle>
                    </div>
                    <Badge variant="secondary">
                      {categoryStat.product_count} items
                    </Badge>
                  </div>
                  <CardDescription>{categoryInfo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total Value:
                      </span>
                      <span className="font-semibold">
                        {productService.formatPrice(
                          categoryStat.total_value || 0,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Avg Price:
                      </span>
                      <span className="font-semibold">
                        {productService.formatPrice(avgPrice)}
                      </span>
                    </div>

                    {categoryStat.low_stock_count > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Low Stock:
                        </span>
                        <Badge
                          variant="outline"
                          className="border-orange-500 text-orange-700"
                        >
                          {categoryStat.low_stock_count} products
                        </Badge>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          navigate({
                            to: "/products",
                            search: {
                              page: 1,
                              limit: 10,
                              sort_by: "name",
                              sort_order: "asc",
                              search: "",
                              category_id: categoryStat.id,
                              status: "",
                            },
                          })
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Products
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(categoryStat.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State for when no categories exist */}
        {categoryStats.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No categories found
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Add products to see category statistics here.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/products/create" })}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
                <Button onClick={handleAddCategory}>
                  <Tag className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ContainerLayout>
  );
}