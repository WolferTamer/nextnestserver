import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface PaginationProps {
  current: number;
  max: number;
  className?: string;
  path: string;
}

function Paginator({ current, max, className, path }: PaginationProps) {
  let buttonInds = [];
  if (current == 0) {
    buttonInds = [0, 1, 2];
  } else if (current == max) {
    buttonInds = [max - 2, max - 1, max];
  } else {
    buttonInds = [current - 1, current, current + 1];
  }
  const getPageUrl = (v: number) => {
    if (path.search(/page=\d+/) != -1) {
      return path.replace(/page=\d+/, `page=${v}`);
    }
    return `${path}&page=${v}`;
  };
  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={getPageUrl(Math.max(current - 1, 0))} />
        </PaginationItem>
        {buttonInds.map((v) => (
          <PaginationItem key={v}>
            <PaginationLink isActive={v == current} href={getPageUrl(v)}>
              {v + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href={getPageUrl(Math.min(current + 1, max))} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default Paginator;
