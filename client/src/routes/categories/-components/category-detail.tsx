import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormInput } from "@/components/blocks/forms/form-input";
import { FormTextarea } from "@/components/blocks/forms/form-textarea";
import { useToastHelpers } from "@/components/blocks/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, Save, X, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { categoryService } from "@/services/category.service";
import { createCategorySchema } from "shared/src/validation/category.validation";
import type { z } from "zod";

// Simple form schema for editing category (name and description only)
const formSchema = createCategorySchema;

type FormData = z.infer<typeof formSchema>;

interface CategoryDetailProps {
  categoryId: number;
}

export function CategoryDetail({ categoryId }: CategoryDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const toast = useToastHelpers();

  const { data: category, isLoading, error, refetch } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => categoryService.getCategoryById(categoryId),
    enabled: !!categoryId,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [category, form]);

  const onSubmit = async (data: FormData) => {
    try {
      await categoryService.updateCategory(categoryId, data);
      setIsEditing(false);
      refetch();
      toast.success("Success", "Category updated successfully");
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Error", "Failed to update category");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (category) {
      form.reset({
        name: category.name || "",
        description: category.description || "",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/categories" })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/categories" })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load category. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ButtonShowcase
            variant="outline"
            size="sm"
            label="Back to Categories"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate({ to: "/categories" })}
          />
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">Category ID: {category.id}</p>
          </div>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Category
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>
              {isEditing ? "Edit the category details below." : "View and manage category information."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground mt-1">{category.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description || "No description provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    <Badge
                      variant={category.status === "active" ? "default" : "secondary"}
                    >
                      {category.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(category.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Updated</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.updated_at ? new Date(category.updated_at).toLocaleDateString() : "Never"}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                  id="name"
                  label="Name"
                  placeholder="Enter category name"
                  value={form.watch("name")}
                  onChange={(value) => form.setValue("name", value)}
                  error={form.formState.errors.name?.message}
                />
                <FormTextarea
                  id="description"
                  label="Description"
                  placeholder="Enter category description"
                  value={form.watch("description")}
                  onChange={(value) => form.setValue("description", value)}
                  error={form.formState.errors.description?.message}
                />
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}