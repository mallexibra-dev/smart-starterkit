import { Container } from "@/components/layout/Container";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { UserForm } from "./-components/UserForm";
import { UserTable } from "./-components/UserTable";
import { StatsCards } from "@/blocks/StatsCards";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const handleAddData = () => {
    console.log("Menambahkan data baru...");
    // Logic untuk menambahkan data baru
  };

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
            
            {/* Alert Dialog untuk Tambah Data */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Tambah Data Baru
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-purple-700 dark:text-purple-300">
                    Tambah Data Baru
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menambahkan data baru ke sistem? 
                    Tindakan ini akan membuat entri baru dalam database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleAddData}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Ya, Tambahkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Cards Statistik */}
          <StatsCards />

          {/* Form dan Tabel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserForm />
            <UserTable />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Index;
