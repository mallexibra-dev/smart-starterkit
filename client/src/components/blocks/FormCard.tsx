import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface FormCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: (e?: React.FormEvent) => void;
  onReset?: () => void;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  submitVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  submitClassName?: string;
  isSubmitting?: boolean;
}

export const FormCard = ({
  title,
  description,
  children,
  onSubmit,
  onReset,
  submitText = "Simpan",
  resetText = "Reset",
  showReset = true,
  submitVariant = "default",
  submitClassName = "bg-purple-600 hover:bg-purple-700 text-white",
  isSubmitting = false
}: FormCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-purple-700 dark:text-purple-300">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <div className="flex gap-2">
            <Button
              type="submit"
              variant={submitVariant}
              className={submitClassName}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : submitText}
            </Button>
            {showReset && (
              <Button type="button" variant="outline" onClick={onReset} disabled={isSubmitting}>
                {resetText}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 