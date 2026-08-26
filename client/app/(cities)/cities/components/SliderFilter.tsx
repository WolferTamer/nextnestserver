import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface SliderProps {
  minValue: number;
  maxValue: number;
  high: number;
  low: number;
  step: number;
  unit?: string;
  label: string;
  onValueChange: (min: number, max: number) => void;
}

export function SliderFilter({
  minValue,
  maxValue,
  high,
  low,
  unit,
  step,
  label,
  onValueChange,
}: SliderProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={
              maxValue == high && minValue == low ? "outline" : "default"
            }
            className="w-30"
          >
            {label}
          </Button>
        }
      />
      <DropdownMenuContent className="w-70" align="start">
        <div className="flex flex-row items-center gap-2">
          <div className="relative">
            <Input
              className="w-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={low}
              type="number"
              min={minValue}
              max={maxValue}
              onChange={(v) => {
                onValueChange(parseFloat(v.currentTarget.value), high);
              }}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
          </div>
          <Slider
            value={[low, high]}
            onValueChange={(v) => {
              onValueChange((v as number[])[0], (v as number[])[1]);
            }}
            min={minValue}
            max={maxValue}
            step={step}
          />
          <div className="relative">
            <Input
              className="w-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={high}
              type="number"
              min={minValue}
              max={maxValue}
              onChange={(v) => {
                onValueChange(low, parseFloat(v.currentTarget.value));
              }}
            />

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
