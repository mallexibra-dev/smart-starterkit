import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";

function Index() {
  return (
    <ContainerLayout title="Smart Starterkit">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Smart Starterkit</h1>
          <p className="text-xl text-muted-foreground">
            A modern TypeScript fullstack starterkit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Frontend</h3>
            <p className="text-muted-foreground">React 19 + Vite + Tailwind CSS</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Backend</h3>
            <p className="text-muted-foreground">Hono + PostgreSQL + TypeScript</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Tools</h3>
            <p className="text-muted-foreground">Docker + Testing + ESLint</p>
          </div>
        </div>
      </div>
    </ContainerLayout>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});