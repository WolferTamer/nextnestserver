import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SingleChoiceProps {
  label?: string;
  options: {
    value: string | null;
    label: string;
  }[];
  value: string | null;
  onValueChange: (value: string | null) => void;
}

export default function SingleChoiceFilter({
  label,
  options,
  value,
  onValueChange,
}: SingleChoiceProps) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(v) => onValueChange(v)}
    >
      <SelectTrigger
        className={`${value == null ? "" : "bg-primary! hover:bg-secondary!"}`}
      >
        <SelectValue placeholder={label} />
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
