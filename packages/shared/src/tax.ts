export interface TaxCalcResult {
  taxTotal: number
  subtotalExTax: number
}

export function calculateTax(
  subtotal: number,
  taxPercent: number,
  taxType: 'Inclusive' | 'Exclusive',
): TaxCalcResult {
  if (taxType === 'Inclusive') {
    const subtotalExTax = subtotal / (1 + taxPercent / 100)
    const taxTotal = subtotal - subtotalExTax
    return { taxTotal, subtotalExTax }
  }
  const taxTotal = subtotal * (taxPercent / 100)
  return { taxTotal, subtotalExTax: subtotal }
}

export function calculateRounding(exactGrandTotal: number): {
  grandTotal: number
  roundingAdjustment: number
} {
  const grandTotal = Math.round(exactGrandTotal)
  return { grandTotal, roundingAdjustment: grandTotal - exactGrandTotal }
}
