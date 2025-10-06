import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronDown } from 'lucide-react';
import type { DateRangeFilter } from 'shared/types';

interface DateRangeFilterProps {
  onDateRangeChange: (dateRange: DateRangeFilter) => void;
  className?: string;
}

const DATE_PRESETS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last90days', label: 'Last 90 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'thisYear', label: 'This Year' },
] as const;

export function DateRangeFilter({ onDateRangeChange, className = '' }: DateRangeFilterProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('last30days');

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);

    const dateRange: DateRangeFilter = {
      preset: preset as DateRangeFilter['preset'],
      startDate: '',
      endDate: '',
    };

    // Add actual date range if needed
    if (preset === 'today') {
      const today = new Date();
      dateRange.startDate = today.toISOString().split('T')[0];
      dateRange.endDate = today.toISOString().split('T')[0];
    } else if (preset === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      dateRange.startDate = yesterday.toISOString().split('T')[0];
      dateRange.endDate = yesterday.toISOString().split('T')[0];
    } else if (preset === 'last7days') {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      dateRange.startDate = startDate.toISOString().split('T')[0];
      dateRange.endDate = endDate.toISOString().split('T')[0];
    } else if (preset === 'last30days') {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      dateRange.startDate = startDate.toISOString().split('T')[0];
      dateRange.endDate = endDate.toISOString().split('T')[0];
    }

    onDateRangeChange(dateRange);
  };

  return (
    <Card className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range:
            </span>
          </div>

          <Select value={selectedPreset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-48 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              {DATE_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="h-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Custom Range
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}