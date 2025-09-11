import { createFileRoute } from "@tanstack/react-router";
import { HeaderUser } from "./-components/HeaderUser";

export const Route = createFileRoute("/(app)/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <HeaderUser />
      <div>Hello "/users/"!</div>
    </>
  );
}
