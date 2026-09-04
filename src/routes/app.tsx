import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";

export const Route = createFileRoute("/app")({
  ssr: false,
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
