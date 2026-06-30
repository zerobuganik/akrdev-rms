export function formatCurrency(amount: number, locale = 'en-IN'): string {
  if (amount < 0) return `-₹${Math.abs(amount).toLocaleString(locale)}`
  return `₹${amount.toLocaleString(locale)}`
}
