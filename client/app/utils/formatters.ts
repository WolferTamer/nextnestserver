import { components } from "../types/api";

export const weatherShortString = (
  weather: components["schemas"]["Weather"],
): string => {
  const parts: string[] = [];
  if (weather.jantemp) {
    if (weather.jantemp <= 45) {
      parts.push("Cold Winters");
    } else if (weather.jantemp >= 55) {
      parts.push("Warmer Winters");
    } else {
      parts.push("Middling Winters");
    }
  }
  if (weather.julytemp) {
    if (weather.julytemp <= 70) {
      parts.push("Moderate Summers");
    } else if (weather.julytemp >= 80) {
      parts.push("Hot Summers");
    } else {
      parts.push("Warm Summers");
    }
  }
  if (weather.julyprecipitation) {
    if (weather.julyprecipitation <= 7.5) {
      parts.push("Low Rainfall");
    } else if (weather.julyprecipitation >= 13.5) {
      parts.push("High rainfall");
    } else {
      parts.push("Moderate Rainfall");
    }
  }

  if (parts.length > 0) {
    return parts.join(", ");
  }
  return "";
};

export const taxesShortString = (taxes: components["schemas"]["Tax"]) => {
  const parts = [];
  if (taxes.localtaxes) {
    parts.push("Some Local Taxes");
  }
  if (taxes.salestax) {
    if (taxes.salestax <= 0.045) {
      parts.push("Low Sales Tax");
    } else if (taxes.salestax >= 0.06) {
      parts.push("High Sales Tax");
    } else {
      parts.push("Avg Sales Tax");
    }
  } else if (taxes.salestax == 0) {
    parts.push("No Sales Tax");
  }

  if (parts.length > 0) {
    return parts.join(", ");
  }
  return "";
};
