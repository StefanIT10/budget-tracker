export function amountToCents(amount) {
  const parts = String(amount).split(".");
  const euros = Number(parts[0]);
  const cents = Number((parts[1] || "").padEnd(2, "0"));

  return euros * 100 + cents;
}

export function formatCents(cents) {
  const sign = cents < 0 ? "-" : "";
  const absoluteCents = Math.abs(cents);

  const euros = Math.floor(absoluteCents / 100);
  const remainingCents = absoluteCents % 100;

  const formattedEuros = euros.toLocaleString("en-US");
  const formattedCents = String(remainingCents).padStart(2, "0");

  return sign + formattedEuros + "." + formattedCents + " €";
}
