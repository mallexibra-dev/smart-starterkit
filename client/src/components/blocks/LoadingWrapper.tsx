import { Skeleton } from "@/components/ui/skeleton";

interface LoadingWrapperProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
}

export function LoadingWrapper({ isLoading, text = "Loading...", children }: LoadingWrapperProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          {text}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}