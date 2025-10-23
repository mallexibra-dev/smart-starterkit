import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { productService } from "@/services/product.service";
import { Product, CreateProductData, UpdateProductData, ProductCategoryOptions, ProductStatusOptions } from "@/types/product";
import { CreateProductSchema, UpdateProductSchema } from "shared/src/validation/products.validation";
import { FormInput } from "@/components/blocks/forms/form-input";
import { FormSelect } from "@/components/blocks/forms/form-select";
import { FormTextarea } from "@/components/blocks/forms/form-textarea";
import { FormTags } from "@/components/blocks/forms/form-tags";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast, useToastHelpers } from "@/components/blocks/toast";
import { ArrowLeft, Save, X } from "lucide-react";

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: number;
  initialData?: Product;
}

export function ProductForm({ mode, productId, initialData }: ProductFormProps) {
  const navigate = useNavigate();
  const toastHelpers = useToastHelpers();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProductData | UpdateProductData>({
    name: "",
    description: "",
    price: 0,
    category_id: 1, // Default category ID, should be fetched from API
    status: "draft",
    sku: "",
    stock_quantity: 0,
    min_stock_level: 0,
    weight: 0,
    dimensions: "",
    images: [],
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "edit" && productId) {
      loadProduct();
    } else if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        price: initialData.price,
        category_id: initialData.category_id,
        status: initialData.status,
        sku: initialData.sku,
        stock_quantity: initialData.stock_quantity,
        min_stock_level: initialData.min_stock_level,
        weight: initialData.weight || 0,
        dimensions: initialData.dimensions || "",
        images: initialData.images || [],
        tags: initialData.tags || [],
      });
    }
  }, [mode, productId, initialData]);

  const loadProduct = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const product = await productService.getProductById(productId);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        category_id: product.category_id,
        status: product.status,
        sku: product.sku,
        stock_quantity: product.stock_quantity,
        min_stock_level: product.min_stock_level,
        weight: product.weight || 0,
        dimensions: product.dimensions || "",
        images: product.images || [],
        tags: product.tags || [],
      });
    } catch (error) {
      toastHelpers.error("Error", "Failed to load product");
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const schema = mode === "create" ? CreateProductSchema : UpdateProductSchema;
    const result = schema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          newErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (mode === "create") {
        await productService.createProduct(formData as CreateProductData);
        toastHelpers.success("Success", "Product created successfully");
        navigate({ to: "/products/" });
      } else if (productId) {
        await productService.updateProduct(productId, formData as UpdateProductData);
        toastHelpers.success("Success", "Product updated successfully");
        navigate({ to: "/products/" });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to save product";
      toastHelpers.error("Error", errorMessage);
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/products/" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {mode === "create" ? "Create Product" : "Edit Product"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "create"
              ? "Add a new product to your inventory"
              : "Update product information"
            }
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Basic product details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="name"
              label="Product Name"
              placeholder="Enter product name"
              value={formData.name || ""}
              onChange={(value) => handleInputChange("name", value)}
              error={errors.name}
              required
            />

            <FormInput
              id="sku"
              label="SKU"
              placeholder="Enter SKU"
              value={formData.sku || ""}
              onChange={(value) => handleInputChange("sku", value)}
              error={errors.sku}
              required
            />
          </div>

          <FormTextarea
            id="description"
            label="Description"
            placeholder="Enter product description"
            value={formData.description || ""}
            onChange={(value) => handleInputChange("description", value)}
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="price"
              label="Price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price || 0}
              onChange={(value) => handleInputChange("price", parseFloat(value) || 0)}
              error={errors.price}
              required
            />

            <FormSelect
              id="category"
              label="Category"
              placeholder="Select category"
              options={ProductCategoryOptions.map(cat => ({ value: cat.value.toString(), label: cat.label }))}
              value={formData.category_id?.toString() || ""}
              onValueChange={(value) => handleInputChange("category_id", parseInt(value) || 1)}
            />
          </div>

          <FormSelect
            id="status"
            label="Status"
            placeholder="Select status"
            options={ProductStatusOptions.map(opt => ({ value: opt.value, label: opt.label }))}
            value={formData.status || ""}
            onValueChange={(value) => handleInputChange("status", value)}
          />
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Stock and inventory management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="stock_quantity"
              label="Stock Quantity"
              type="number"
              placeholder="0"
              value={formData.stock_quantity || 0}
              onChange={(value) => handleInputChange("stock_quantity", parseInt(value) || 0)}
              error={errors.stock_quantity}
            />

            <FormInput
              id="min_stock_level"
              label="Minimum Stock Level"
              type="number"
              placeholder="0"
              value={formData.min_stock_level || 0}
              onChange={(value) => handleInputChange("min_stock_level", parseInt(value) || 0)}
              error={errors.min_stock_level}
            />
          </div>
        </CardContent>
      </Card>

      {/* Physical Attributes */}
      <Card>
        <CardHeader>
          <CardTitle>Physical Attributes</CardTitle>
          <CardDescription>Physical product specifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="weight"
              label="Weight (kg)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.weight || 0}
              onChange={(value) => handleInputChange("weight", parseFloat(value) || 0)}
              error={errors.weight}
            />

            <FormInput
              id="dimensions"
              label="Dimensions"
              placeholder="e.g., 10 x 5 x 2 cm"
              value={formData.dimensions || ""}
              onChange={(value) => handleInputChange("dimensions", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Product tags for better organization and search</CardDescription>
        </CardHeader>
        <CardContent>
          <FormTags
            id="tags"
            label="Product Tags"
            placeholder="Add a tag"
            value={formData.tags || []}
            onChange={(tags) => handleInputChange("tags", tags)}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : mode === "create" ? "Create Product" : "Update Product"}
        </Button>
      </div>
    </form>
  );
}