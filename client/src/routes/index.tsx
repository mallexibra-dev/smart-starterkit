import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/ContainerLayout"
import { ChartAreaInteractive } from "@/components/blocks/chart-area-interactive"
import { DataTable } from "@/components/blocks/data-table"
import { SectionCards } from "@/components/blocks/section-cards"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import data from "@/app/dashboard/data.json"

interface DocumentItem {
  id: number
  header: string
  type: string
  status: string
  target: string
  limit: string
  reviewer: string
}

const columns: ColumnDef<DocumentItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "drag",
    header: () => null,
    cell: () => null,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Header",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("header")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("type")}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={status === "Done" ? "default" : "secondary"}
          className={status === "Done" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "target",
    header: "Target",
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("target")}</div>
    ),
  },
  {
    accessorKey: "limit",
    header: "Limit",
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("limit")}</div>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => (
      <div className={row.getValue("reviewer") === "Assign reviewer" ? "text-muted-foreground italic" : ""}>
        {row.getValue("reviewer")}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Edit
        </Button>
        <Button variant="outline" size="sm">
          Delete
        </Button>
      </div>
    ),
  },
]

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <ContainerLayout title="Dashboard">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable columns={columns} data={data} />
    </ContainerLayout>
  );
}

export default Index;
