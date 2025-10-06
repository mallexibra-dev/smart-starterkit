import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

export interface SearchFilters {
  search?: string;
  status?: string;
  minStock?: number;
  maxStock?: number;
  minPrice?: number;
  maxPrice?: number;
}

interface SearchFilterProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: any) => void;
  onClearFilters?: () => void;
  className?: string;
}

export function SearchFilter({
  filters,
  onFilterChange,
  onClearFilters,
  className = ""
}: SearchFilterProps) {
  const hasActiveFilters = Object.entries(filters).filter(([key, value]) => key !== 'search' && value !== undefined).length > 0;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex justify-between items-center">
        {/* Search di kiri */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari produk..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10 pr-10"
          />
          {filters.search && (
            <X
              className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => onFilterChange('search', '')}
            />
          )}
        </div>

        {/* Filters di kanan */}
        <div className="flex gap-2 items-center">
          {/* Status Filter */}
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => onFilterChange('status', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Stock Filter */}
          <div className="flex items-center gap-1">
            <label className="text-sm font-medium whitespace-nowrap">Stok:</label>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minStock || ''}
              onChange={(e) => onFilterChange('minStock', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-20"
            />
            <span className="text-gray-500">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxStock || ''}
              onChange={(e) => onFilterChange('maxStock', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-20"
            />
          </div>

          {/* Price Filter */}
          <div className="flex items-center gap-1">
            <label className="text-sm font-medium whitespace-nowrap">Harga:</label>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-24"
            />
            <span className="text-gray-500">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-24"
            />
          </div>

          {/* Reset Button */}
          {hasActiveFilters && onClearFilters && (
            <Button variant="ghost" onClick={onClearFilters} className="flex items-center gap-1">
              <X className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}