import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { ApiResponse } from "shared";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useLogout } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [data, setData] = useState<ApiResponse | undefined>();

  const { mutate: sendRequest } = useMutation({
    mutationFn: async () => {
      const res = await api.get<ApiResponse>(`/auth/me`);
      return res.data;
    },
    onSuccess: (res) => {
      setData(res);
    },
    onError: (err) => {
      console.error("Request error:", err);
    },
  });

  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: "/auth/login" });
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <div className="flex items-center gap-4">
        <Button onClick={() => sendRequest()}>Call API</Button>
        <Button onClick={handleLogout} disabled={logoutMutation.isPending}>
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
      {data && (
        <pre className="bg-gray-100 p-4 rounded-md">
          <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
          </code>
        </pre>
      )}
    </div>
  );
}

export default Index;
