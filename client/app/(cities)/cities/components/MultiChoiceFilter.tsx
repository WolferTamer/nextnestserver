import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MultiChoiceProps {
  label?: string;
  options: {
    value: string;
    label: string;
  }[];
  value: string[];
  onValueChange: (values: string[]) => void;
}

export default function MultiChoiceFilter({
  label,
  options,
  value,
  onValueChange,
}: MultiChoiceProps) {
  return (
    <Select
      items={options}
      multiple={true}
      value={value}
      onValueChange={(v) => onValueChange(v)}
    >
      <SelectTrigger
        className={`${value.length == 0 ? "" : "bg-primary! hover:bg-secondary!"}`}
      >
        <SelectValue placeholder={label} className="w-30" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {options.map((v) => (
            <SelectItem key={v.value} value={v.value}>
              {v.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
