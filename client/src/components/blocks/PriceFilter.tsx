import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Filter } from "lucide-react";

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onChange: (minPrice: number | undefined, maxPrice: number | undefined) => void;
  className?: string;
}

export function PriceFilter({ minPrice, maxPrice, onChange, className = "" }: PriceFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempMin, setTempMin] = useState<string>(minPrice?.toString() || "");
  const [tempMax, setTempMax] = useState<string>(maxPrice?.toString() || "");
  const [error, setError] = useState<string>("");

  // Track dropdown selection separately from actual filter values
  const getInitialSelectedOption = () => {
    if (minPrice === undefined && maxPrice === undefined) {
      return "all";
    }
    if (minPrice === 0 && maxPrice === 100) {
      return "0-100";
    }
    if (minPrice === 100 && maxPrice === 500) {
      return "100-500";
    }
    if (minPrice === 500 && maxPrice === 1000) {
      return "500-1000";
    }
    if (minPrice === 1000 && maxPrice === undefined) {
      return "1000+";
    }
    return "custom";
  };

  const [selectedOption, setSelectedOption] = useState<string>(getInitialSelectedOption());

  const hasActiveFilter = minPrice !== undefined || maxPrice !== undefined;

  // Update selectedOption when filter values change from parent
  useEffect(() => {
    setSelectedOption(getInitialSelectedOption());
  }, [minPrice, maxPrice]);

  const handleCustomRange = () => {
    setIsOpen(true);
    setTempMin(minPrice?.toString() || "");
    setTempMax(maxPrice?.toString() || "");
    setError("");
  };

  const handleSave = () => {
    const min = tempMin ? parseFloat(tempMin) : undefined;
    const max = tempMax ? parseFloat(tempMax) : undefined;

    if (min !== undefined && max !== undefined && min > max) {
      setError("Harga maksimum tidak boleh lebih kecil dari harga minimum");
      return;
    }

    onChange(min, max);
    // Let useEffect handle updating selectedOption based on the new values
    setIsOpen(false);
    setError("");
  };

  const handleReset = () => {
    setTempMin("");
    setTempMax("");
    setError("");
  };

  const handleQuickSelect = (value: string) => {
    setSelectedOption(value);

    switch (value) {
      case "all":
        onChange(undefined, undefined);
        break;
      case "0-100":
        onChange(0, 100);
        break;
      case "100-500":
        onChange(100, 500);
        break;
      case "500-1000":
        onChange(500, 1000);
        break;
      case "1000+":
        onChange(1000, undefined);
        break;
      case "custom":
        handleCustomRange();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Select
        value={selectedOption}
        onValueChange={handleQuickSelect}
      >
        <SelectTrigger className={`w-40 ${hasActiveFilter ? 'border-purple-500 text-purple-700 bg-purple-50' : ''} ${className}`}>
          <SelectValue placeholder="Harga" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua</SelectItem>
          <SelectItem value="0-100">Rp 0 - 100</SelectItem>
          <SelectItem value="100-500">Rp 100 - 500</SelectItem>
          <SelectItem value="500-1000">Rp 500 - 1K</SelectItem>
          <SelectItem value="1000+">Rp 1K+</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter Harga Custom
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minPrice">Harga Minimum</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={tempMin}
                onChange={(e) => setTempMin(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPrice">Harga Maksimum</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="Tidak ada batas"
                value={tempMax}
                onChange={(e) => setTempMax(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                Terapkan
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}