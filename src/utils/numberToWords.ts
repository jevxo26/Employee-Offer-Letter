/**
 * Converts a small integer to its English keyword.
 * Designed to cover standard agreement numbers dynamically.
 */
export function numberToWords(num: number): string {
  const ones = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (num < 20) {
    return ones[num] || String(num);
  }

  if (num < 100) {
    const doubleVal = Math.floor(num / 10);
    const rest = num % 10;
    return tens[doubleVal] + (rest > 0 ? `-${ones[rest]}` : "");
  }

  return String(num);
}
