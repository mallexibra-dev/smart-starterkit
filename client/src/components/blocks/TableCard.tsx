import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface TableCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const TableCard = ({
  title,
  description,
  children
}: TableCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-purple-700 dark:text-purple-300">{title}</CardTitle>
        {description && (
          <CardDescription className="dark:text-gray-300">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}; 