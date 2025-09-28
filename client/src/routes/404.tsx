import { createFileRoute } from "@tanstack/react-router";
import { NotFoundLayout } from "@/components/layout/NotFoundLayout";

export const Route = createFileRoute("/404")({
  component: NotFound,
});

function NotFound() {
  return (
    <NotFoundLayout>
      {/* Icon 404 */}
      <div className="mb-6">
        <div className="text-8xl font-bold text-purple-600 dark:text-purple-400 mb-2">
          404
        </div>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
      </div>

      {/* Pesan Error */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. 
          Mungkin halaman tersebut telah dipindahkan atau dihapus.
        </p>
      </div>
    </NotFoundLayout>
  );
}

export default NotFound; 