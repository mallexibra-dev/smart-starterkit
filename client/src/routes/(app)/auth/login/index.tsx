import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormLogin } from "./-components/FormLogin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/(app)/auth/login/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Please sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <FormLogin onSuccess={() => navigate({ to: "/" })} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
