import { Container } from "@/components/layout/Container";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { 
  StatsCards, 
  UserForm, 
  UserTable, 
  ActivityFeed, 
  SystemNotifications 
} from "@/blocks";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <Container>
        <div className="space-y-6">
          {/* Header Dashboard */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Selamat datang di panel administrasi</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Tambah Data Baru
            </Button>
          </div>

          {/* Cards Statistik */}
          <StatsCards />

          {/* Form dan Tabel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserForm />
            <UserTable />
          </div>

          {/* Card Informasi Tambahan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActivityFeed />
            <SystemNotifications />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Index;
