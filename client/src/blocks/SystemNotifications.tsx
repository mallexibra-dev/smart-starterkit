import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const SystemNotifications = () => {
  return (
    <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-700">
      <CardHeader>
        <CardTitle className="text-pink-700 dark:text-pink-300">Notifikasi Sistem</CardTitle>
        <CardDescription>
          Pemberitahuan penting dari sistem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border-l-4 border-yellow-500">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Peringatan</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Server load tinggi - 85%</p>
          </div>
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border-l-4 border-green-500">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">Berhasil</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Backup database selesai</p>
          </div>
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Info</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Update sistem tersedia</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 