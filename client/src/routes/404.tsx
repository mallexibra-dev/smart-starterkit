import { createFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NotFound } from "@/components/NotFound";

function PageComponent() {
  return (
    <ErrorBoundary>
      <NotFound />
    </ErrorBoundary>
  );
}

export const Route = createFileRoute("/404")({
  component: PageComponent,
});