import { useState } from "react";
import { SliderFilter } from "./SliderFilter";
import SingleChoiceFilter from "./SingleChoiceFilter";
import MultiChoiceFilter from "./MultiChoiceFilter";

const options = [
  { value: null, label: "Test" },
  { value: "test1", label: "First" },
  { value: "test2", label: "Second" },
  { value: "test4", label: "Fourth" },
];

function FilterHeader() {
  const [testHigh, setTestHigh] = useState<number>(300);
  const [testLow, setTestLow] = useState<number>(-10);
  const [singleValue, setSingleValue] = useState<string | null>(null);
  const [multiValue, setMultiValue] = useState<string[]>([]);
  return (
    <div className="flex-header w-full flex flex-row overflow-auto p-3">
      <form className="flex flex-row gap-5">
        <SliderFilter
          minValue={-10}
          maxValue={300}
          unit="ts"
          step={20}
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
      </form>
    </div>
  );
}

export default FilterHeader;
