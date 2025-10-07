import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package } from "lucide-react";

interface StockFilterProps {
  minStock?: number;
  maxStock?: number;
  onChange: (minStock: number | undefined, maxStock: number | undefined) => void;
  className?: string;
}

export function StockFilter({ minStock, maxStock, onChange, className = "" }: StockFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempMin, setTempMin] = useState<string>(minStock?.toString() || "");
  const [tempMax, setTempMax] = useState<string>(maxStock?.toString() || "");
  const [error, setError] = useState<string>("");

  // Track dropdown selection separately from actual filter values
  const getInitialSelectedOption = () => {
    if (minStock === undefined && maxStock === undefined) {
      return "all";
    }
    if (minStock === 0 && maxStock === 0) {
      return "0";
    }
    if (minStock === 1 && maxStock === 10) {
      return "1-10";
    }
    if (minStock === 10 && maxStock === 50) {
      return "11-50";
    }
    if (minStock === 51 && maxStock === 100) {
      return "51-100";
    }
    if (minStock === 100 && maxStock === undefined) {
      return "100+";
    }
    return "custom";
  };

  const [selectedOption, setSelectedOption] = useState<string>(getInitialSelectedOption());

  const hasActiveFilter = minStock !== undefined || maxStock !== undefined;

  // Update selectedOption when filter values change from parent
  useEffect(() => {
    setSelectedOption(getInitialSelectedOption());
  }, [minStock, maxStock]);

  const handleCustomRange = () => {
    setIsOpen(true);
    setTempMin(minStock?.toString() || "");
    setTempMax(maxStock?.toString() || "");
    setError("");
  };

  const handleSave = () => {
    const min = tempMin ? parseInt(tempMin) : undefined;
    const max = tempMax ? parseInt(tempMax) : undefined;

    if (min !== undefined && max !== undefined && min > max) {
      setError("Stok maksimum tidak boleh lebih kecil dari stok minimum");
      return;
    }

    if (min !== undefined && min < 0) {
      setError("Stok minimum tidak boleh kurang dari 0");
      return;
    }

    if (max !== undefined && max < 0) {
      setError("Stok maksimum tidak boleh kurang dari 0");
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
      case "0":
        onChange(0, 0);
        break;
      case "1-10":
        onChange(1, 10);
        break;
      case "11-50":
        onChange(10, 50);
        break;
      case "51-100":
        onChange(51, 100);
        break;
      case "100+":
        onChange(100, undefined);
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
        <SelectTrigger className={`w-36 ${hasActiveFilter ? 'border-purple-500 text-purple-700 bg-purple-50' : ''} ${className}`}>
          <SelectValue placeholder="Stok" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua</SelectItem>
          <SelectItem value="0">Habis (0)</SelectItem>
          <SelectItem value="1-10">Rendah (1-10)</SelectItem>
          <SelectItem value="11-50">Sedang (10-50)</SelectItem>
          <SelectItem value="51-100">Tinggi (51-100)</SelectItem>
          <SelectItem value="100+">Sangat Tinggi (100+)</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Filter Stok Custom
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minStock">Stok Minimum</Label>
              <Input
                id="minStock"
                type="number"
                placeholder="0"
                value={tempMin}
                onChange={(e) => setTempMin(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStock">Stok Maksimum</Label>
              <Input
                id="maxStock"
                type="number"
                placeholder="Tidak ada batas"
                value={tempMax}
                onChange={(e) => setTempMax(e.target.value)}
                min="0"
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