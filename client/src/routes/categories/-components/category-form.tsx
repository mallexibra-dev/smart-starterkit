import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { categoryService } from "@/services/category.service";
import { Category, CreateCategoryData, UpdateCategoryData } from "shared/src/types/category.type";
import { CategoryStatusOptions } from "shared/src/constants/product.constants";
import { createCategorySchema, updateCategorySchema } from "shared/src/validation/category.validation";
import { FormInput } from "@/components/blocks/forms/form-input";
import { FormSelect } from "@/components/blocks/forms/form-select";
import { FormTextarea } from "@/components/blocks/forms/form-textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToastHelpers } from "@/components/blocks/toast";
import { ArrowLeft, Save, X } from "lucide-react";

interface CategoryFormProps {
  mode: "create" | "edit";
  categoryId?: number;
  initialData?: Category;
}

export function CategoryForm({ mode, categoryId, initialData }: CategoryFormProps) {
  const navigate = useNavigate();
  const toastHelpers = useToastHelpers();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryData | UpdateCategoryData>({
    name: "",
    slug: "",
    description: "",
    icon: undefined,
    color: undefined,
    sort_order: 0,
    status: "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "edit" && categoryId) {
      loadCategory();
    } else if (initialData) {
      setFormData({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || "",
        icon: initialData.icon,
        color: initialData.color,
        sort_order: initialData.sort_order,
        status: initialData.status,
      });
    }
  }, [mode, categoryId, initialData]);

  const loadCategory = async () => {
    if (!categoryId) return;

    try {
      setLoading(true);
      const category = await categoryService.getCategoryById(categoryId);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        icon: category.icon,
        color: category.color,
        sort_order: category.sort_order,
        status: category.status,
      });
    } catch (error) {
      toastHelpers.error("Error", "Failed to load category");
      console.error("Error loading category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug from name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "-")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData(prev => ({ ...prev, slug }));
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const schema = mode === "create" ? createCategorySchema : updateCategorySchema;
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
        await categoryService.createCategory(formData as CreateCategoryData);
        toastHelpers.success("Success", "Category created successfully");
        navigate({ to: "/categories" });
      } else if (categoryId) {
        await categoryService.updateCategory(categoryId, formData as UpdateCategoryData);
        toastHelpers.success("Success", "Category updated successfully");
        navigate({ to: "/categories" });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to save category";
      toastHelpers.error("Error", errorMessage);
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/categories" });
  };

  const colorOptions = [
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "red", label: "Red" },
    { value: "purple", label: "Purple" },
    { value: "orange", label: "Orange" },
    { value: "pink", label: "Pink" },
    { value: "brown", label: "Brown" },
    { value: "gray", label: "Gray" },
    { value: "teal", label: "Teal" },
  ];

  const iconOptions = [
    { value: "laptop", label: "Laptop" },
    { value: "package", label: "Package" },
    { value: "shirt", label: "Shirt" },
    { value: "coffee", label: "Coffee" },
    { value: "book", label: "Book" },
    { value: "home", label: "Home" },
    { value: "basketball", label: "Basketball" },
    { value: "gamepad", label: "Gamepad" },
    { value: "car", label: "Car" },
    { value: "heart", label: "Heart" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {mode === "create" ? "Create Category" : "Edit Category"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "create"
              ? "Add a new category to organize your products"
              : "Update category information"
            }
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Category details and identifiers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="name"
              label="Category Name"
              placeholder="Enter category name"
              value={formData.name || ""}
              onChange={(value) => handleInputChange("name", value)}
              error={errors.name}
              required
            />

            <FormInput
              id="slug"
              label="Slug"
              placeholder="category-slug"
              value={formData.slug || ""}
              onChange={(value) => handleInputChange("slug", value)}
              error={errors.slug}
              required
              description="URL-friendly identifier for the category"
            />
          </div>

          <FormTextarea
            id="description"
            label="Description"
            placeholder="Enter category description"
            value={formData.description || ""}
            onChange={(value) => handleInputChange("description", value)}
            rows={4}
            error={errors.description}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              id="icon"
              label="Icon"
              placeholder="Select an icon"
              value={formData.icon || ""}
              onValueChange={(value) => handleInputChange("icon", value === "" ? undefined : value)}
              error={errors.icon}
              options={iconOptions.map(icon => ({
                value: icon.value,
                label: icon.label,
                display: (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {icon.label === icon.value
                        ? icon.value.charAt(0).toUpperCase()
                        : icon.value}
                    </span>
                    {icon.label}
                  </div>
                )
              }))}
            />

            <FormSelect
              id="color"
              label="Color"
              placeholder="Select a color"
              value={formData.color || ""}
              onValueChange={(value) => handleInputChange("color", value === "" ? undefined : value)}
              error={errors.color}
              options={colorOptions.map(color => ({
                value: color.value,
                label: color.label,
                display: (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.label}
                  </div>
                )
              }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="sort_order"
              label="Sort Order"
              type="number"
              placeholder="0"
              value={String(formData.sort_order || 0)}
              onChange={(value) => handleInputChange("sort_order", parseInt(value) || 0)}
              error={errors.sort_order}
              description="Controls the order of categories (lower numbers appear first)"
            />

            <FormSelect
              id="status"
              label="Status"
              placeholder="Select status"
              value={formData.status || ""}
              onValueChange={(value) => handleInputChange("status", value)}
              error={errors.status}
              options={CategoryStatusOptions.map(opt => ({ value: opt.value, label: opt.label }))}
            />
          </div>
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
          {loading ? "Saving..." : mode === "create" ? "Create Category" : "Update Category"}
        </Button>
      </div>
    </form>
  );
}