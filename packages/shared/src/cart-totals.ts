export interface CartTotalsInput {
  subtotal: number
  taxPercent: number
  taxType: 'Inclusive' | 'Exclusive'
  discountAmount: number
}

export interface CartTotalsResult {
  subtotal: number
  taxTotal: number
  discountTotal: number
  grandTotal: number
  roundingAdjustment: number
}

export function computeCartTotals(input: CartTotalsInput): CartTotalsResult {
  const taxTotal = input.taxType === 'Inclusive'
    ? input.subtotal - input.subtotal / (1 + input.taxPercent / 100)
    : input.subtotal * (input.taxPercent / 100)

  const exactGrandTotal = input.taxType === 'Inclusive'
    ? input.subtotal - input.discountAmount
    : input.subtotal + taxTotal - input.discountAmount

  const grandTotal = Math.round(exactGrandTotal)

  return {
    subtotal: input.subtotal,
    taxTotal,
    discountTotal: input.discountAmount,
    grandTotal,
    roundingAdjustment: grandTotal - exactGrandTotal,
  }
}
