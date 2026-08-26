import { useState } from "react";
import { SliderFilter } from "./SliderFilter";
import SingleChoiceFilter from "./SingleChoiceFilter";
import MultiChoiceFilter from "./MultiChoiceFilter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

const options = [
  { value: null, label: "Test" },
  { value: "test1", label: "First" },
  { value: "test2", label: "Second" },
  { value: "test4", label: "Fourth" },
];

function FilterHeader() {
  const params = useSearchParams();
  const [testHigh, setTestHigh] = useState<number>(
    parseFloat(params.get("salesHigh") ?? "0.2") * 100,
  );
  const [testLow, setTestLow] = useState<number>(
    parseFloat(params.get("salesLow") ?? "0") * 100,
  );
  const [singleValue, setSingleValue] = useState<string | null>(null);
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const buildString = () => {
    const page = params.get("page");
    return `/cities?salesLow=${testLow / 100}&salesHigh=${testHigh / 100}${page ? `&page=0` : ""}`;
  };
  return (
    <div className="flex-header w-full flex flex-row overflow-auto p-3">
      <form className="flex flex-row gap-5 w-full">
        <SliderFilter
          minValue={0}
          maxValue={20}
          unit="%"
          label="Sales Tax"
          step={0.5}
          low={testLow}
          high={testHigh}
          onValueChange={(l, h) => {
            setTestLow(l);
            setTestHigh(h);
          }}
        />
        <SingleChoiceFilter
          options={options}
          label="TestPlace"
          onValueChange={(v) => {
            console.log(v);
            setSingleValue(v);
          }}
          value={singleValue}
        />
        <MultiChoiceFilter
          options={[
            { value: "test1", label: "Test 1" },
            { value: "test2", label: "Test 2" },
            { value: "test3", label: "Test 3" },
          ]}
          onValueChange={(v) => {
            console.log(v);
            setMultiValue(v);
          }}
          value={multiValue}
          label="Test Multi"
        />
        <Button
          render={<Link href={buildString()}>Filter</Link>}
          className="ml-auto font-bold text-xl"
          nativeButton={false}
        />
      </form>
    </div>
  );
}

export default FilterHeader;
