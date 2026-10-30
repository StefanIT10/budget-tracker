export function getMonthFromDate(date) {
  return date.slice(0, 7);
}

export function getLatestMonth(transactions) {
  if (transactions.length === 0) {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    return year + "-" + month;
  }

  let latestDate = transactions[0].date;

  for (let i = 1; i < transactions.length; i++) {
    if (transactions[i].date > latestDate) {
      latestDate = transactions[i].date;
    }
  }

  return getMonthFromDate(latestDate);
}

export function changeMonth(month, difference) {
  const parts = month.split("-");

  const year = Number(parts[0]);
  const monthNumber = Number(parts[1]);

  const date = new Date(year, monthNumber - 1 + difference, 1);

  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, "0");

  return newYear + "-" + newMonth;
}

export function formatMonth(month) {
  const parts = month.split("-");

  const year = Number(parts[0]);
  const monthNumber = Number(parts[1]);

  const date = new Date(year, monthNumber - 1, 1);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}
