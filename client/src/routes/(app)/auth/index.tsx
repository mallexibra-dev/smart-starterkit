import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/auth/")({
  beforeLoad: ()=>{
    throw redirect({to: "/auth/login"})
  }
});