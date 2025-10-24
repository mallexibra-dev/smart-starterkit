import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { productService } from "@/services/product.service";
import { Product } from "shared/src/types/products.type";
import { ProductCategoryOptions } from "shared/src/constants/category.constants";
import { ProductStatusOptions } from "shared/src/constants/product.constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Edit,
  Trash,
  Package,
  Box,
  AlertTriangle,
  Calendar,
  Tag,
  Scale
} from "lucide-react";
import { useToastHelpers } from "@/components/blocks/toast";

interface ProductDetailProps {
  productId: number;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const navigate = useNavigate();
  const toast = useToastHelpers();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [restockLoading, setRestockLoading] = useState(false);
  const [activateLoading, setActivateLoading] = useState(false);
  const [restockAmount, setRestockAmount] = useState<string>("");

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (error) {
      toast.error("Error", "Failed to load product");
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    try {
      setDeleteLoading(true);
      await productService.deleteProduct(product.id);
      toast.success("Success", "Product deleted successfully");
      navigate({
    to: "/products",
    search: {
      page: 1,
      limit: 10,
      sort_by: "created_at",
      sort_order: "desc",
      search: "",
      category_id: undefined,
      status: ""
    }
  });
    } catch (error) {
      toast.error("Error", "Failed to delete product");
      console.error("Error deleting product:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = () => {
    navigate({ to: `/products/edit/${product?.id}` });
  };

  const handleRestock = async () => {
    if (!product || !restockAmount || parseInt(restockAmount) <= 0) return;

    try {
      setRestockLoading(true);
      const quantity = parseInt(restockAmount);

      await productService.restockProduct(product.id, quantity);

      toast.success("Success", `Product restocked with ${quantity} units`);

      // Reload product to get updated data
      await loadProduct();
      setRestockAmount("");
    } catch (error) {
      toast.error("Error", "Failed to restock product");
      console.error("Error restocking product:", error);
    } finally {
      setRestockLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!product) return;

    try {
      setActivateLoading(true);
      await productService.activateProduct(product.id);
      toast.success("Success", "Product activated successfully");

      // Reload product to get updated data
      await loadProduct();
    } catch (error) {
      toast.error("Error", "Failed to activate product");
      console.error("Error activating product:", error);
    } finally {
      setActivateLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!product) return;

    try {
      setActivateLoading(true);
      await productService.deactivateProduct(product.id);
      toast.success("Success", "Product deactivated successfully");

      // Reload product to get updated data
      await loadProduct();
    } catch (error) {
      toast.error("Error", "Failed to deactivate product");
      console.error("Error deactivating product:", error);
    } finally {
      setActivateLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusOption = ProductStatusOptions.find(opt => opt.value === status);
    return (
      <Badge variant={statusOption?.color === 'green' ? 'default' : 'secondary'}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string | any) => {
    // If category is an object with name property
    if (typeof category === 'object' && category.name) {
      return (
        <Badge variant="outline">
          {category.name}
        </Badge>
      );
    }

    // If category is a string (for backward compatibility)
    if (typeof category === 'string') {
      const categoryOption = ProductCategoryOptions.find(opt => opt.value === category);
      return (
        <Badge variant="outline">
          {categoryOption?.label || category}
        </Badge>
      );
    }

    // Fallback
    return <Badge variant="outline">Unknown</Badge>;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
        <Button onClick={() => navigate({
    to: "/products",
    search: {
      page: 1,
      limit: 10,
      sort_by: "created_at",
      sort_order: "desc",
      search: "",
      category_id: undefined,
      status: ""
    }
  })} className="mt-4">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({
    to: "/products",
    search: {
      page: 1,
      limit: 10,
      sort_by: "created_at",
      sort_order: "desc",
      search: "",
      category_id: undefined,
      status: ""
    }
  })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the product
                  "{product.name}" from your inventory.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={deleteLoading}>
                  {deleteLoading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Status and Category */}
      <div className="flex flex-wrap gap-2">
        {getStatusBadge(product.status)}
        {getCategoryBadge(product.category)}
        {getStockBadge(product)}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">
                  {product.description || "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Price</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {productService.formatPrice(product.price)}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  {getCategoryBadge(product.category)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Inventory Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Stock Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Current Stock:</span>
                      <span className="font-bold">{product.stock_quantity} units</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Minimum Level:</span>
                      <span className="font-bold">{product.min_stock_level} units</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStockBadge(product)}
                    </div>
                  </div>
                </div>

                {productService.isLowStock(product) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">Low Stock Alert</span>
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">
                      This product is running low on stock. Consider restocking soon.
                    </p>
                  </div>
                )}

                {productService.isOutOfStock(product) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">Out of Stock</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      This product is completely out of stock and needs immediate attention.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Physical Attributes */}
          {(product.weight || product.dimensions) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Physical Attributes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.weight && (
                    <div>
                      <h3 className="font-semibold mb-2">Weight</h3>
                      <p>{product.weight} kg</p>
                    </div>
                  )}

                  {product.dimensions && (
                    <div>
                      <h3 className="font-semibold mb-2">Dimensions</h3>
                      <p>{product.dimensions}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Meta Information */}
        <div className="space-y-6">
          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-semibold">
                  {new Date(product.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(product.created_at).toLocaleString()}
                </p>
              </div>

              {product.updated_at && (
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-semibold">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(product.updated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common actions for this product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleEdit} className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Button>

              {productService.isLowStock(product) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Box className="h-4 w-4 mr-2" />
                      Restock Item
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Restock Product</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter the quantity to add to current stock. Current stock: {product.stock_quantity} units
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Input
                        type="number"
                        placeholder="Enter quantity"
                        value={restockAmount}
                        onChange={(e) => setRestockAmount(e.target.value)}
                        min="1"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setRestockAmount("")}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRestock}
                        disabled={!restockAmount || parseInt(restockAmount) <= 0 || restockLoading}
                      >
                        {restockLoading ? "Restocking..." : "Restock"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {product.status !== 'active' && (
                <Button variant="outline" className="w-full" onClick={handleActivate} disabled={activateLoading}>
                  <Package className="h-4 w-4 mr-2" />
                  {activateLoading ? "Activating..." : "Activate Product"}
                </Button>
              )}

              {product.status === 'active' && (
                <Button variant="outline" className="w-full" onClick={handleDeactivate} disabled={activateLoading}>
                  <Package className="h-4 w-4 mr-2" />
                  {activateLoading ? "Deactivating..." : "Deactivate Product"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}