import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormRegister } from "./-components/FormRegister";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export const Route = createFileRoute("/(app)/auth/register/")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <FormRegister onSuccess={() => navigate({ to: "/" })} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}