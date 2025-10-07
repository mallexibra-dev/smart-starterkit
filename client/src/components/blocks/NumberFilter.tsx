import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Hash, Package, Scale } from "lucide-react";

export interface NumberRangeOption {
  value: string;
  label: string;
  min?: number;
  max?: number;
}

export interface NumberFilterPreset {
  label: string;
  icon?: "hash" | "package" | "scale";
  ranges: NumberRangeOption[];
  customDialog: {
    title: string;
    minLabel: string;
    maxLabel: string;
    minPlaceholder: string;
    maxPlaceholder: string;
    validationMin?: number;
  };
}

const DEFAULT_PRESETS: Record<string, NumberFilterPreset> = {
  stock: {
    label: "Stok",
    icon: "package",
    ranges: [
      { value: "all", label: "Semua" },
      { value: "0", label: "Habis (0)", min: 0, max: 0 },
      { value: "1-10", label: "Rendah (1-10)", min: 1, max: 10 },
      { value: "11-50", label: "Sedang (11-50)", min: 11, max: 50 },
      { value: "51-100", label: "Tinggi (51-100)", min: 51, max: 100 },
      { value: "100+", label: "Sangat Tinggi (100+)", min: 100 },
      { value: "custom", label: "Custom" }
    ],
    customDialog: {
      title: "Filter Stok Custom",
      minLabel: "Stok Minimum",
      maxLabel: "Stok Maksimum",
      minPlaceholder: "0",
      maxPlaceholder: "Tidak ada batas",
      validationMin: 0
    }
  },
  quantity: {
    label: "Quantity",
    icon: "hash",
    ranges: [
      { value: "all", label: "Semua" },
      { value: "1-5", label: "Sedikit (1-5)", min: 1, max: 5 },
      { value: "6-10", label: "Normal (6-10)", min: 6, max: 10 },
      { value: "11-20", label: "Banyak (11-20)", min: 11, max: 20 },
      { value: "21-50", label: "Sangat Banyak (21-50)", min: 21, max: 50 },
      { value: "50+", label: "Massal (50+)", min: 50 },
      { value: "custom", label: "Custom" }
    ],
    customDialog: {
      title: "Filter Quantity Custom",
      minLabel: "Quantity Minimum",
      maxLabel: "Quantity Maksimum",
      minPlaceholder: "1",
      maxPlaceholder: "Tidak ada batas",
      validationMin: 1
    }
  },
  generic: {
    label: "Number",
    icon: "scale",
    ranges: [
      { value: "all", label: "Semua" },
      { value: "1-10", label: "1-10", min: 1, max: 10 },
      { value: "11-50", label: "11-50", min: 11, max: 50 },
      { value: "51-100", label: "51-100", min: 51, max: 100 },
      { value: "100+", label: "100+", min: 100 },
      { value: "custom", label: "Custom" }
    ],
    customDialog: {
      title: "Filter Number Custom",
      minLabel: "Minimum",
      maxLabel: "Maksimum",
      minPlaceholder: "0",
      maxPlaceholder: "Tidak ada batas",
      validationMin: 0
    }
  }
};

interface NumberFilterProps {
  min?: number;
  max?: number;
  onChange: (min: number | undefined, max: number | undefined) => void;
  preset?: "stock" | "quantity" | "generic";
  customPreset?: NumberFilterPreset;
  className?: string;
  width?: string;
}

export function NumberFilter({
  min,
  max,
  onChange,
  preset = "generic",
  customPreset,
  className = "",
  width = "w-36"
}: NumberFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempMin, setTempMin] = useState<string>(min?.toString() || "");
  const [tempMax, setTempMax] = useState<string>(max?.toString() || "");
  const [error, setError] = useState<string>("");

  const presetConfig = customPreset || DEFAULT_PRESETS[preset];
  const iconMap = {
    hash: Hash,
    package: Package,
    scale: Scale
  };
  const IconComponent = iconMap[presetConfig.icon || "scale"];

  // Track dropdown selection separately from actual filter values
  const getInitialSelectedOption = () => {
    if (min === undefined && max === undefined) {
      return "all";
    }

    const range = presetConfig.ranges.find(r =>
      r.min === min && r.max === max && r.value !== "all" && r.value !== "custom"
    );

    if (range) {
      return range.value;
    }

    // Check for unbounded ranges
    if (min !== undefined && max === undefined) {
      const unboundedRange = presetConfig.ranges.find(r =>
        r.min === min && r.max === undefined
      );
      if (unboundedRange) {
        return unboundedRange.value;
      }
    }

    return "custom";
  };

  const [selectedOption, setSelectedOption] = useState<string>(getInitialSelectedOption());

  const hasActiveFilter = min !== undefined || max !== undefined;

  // Update selectedOption when filter values change from parent
  useEffect(() => {
    setSelectedOption(getInitialSelectedOption());
  }, [min, max]);

  const handleCustomRange = () => {
    setIsOpen(true);
    setTempMin(min?.toString() || "");
    setTempMax(max?.toString() || "");
    setError("");
  };

  const handleSave = () => {
    const parsedMin = tempMin ? parseInt(tempMin) : undefined;
    const parsedMax = tempMax ? parseInt(tempMax) : undefined;

    if (parsedMin !== undefined && parsedMax !== undefined && parsedMin > parsedMax) {
      setError(`${presetConfig.customDialog.minLabel} tidak boleh lebih besar dari ${presetConfig.customDialog.maxLabel.toLowerCase()}`);
      return;
    }

    if (parsedMin !== undefined && presetConfig.customDialog.validationMin !== undefined && parsedMin < presetConfig.customDialog.validationMin) {
      setError(`${presetConfig.customDialog.minLabel} tidak boleh kurang dari ${presetConfig.customDialog.validationMin}`);
      return;
    }

    if (parsedMax !== undefined && presetConfig.customDialog.validationMin !== undefined && parsedMax < presetConfig.customDialog.validationMin) {
      setError(`${presetConfig.customDialog.maxLabel} tidak boleh kurang dari ${presetConfig.customDialog.validationMin}`);
      return;
    }

    onChange(parsedMin, parsedMax);
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

    if (value === "all") {
      onChange(undefined, undefined);
    } else if (value === "custom") {
      handleCustomRange();
    } else {
      const range = presetConfig.ranges.find(r => r.value === value);
      if (range) {
        onChange(range.min, range.max);
      }
    }
  };

  return (
    <>
      <Select
        value={selectedOption}
        onValueChange={handleQuickSelect}
      >
        <SelectTrigger className={`${width} ${hasActiveFilter ? 'border-purple-500 text-purple-700 bg-purple-50' : ''} ${className}`}>
          <SelectValue placeholder={presetConfig.label} />
        </SelectTrigger>
        <SelectContent>
          {presetConfig.ranges.map(range => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {IconComponent && <IconComponent className="h-4 w-4" />}
              {presetConfig.customDialog.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minValue">{presetConfig.customDialog.minLabel}</Label>
              <Input
                id="minValue"
                type="number"
                placeholder={presetConfig.customDialog.minPlaceholder}
                value={tempMin}
                onChange={(e) => setTempMin(e.target.value)}
                min={presetConfig.customDialog.validationMin}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxValue">{presetConfig.customDialog.maxLabel}</Label>
              <Input
                id="maxValue"
                type="number"
                placeholder={presetConfig.customDialog.maxPlaceholder}
                value={tempMax}
                onChange={(e) => setTempMax(e.target.value)}
                min={presetConfig.customDialog.validationMin}
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