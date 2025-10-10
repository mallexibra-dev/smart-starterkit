"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowReorder?: (newData: TData[]) => void
  className?: string
}

interface DraggableRowProps {
  row: any
  className?: string
}

function DraggableRow({ row, className }: DraggableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: row.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(className, "cursor-move")}
      {...attributes}
    >
      {row.getVisibleCells().map((cell: any) => (
        <TableCell key={cell.id}>
          {cell.column.id === "drag" ? (
            <div
              className="flex items-center justify-center cursor-grab active:cursor-grabbing"
              {...listeners}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-muted-foreground"
              >
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="5" r="1" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="5" r="1" />
                <circle cx="15" cy="19" r="1" />
              </svg>
            </div>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowReorder,
  className,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [internalData, setInternalData] = React.useState(data)

  React.useEffect(() => {
    setInternalData(data)
  }, [data])

  const table = useReactTable({
    data: internalData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = internalData.findIndex((item: any) => item.id === active.id)
      const newIndex = internalData.findIndex((item: any) => item.id === over?.id)

      const newData = [...internalData]
      const [reorderedItem] = newData.splice(oldIndex, 1)
      newData.splice(newIndex, 0, reorderedItem)

      setInternalData(newData)
      onRowReorder?.(newData)
    }
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <SortableContext
                items={internalData.map((item: any) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </TableBody>
          </Table>
        </div>
      </DndContext>
    </div>
  )
}

export function createColumns<TData extends { id: string }>(data: TData[]) {
  const columns: ColumnDef<TData>[] = [
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("status")}</Badge>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
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

  return columns
}