export function formatCurrency(amount: number, locale = 'en-IN'): string {
  return `₹${amount.toLocaleString(locale)}`
}
