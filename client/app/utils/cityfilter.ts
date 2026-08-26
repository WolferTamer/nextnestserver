import { components } from "../types/api";

export default function cityFilter(
  c: components["schemas"]["City"],
  salesHigh: number,
  salesLow: number,
) {
  if (c.tax && c.tax.length >= 1) {
    const salestax = c.tax[0].salestax;
    if (salestax && (salestax > salesHigh || salestax < salesLow)) {
      console.log(`Excluded ${c.name} for salestax of ${salestax}`);
      return false;
    }
  }
  return true;
}
