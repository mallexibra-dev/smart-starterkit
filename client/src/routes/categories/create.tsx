import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToastHelpers } from "@/components/blocks/toast";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema } from "shared/src/validation/category.validation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const Route = createFileRoute("/categories/create")({
  component: CreateCategory,
});

function CreateCategory() {
  const navigate = useNavigate();
  const toast = useToastHelpers();
  const queryClient = useQueryClient();

  // Initialize form with React Hook Form and Zod validation
  const form = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      icon: undefined,
      color: undefined,
      sort_order: 0,
      status: "active" as const,
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      toast.success("Success", "Category created successfully");
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryStats"] });
      navigate({ to: "/categories" });
    },
    onError: (error: Error) => {
      toast.error("Error", error.message || "Failed to create category");
      console.error("Error creating category:", error);
    },
  });

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

  const onSubmit = (data: any) => {
    createCategoryMutation.mutate(data);
  };

  return (
    <ContainerLayout title="Create Category">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/categories" })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Button>
          <h1 className="text-2xl font-bold">Create New Category</h1>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Category Name *</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Enter category name"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            // Auto-generate slug from name
                            const slug = e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9\s-]/g, "-")
                              .replace(/[\s_-]+/g, "-")
                              .replace(/^-+|-+$/g, "");
                            form.setValue("slug", slug);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="slug">Slug *</FormLabel>
                      <FormControl>
                        <Input
                          id="slug"
                          placeholder="category-slug"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL-friendly identifier for the category
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="description">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          id="description"
                          placeholder="Enter category description"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Icon */}
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="icon">Icon</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "" ? undefined : value)
                        }
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">
                                  {icon.label === icon.value
                                    ? icon.value.charAt(0).toUpperCase()
                                    : icon.value}
                                </span>
                                {icon.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Color */}
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="color">Color</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "" ? undefined : value)
                        }
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-4 h-4 rounded border border-gray-300"
                                  style={{ backgroundColor: color.value }}
                                />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sort Order */}
                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="sort_order">Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          id="sort_order"
                          type="number"
                          placeholder="0"
                          min="0"
                          value={Number(field.value) || 0}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription>
                        Controls the order of categories (lower numbers appear
                        first)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="status">Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={createCategoryMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {createCategoryMutation.isPending
                      ? "Creating..."
                      : "Create Category"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </ContainerLayout>
  );
}
