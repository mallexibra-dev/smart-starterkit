"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Star, Mail, Phone, MapPin, Edit, Trash, Eye, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableColumn {
  key: string
  header: string
  render?: (value: any, row: any, index: number) => React.ReactNode
  className?: string
}

interface TableAction {
  label: string
  icon?: React.ReactNode
  onClick: (row: any, index: number) => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  disabled?: boolean
  customComponent?: (row: any) => React.ReactNode
}

interface TableAdvancedProps {
  data: any[]
  columns: TableColumn[]
  selectionEnabled?: boolean
  selectedRows?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  idField?: string
  className?: string
  // Built-in render functions can be used via props
  renderers?: {
    [key: string]: ((value: any, row: any) => React.ReactNode) | undefined
  }
  // Actions can be passed as props
  actions?: TableAction[]
  actionsColumnLabel?: string
  // Bulk actions for selected rows
  bulkActions?: TableAction[]
  showBulkActions?: boolean
  // Pagination props
  paginationEnabled?: boolean
  currentPage?: number
  totalPages?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  totalItems?: number
}

// Example render functions for different column types
export const renderAvatar = (_value: string, row: any) => (
  <div className="flex items-center gap-3">
    <Avatar className="h-8 w-8">
      <AvatarImage src={row.avatar} alt={row.name} />
      <AvatarFallback>{row.name?.charAt(0) || "U"}</AvatarFallback>
    </Avatar>
    <div>
      <div className="font-medium">{row.name}</div>
      <div className="text-sm text-muted-foreground">{row.email}</div>
    </div>
  </div>
)

export const renderStatus = (value: string) => {
  const statusConfig = {
    active: { variant: "default" as const, label: "Active", className: "" },
    inactive: { variant: "secondary" as const, label: "Inactive", className: "" },
    pending: { variant: "outline" as const, label: "Pending", className: "" },
    premium: { variant: "default" as const, label: "Premium", className: "bg-purple-100 text-purple-800" },
    basic: { variant: "secondary" as const, label: "Basic", className: "" }
  }

  const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.active

  return (
    <Badge variant={config.variant} className={cn(config.className)}>
      {config.label}
    </Badge>
  )
}

export const renderDescription = (_value: string, row: any) => (
  <div className="space-y-1">
    <div className="font-medium">{row.title}</div>
    <div className="text-sm text-muted-foreground line-clamp-2">{_value}</div>
    {row.tags && (
      <div className="flex flex-wrap gap-1 mt-2">
        {row.tags.slice(0, 2).map((tag: string, index: number) => (
          <Badge key={index} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
        {row.tags.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{row.tags.length - 2}
          </Badge>
        )}
      </div>
    )}
  </div>
)

export const renderContact = (_value: string, row: any) => (
  <div className="space-y-1">
    {row.email && (
      <div className="flex items-center gap-2 text-sm">
        <Mail className="h-3 w-3 text-muted-foreground" />
        <span className="truncate">{row.email}</span>
      </div>
    )}
    {row.phone && (
      <div className="flex items-center gap-2 text-sm">
        <Phone className="h-3 w-3 text-muted-foreground" />
        <span>{row.phone}</span>
      </div>
    )}
    {row.location && (
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span className="truncate">{row.location}</span>
      </div>
    )}
  </div>
)

export const renderRating = (value: number) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ))}
    <span className="ml-1 text-sm text-muted-foreground">({value}.0)</span>
  </div>
)

export const renderActions = () => (
  <Button variant="ghost" size="sm">
    <MoreHorizontal className="h-4 w-4" />
  </Button>
)

// Built-in actions for convenience
export const defaultActions = {
  view: {
    label: "View",
    icon: <Eye className="h-4 w-4" />,
    variant: "ghost" as const
  },
  edit: {
    label: "Edit",
    icon: <Edit className="h-4 w-4" />,
    variant: "ghost" as const
  },
  delete: {
    label: "Delete",
    icon: <Trash className="h-4 w-4" />,
    variant: "destructive" as const
  },
  download: {
    label: "Download",
    icon: <Download className="h-4 w-4" />,
    variant: "outline" as const
  }
}

export function TableAdvanced({
  data,
  columns,
  selectionEnabled = false,
  selectedRows = [],
  onSelectionChange,
  idField = "id",
  className,
  renderers = {},
  actions = [],
  actionsColumnLabel = "Actions",
  bulkActions = [],
  showBulkActions = false,
  paginationEnabled = false,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  totalItems
}: TableAdvancedProps) {
  const [internalSelection, setInternalSelection] = useState<string[]>(selectedRows)

  const currentSelection = selectedRows.length > 0 ? selectedRows : internalSelection

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? data.map(row => row[idField]) : []
    if (selectedRows.length === 0) {
      setInternalSelection(newSelection)
    }
    onSelectionChange?.(newSelection)
  }

  const handleSelectRow = (rowId: string, checked: boolean) => {
    let newSelection: string[]
    if (checked) {
      newSelection = [...currentSelection, rowId]
    } else {
      newSelection = currentSelection.filter(id => id !== rowId)
    }

    if (selectedRows.length === 0) {
      setInternalSelection(newSelection)
    }
    onSelectionChange?.(newSelection)
  }

  const isAllSelected = data.length > 0 && currentSelection.length === data.length
  const hasBulkActions = bulkActions.length > 0 && currentSelection.length > 0 && showBulkActions

  // Built-in action render function
  const renderActions = (_value: any, row: any, index: number) => (
    <div className="flex items-center gap-1">
      {actions.length <= 2 ? (
        // Show buttons directly if 2 or fewer actions
        actions.map((action, actionIndex) => (
          <div key={actionIndex}>
            {action.customComponent ? (
              action.customComponent(row)
            ) : (
              <Button
                variant={action.variant || "ghost"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  action.onClick(row, index)
                }}
                disabled={action.disabled}
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </Button>
            )}
          </div>
        ))
      ) : (
        // Show dropdown if more than 2 actions
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {actions.map((action, actionIndex) => (
              <div key={actionIndex}>
                {action.customComponent ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    {action.customComponent(row)}
                  </div>
                ) : (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      action.onClick(row, index)
                    }}
                    disabled={action.disabled}
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </DropdownMenuItem>
                )}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )

  return (
    <div className={cn("rounded-md border", className)}>
      {/* Bulk Actions */}
      {hasBulkActions && (
        <div className="flex items-center justify-between p-3 bg-muted/50 border-b">
          <div className="text-sm text-muted-foreground">
            {currentSelection.length} item{currentSelection.length > 1 ? "s" : ""} selected
          </div>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "default"}
                size="sm"
                onClick={() => {
                  const selectedData = data.filter(row => currentSelection.includes(row[idField]))
                  action.onClick(selectedData, -1)
                }}
                disabled={action.disabled || currentSelection.length === 0}
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {selectionEnabled && (
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
            {actions.length > 0 && (
              <TableHead className="w-32">{actionsColumnLabel}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const isSelected = currentSelection.includes(row[idField])

            return (
              <TableRow
                key={row[idField] || index}
                className={cn(isSelected && "bg-muted/50")}
              >
                {selectionEnabled && (
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectRow(row[idField], checked as boolean)}
                      aria-label={`Select row ${index + 1}`}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render
                      ? column.render(row[column.key], row, index)
                      : renderers[column.key]
                        ? renderers[column.key]!(row[column.key], row)
                        : row[column.key]
                    }
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell>
                    {renderActions(row, row, index)}
                  </TableCell>
                )}
              </TableRow>
            )
          })}
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