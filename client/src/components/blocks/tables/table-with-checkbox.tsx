"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface TableColumn {
  key: string
  header: string
  render?: (value: any, row: any) => React.ReactNode
}

interface TableWithCheckboxProps {
  data: any[]
  columns: TableColumn[]
  className?: string
  // Pagination props
  paginationEnabled?: boolean
  currentPage?: number
  totalPages?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  totalItems?: number
}

export function TableWithCheckbox({
  data,
  columns,
  className,
  paginationEnabled = false,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  totalItems
}: TableWithCheckboxProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(data.map((row, index) => index.toString()))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action}`, selectedRows)
    setSelectedRows([])
  }

  return (
    <div className={className}>
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-muted rounded mb-4">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} items selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('edit')}>
              Bulk Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
              Bulk Delete
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.length === data.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  checked={selectedRows.includes(index.toString())}
                  onCheckedChange={() => handleRowSelect(index.toString())}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {paginationEnabled && totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {pageSize * (currentPage - 1) + 1} to {Math.min(pageSize * currentPage, totalItems || data.length)} of {totalItems || data.length} items
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {/* Show max 5 page numbers */}
              {(() => {
                const pages = []
                const maxVisible = 5
                let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                let endPage = Math.min(totalPages, startPage + maxVisible - 1)

                if (endPage - startPage + 1 < maxVisible) {
                  startPage = Math.max(1, endPage - maxVisible + 1)
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i)
                }

                return pages.map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange?.(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))
              })()}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}