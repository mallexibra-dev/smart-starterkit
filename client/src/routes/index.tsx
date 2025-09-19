import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { UsersResponse } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [data, setData] = useState<UsersResponse | undefined>();

  const { mutate: sendRequest } = useMutation({
    mutationFn: async () => {
      return await userService.getUsers();
    },
    onSuccess: (res) => {
      setData(res);
    },
    onError: (err) => {
      console.error("Request error:", err);
    },
  });

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <div className="flex items-center gap-4">
        <Button onClick={() => sendRequest()}>Call API</Button>
      </div>
      {data && (
        <pre className="bg-gray-100 p-4 rounded-md">
          <code>
            Message: {data.message} <br />
            Success: {data.success.toString()} <br />
            Data: {JSON.stringify(data.data, null, 2)}
          </code>
        </pre>
      )}
    </div>
  );
}

export default Index;
