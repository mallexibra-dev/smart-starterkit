import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ActivityFeed = () => {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
      <CardHeader>
        <CardTitle className="text-indigo-700 dark:text-indigo-300">Aktivitas Terbaru</CardTitle>
        <CardDescription>
          Daftar aktivitas pengguna dalam 24 jam terakhir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">John Doe login</p>
              <p className="text-xs text-gray-500">2 menit yang lalu</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Jane Smith update profile</p>
              <p className="text-xs text-gray-500">15 menit yang lalu</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Bob Johnson membuat pesanan</p>
              <p className="text-xs text-gray-500">1 jam yang lalu</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 