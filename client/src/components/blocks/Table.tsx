"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown, SearchX, Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { cva } from "class-variance-authority";

// ===== TYPE DEFINITIONS =====

/**
 * Base interface for pagination information
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Sort order options
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Column definition for the table
 */
export interface TableColumn<T = any> {
  /** Unique key for the column */
  key: keyof T;
  /** Header text to display */
  header: string;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Custom render function for the header cell */
  headerRender?: (column: TableColumn<T>, sortState?: SortState<T>) => ReactNode;
  /** Custom render function for the cell content */
  cellRender?: (value: any, row: T, index: number) => ReactNode;
  /** CSS classes for the header cell */
  headerClassName?: string;
  /** CSS classes for the body cells */
  cellClassName?: string;
  /** Width of the column */
  width?: string | number;
  /** Minimum width of the column */
  minWidth?: string | number;
  /** Whether to allow text truncation */
  truncate?: boolean;
  /** Alignment of the column */
  align?: 'left' | 'center' | 'right';
}

/**
 * Sort state interface
 */
export interface SortState<T = any> {
  sortBy: keyof T;
  sortOrder: SortOrder;
}

/**
 * Loading state configuration
 */
export interface LoadingConfig {
  /** Number of skeleton rows to show */
  skeletonRows?: number;
  /** Custom loading message */
  message?: string;
  /** Whether to show skeleton animation */
  showSkeleton?: boolean;
}

/**
 * Empty state configuration
 */
export interface EmptyStateConfig {
  /** Custom empty state message */
  message?: string;
  /** Custom description */
  description?: string;
  /** Custom empty state icon */
  icon?: ReactNode;
  /** Custom empty state action */
  action?: ReactNode;
}

/**
 * Table component props
 */
export interface TableProps<T = any> {
  /** Data to display in the table */
  data: T[];
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Whether the table is currently loading */
  loading?: boolean;
  /** Loading state configuration */
  loadingConfig?: LoadingConfig;
  /** Empty state configuration */
  emptyStateConfig?: EmptyStateConfig;
  /** Current pagination information */
  pagination?: PaginationInfo;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Current sort state */
  sortState?: SortState<T>;
  /** Callback when sort changes */
  onSortChange?: (sortState: SortState<T>) => void;
  /** Custom CSS classes for the table container */
  className?: string;
  /** Whether to show hover effects on rows */
  showHover?: boolean;
  /** Whether to show striped rows */
  striped?: boolean;
  /** Whether to show borders */
  bordered?: boolean;
  /** Whether the table is compact */
  compact?: boolean;
  /** Custom render function for table rows */
  rowRender?: (row: T, index: number) => ReactNode;
  /** Custom CSS classes for table rows */
  rowClassName?: string | ((row: T, index: number) => string);
  /** Whether to allow selection */
  selectable?: boolean;
  /** Currently selected items */
  selectedItems?: T[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedItems: T[]) => void;
  /** Unique key extractor for rows */
  rowKey?: (row: T, index: number) => string | number;
  /** Maximum height for the table container */
  maxHeight?: string | number;
  /** Whether to show a loading overlay instead of inline loading */
  loadingOverlay?: boolean;
  /** Custom pagination component */
  paginationComponent?: ReactNode;
  /** Custom empty state component */
  emptyStateComponent?: ReactNode;
}

/**
 * Default props for the Table component
 */
const DEFAULT_TABLE_PROPS: Partial<TableProps> = {
  loading: false,
  showHover: true,
  striped: true,
  bordered: false,
  compact: false,
  loadingConfig: {
    skeletonRows: 5,
    message: "Memuat data...",
    showSkeleton: true,
  },
  emptyStateConfig: {
    message: "Tidak Ada Data",
    description: "Tidak ada data yang tersedia untuk ditampilkan.",
  },
  rowKey: (row: any, index: number) => row.id ?? index,
};

// ===== STYLE VARIANTS =====

const tableContainerVariants = cva(
  "w-full overflow-hidden",
  {
    variants: {
      bordered: {
        true: "border border-gray-200 rounded-lg",
        false: "",
      },
    },
    defaultVariants: {
      bordered: false,
    },
  }
);

const tableVariants = cva(
  "w-full caption-bottom text-sm",
  {
    variants: {
      striped: {
        true: "[&_tr:last-child_border-0]",
        false: "",
      },
      compact: {
        true: "[&_td]:py-1 [&_th]:py-1",
        false: "[&_td]:py-3 [&_th]:py-3",
      },
    },
    defaultVariants: {
      striped: true,
      compact: false,
    },
  }
);

const tableHeaderVariants = cva(
  "border-b bg-gray-50/50",
  {
    variants: {
      bordered: {
        true: "border-gray-200",
        false: "border-gray-100",
      },
    },
    defaultVariants: {
      bordered: false,
    },
  }
);

const tableHeaderCellVariants = cva(
  "h-12 px-4 text-left align-middle font-medium text-gray-700",
  {
    variants: {
      sortable: {
        true: "cursor-pointer select-none hover:bg-purple-50 transition-colors",
        false: "",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      sortable: false,
      align: "left",
    },
  }
);

const tableRowVariants = cva(
  "border-b transition-colors",
  {
    variants: {
      striped: {
        true: "even:bg-gray-50/25 hover:bg-gray-50",
        false: "hover:bg-gray-50",
      },
      selectable: {
        true: "cursor-pointer",
        false: "",
      },
      selected: {
        true: "bg-purple-50 hover:bg-purple-100",
        false: "",
      },
    },
    defaultVariants: {
      striped: true,
      selectable: false,
      selected: false,
    },
  }
);

const tableCellVariants = cva(
  "p-4 align-middle",
  {
    variants: {
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      truncate: {
        true: "overflow-hidden text-ellipsis whitespace-nowrap",
        false: "",
      },
    },
    defaultVariants: {
      align: "left",
      truncate: false,
    },
  }
);

const paginationContainerVariants = cva(
  "flex justify-between items-center mt-4",
  {
    variants: {
      position: {
        center: "justify-center",
        left: "justify-start",
        right: "justify-end",
        between: "justify-between",
      },
    },
    defaultVariants: {
      position: "between",
    },
  }
);

const loadingOverlayVariants = cva(
  "absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10",
  {
    variants: {
      visible: {
        true: "opacity-100 pointer-events-auto",
        false: "opacity-0 pointer-events-none",
      },
    },
    defaultVariants: {
      visible: false,
    },
  }
);

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center py-16 text-gray-500",
  {
    variants: {
      compact: {
        true: "py-8",
        false: "py-16",
      },
    },
    defaultVariants: {
      compact: false,
    },
  }
);

const skeletonVariants = cva(
  "animate-pulse bg-gray-200 rounded",
  {
    variants: {
      height: {
        sm: "h-4",
        md: "h-6",
        lg: "h-8",
      },
    },
    defaultVariants: {
      height: "md",
    },
  }
);

// ===== MAIN COMPONENT =====

export function DataTable<T = any>({
  data,
  columns,
  loading = false,
  loadingConfig,
  emptyStateConfig,
  pagination,
  onPageChange,
  sortState,
  onSortChange,
  className,
  showHover = true,
  striped = true,
  bordered = false,
  compact = false,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  rowKey,
  rowClassName,
  rowRender,
  maxHeight,
  loadingOverlay = false,
  paginationComponent,
  emptyStateComponent,
}: TableProps<T>) {
  const [localSortState, setLocalSortState] = useState<SortState<T> | undefined>(sortState);
  const [localSelectedItems, setLocalSelectedItems] = useState<T[]>(selectedItems);

  // Merge with defaults
  const finalLoadingConfig = { ...DEFAULT_TABLE_PROPS.loadingConfig, ...loadingConfig };
  const finalEmptyStateConfig = { ...DEFAULT_TABLE_PROPS.emptyStateConfig, ...emptyStateConfig };
  const finalRowKey = rowKey || DEFAULT_TABLE_PROPS.rowKey!;

  // Handle sorting
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable || !onSortChange) return;

    const currentSortBy = localSortState?.sortBy;
    const currentSortOrder = localSortState?.sortOrder || 'asc';

    let newSortState: SortState<T>;

    if (currentSortBy === column.key) {
      // Toggle sort order if same column
      newSortState = {
        sortBy: column.key,
        sortOrder: currentSortOrder === 'asc' ? 'desc' : 'asc',
      };
    } else {
      // Sort by new column in ascending order
      newSortState = {
        sortBy: column.key,
        sortOrder: 'asc',
      };
    }

    setLocalSortState(newSortState);
    onSortChange(newSortState);
  };

  // Handle row selection
  const handleRowSelect = (row: T) => {
    if (!selectable) return;

    const isSelected = localSelectedItems.some(item =>
      finalRowKey(item, 0) === finalRowKey(row, 0)
    );

    let newSelectedItems: T[];
    if (isSelected) {
      newSelectedItems = localSelectedItems.filter(item =>
        finalRowKey(item, 0) !== finalRowKey(row, 0)
      );
    } else {
      newSelectedItems = [...localSelectedItems, row];
    }

    setLocalSelectedItems(newSelectedItems);
    onSelectionChange?.(newSelectedItems);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    onPageChange?.(page);
  };

  // Utility functions for class names
  const getHeaderCellClassName = (column: TableColumn<T>) => {
    return cn(
      tableHeaderCellVariants({
        sortable: column.sortable,
        align: column.align || 'left'
      }),
      column.headerClassName
    );
  };

  const getCellClassName = (column: TableColumn<T>) => {
    return cn(
      tableCellVariants({
        align: column.align || 'left',
        truncate: column.truncate
      }),
      column.cellClassName
    );
  };

  const getRowClassName = (row: T, index: number) => {
    const isSelected = localSelectedItems.some(item =>
      finalRowKey(item, 0) === finalRowKey(row, 0)
    );

    const customClass = typeof rowClassName === 'function'
      ? rowClassName(row, index)
      : rowClassName;

    return cn(
      tableRowVariants({
        striped,
        selectable,
        selected: isSelected
      }),
      showHover && "hover:bg-gray-50",
      customClass
    );
  };

  // Get sort icon
  const getSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;

    const isSorted = localSortState?.sortBy === column.key;
    const sortOrder = localSortState?.sortOrder;

    if (!isSorted) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-35" />;
    }

    return sortOrder === 'asc'
      ? <ArrowUp className="ml-2 h-4 w-4 opacity-35" />
      : <ArrowDown className="ml-2 h-4 w-4 opacity-35" />;
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    if (!pagination) return [];

    const { page, totalPages } = pagination;
    const items = [];

    // Always show first page
    if (page > 3) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(1)}
            isActive={page === 1}
            className={page === 1 ? 'bg-purple-600 text-white hover:bg-purple-700' : 'hover:bg-purple-50 hover:text-purple-700'}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (page > 4) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Show pages around current page
    const startPage = Math.max(1, page - 1);
    const endPage = Math.min(totalPages, page + 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(i)}
            isActive={page === i}
            className={page === i ? 'bg-purple-600 text-white hover:bg-purple-700' : 'hover:bg-purple-50 hover:text-purple-700'}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Always show last page
    if (page < totalPages - 2) {
      if (page < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(totalPages)}
            isActive={page === totalPages}
            className={page === totalPages ? 'bg-purple-600 text-white hover:bg-purple-700' : 'hover:bg-purple-50 hover:text-purple-700'}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Render skeleton loading
  const renderSkeleton = () => {
    const skeletonRows = finalLoadingConfig.skeletonRows || 5;

    return (
      <>
        {Array.from({ length: skeletonRows }).map((_, index) => (
          <TableRow key={`skeleton-${index}`}>
            {columns.map((column) => (
              <TableCell key={String(column.key)}>
                <div className={cn(skeletonVariants({ height: "md" }))} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (emptyStateComponent) {
      return emptyStateComponent;
    }

    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="text-center">
          <div className={cn(emptyStateVariants({ compact }))}>
            {finalEmptyStateConfig.icon || <SearchX className="h-16 w-16 text-gray-300" />}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-600">
                {finalEmptyStateConfig.message}
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                {finalEmptyStateConfig.description}
              </p>
              {finalEmptyStateConfig.action && (
                <div className="mt-4">
                  {finalEmptyStateConfig.action}
                </div>
              )}
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn("relative", tableContainerVariants({ bordered }))}>
        {/* Loading Overlay */}
        {loadingOverlay && loading && (
          <div className={cn(loadingOverlayVariants({ visible: true }))}>
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="text-sm text-gray-600">
                {finalLoadingConfig.message}
              </span>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto" style={{ maxHeight }}>
          <Table className={cn(tableVariants({ striped, compact }))}>
            <TableHeader className={cn(tableHeaderVariants({ bordered }))}>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={getHeaderCellClassName(column)}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                    }}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center">
                      {column.headerRender
                        ? column.headerRender(column, localSortState)
                        : column.header
                      }
                      {getSortIcon(column)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && !loadingOverlay ? (
                renderSkeleton()
              ) : data.length === 0 ? (
                renderEmptyState()
              ) : (
                data.map((row, index) => {
                  if (rowRender) {
                    return rowRender(row, index);
                  }

                  return (
                    <TableRow
                      key={finalRowKey(row, index)}
                      className={getRowClassName(row, index)}
                      onClick={() => handleRowSelect(row)}
                    >
                      {columns.map((column) => {
                        const value = row[column.key];

                        return (
                          <TableCell
                            key={String(column.key)}
                            className={getCellClassName(column)}
                          >
                            {column.cellRender
                              ? column.cellRender(value, row, index)
                              : (value as ReactNode)
                            }
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {paginationComponent || (pagination && pagination.total > 0) ? (
        <div className={cn(paginationContainerVariants())}>
          {paginationComponent || (
            <>
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {generatePaginationItems()}
                  </PaginationContent>
                </Pagination>
              </div>

              <div className="flex">
                <Pagination>
                  <PaginationContent className="gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={() => handlePageChange(pagination!.page - 1)}
                        className={!pagination!.hasPrev ? "cursor-not-allowed opacity-50" : "hover:bg-purple-50 hover:text-purple-700"}
                      />
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={() => handlePageChange(pagination!.page + 1)}
                        className={!pagination!.hasNext ? "cursor-not-allowed opacity-50" : "hover:bg-purple-50 hover:text-purple-700"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}