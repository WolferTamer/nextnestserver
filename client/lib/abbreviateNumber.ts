export function abbreviateNumber(val: number) {
  // Thousands, millions, billions etc..
  const s = ["", "k", "m", "b", "t"];

  // Dividing the value by 3.
  const sNum = Math.floor((("" + val).length - 1) / 3);

  // Calculating the precised value.
  const sVal = parseFloat(
    (sNum != 0 ? val / Math.pow(1000, sNum) : val).toPrecision(2),
  );
  let f = `${sVal}`;
  if (sVal % 1 != 0) {
    f = sVal.toFixed(1);
  }
  return f + s[sNum];
}
