import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Total Pengguna
          </CardTitle>
          <div className="h-4 w-4 text-blue-600 dark:text-blue-400">👥</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">1,234</div>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            +12% dari bulan lalu
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
            Pendapatan
          </CardTitle>
          <div className="h-4 w-4 text-green-600 dark:text-green-400">💰</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">Rp 45.2M</div>
          <p className="text-xs text-green-600 dark:text-green-400">
            +8% dari bulan lalu
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Transaksi
          </CardTitle>
          <div className="h-4 w-4 text-purple-600 dark:text-purple-400">📊</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">892</div>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            +23% dari bulan lalu
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
            Konversi
          </CardTitle>
          <div className="h-4 w-4 text-orange-600 dark:text-orange-400">📈</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">3.2%</div>
          <p className="text-xs text-orange-600 dark:text-orange-400">
            +0.5% dari bulan lalu
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 