import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  className?: string;
}

export function StatusFilter({ value, onChange, className = "" }: StatusFilterProps) {
  const isActive = value && value !== 'all';

  return (
    <Select
      value={value || 'all'}
      onValueChange={(newValue) => onChange(newValue === 'all' ? undefined : newValue)}
    >
      <SelectTrigger className={`w-32 ${isActive ? 'border-purple-500 text-purple-700 bg-purple-50' : ''} ${className}`}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="archived">Archived</SelectItem>
      </SelectContent>
    </Select>
  );
}