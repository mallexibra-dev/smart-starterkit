import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";

function Index() {
  return (
    <ContainerLayout title="Welcome">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Smart Starterkit</h1>
          <p className="text-xl text-muted-foreground">
            A clean, modern TypeScript fullstack starterkit
          </p>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">
            Start building your amazing application here!
          </p>
        </div>
      </div>
    </ContainerLayout>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});