import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface PaginationProps {
  current: number;
  max: number;
  changePage: (ind: number) => void;
  className?: string;
}
function Pagination({ current, max, changePage, className }: PaginationProps) {
  let buttonInds = [];
  if (current == 0) {
    buttonInds = [0, 1, 2];
  } else if (current == max) {
    buttonInds = [max - 2, max - 1, max];
  } else {
    buttonInds = [current - 1, current, current + 1];
  }
  return (
    <div className={"flex flex-row items-center justify-around " + className}>
      <Button
        variant="outline"
        disabled={current == 0}
        onClick={() => changePage(current - 1)}
      >
        <ArrowLeft />
      </Button>
      {buttonInds.map((v) => (
        <Button variant="outline" key={v} onClick={() => changePage(v)}>
          {v + 1}
        </Button>
      ))}
      <Button
        variant="outline"
        disabled={current == max}
        onClick={() => changePage(current + 1)}
      >
        <ArrowRight />
      </Button>
    </div>
  );
}

export default Pagination;
