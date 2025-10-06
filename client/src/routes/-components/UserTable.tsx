import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/blocks/Table";
import { type TableColumn } from "@/components/blocks/Table";
import { Edit, Trash2 } from "lucide-react";

// Data contoh untuk tabel
const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Moderator", status: "Inactive" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "User", status: "Active" },
];

export const UserTable = () => {
  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      Admin: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      Moderator: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      User: "bg-gray-100 text-gray-800 hover:bg-gray-200"
    };

    return (
      <Badge
        variant={role === 'Admin' ? 'default' : 'secondary'}
        className={colors[role] || "bg-gray-100 text-gray-800 hover:bg-gray-200"}
      >
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Active: "bg-green-100 text-green-800 hover:bg-green-200",
      Inactive: "bg-red-100 text-red-800 hover:bg-red-200"
    };

    return (
      <Badge
        variant={status === 'Active' ? 'default' : 'destructive'}
        className={colors[status] || "bg-gray-100 text-gray-800 hover:bg-gray-200"}
      >
        {status}
      </Badge>
    );
  };

  const columns: TableColumn<(typeof users)[0]>[] = [
    {
      key: 'name',
      header: 'Nama',
      sortable: true,
      cellRender: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-sm">
              {value.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      cellRender: (value) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      cellRender: (value) => getRoleBadge(value)
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cellRender: (value) => getStatusBadge(value)
    },
    {
      key: 'actions' as keyof (typeof users)[0],
      header: 'Aksi',
      align: 'left',
      cellRender: (_: any, row: (typeof users)[0]) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300">
            <Edit className="h-3 w-3" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" className="flex items-center gap-1">
            <Trash2 className="h-3 w-3" />
            Hapus
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      striped={true}
      bordered={true}
      showHover={true}
      emptyStateConfig={{
        message: 'Tidak Ada Pengguna',
        description: 'Belum ada pengguna yang terdaftar di sistem.',
        action: (
          <Button className="bg-purple-600 hover:bg-purple-700">
            Tambah Pengguna
          </Button>
        )
      }}
    />
  );
};