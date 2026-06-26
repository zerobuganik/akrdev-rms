import { describe, it, expect } from 'vitest'
import { generateDisplayId } from './display-id'
import { calculateTax, calculateRounding } from './tax'
import { computeCartTotals } from './cart-totals'
import { safeParseJSON, debounce, truncate } from './helpers'

describe('generateDisplayId', () => {
  it('generates dine-in IDs', () => {
    expect(generateDisplayId('D', 2026, 1)).toBe('D/260001')
  })

  it('generates takeaway IDs', () => {
    expect(generateDisplayId('T', 2026, 42)).toBe('T/260042')
  })

  it('pads sequence to 4 digits', () => {
    expect(generateDisplayId('D', 2026, 9999)).toBe('D/269999')
  })
})

describe('calculateTax', () => {
  it('calculates exclusive tax', () => {
    const result = calculateTax(1000, 5, 'Exclusive')
    expect(result.taxTotal).toBe(50)
    expect(result.subtotalExTax).toBe(1000)
  })

  it('calculates inclusive tax (reverse)', () => {
    const result = calculateTax(105, 5, 'Inclusive')
    expect(result.taxTotal).toBeCloseTo(5, 0)
    expect(result.subtotalExTax).toBeCloseTo(100, 0)
  })

  it('handles zero tax', () => {
    const result = calculateTax(500, 0, 'Exclusive')
    expect(result.taxTotal).toBe(0)
  })
})

describe('calculateRounding', () => {
  it('rounds to nearest integer', () => {
    const result = calculateRounding(100.4)
    expect(result.grandTotal).toBe(100)
    expect(result.roundingAdjustment).toBeCloseTo(-0.4, 1)
  })

  it('rounds up at .5', () => {
    const result = calculateRounding(100.5)
    expect(result.grandTotal).toBe(101)
    expect(result.roundingAdjustment).toBeCloseTo(0.5, 1)
  })
})

describe('computeCartTotals', () => {
  it('computes totals for exclusive tax', () => {
    const result = computeCartTotals({
      subtotal: 1000,
      taxPercent: 5,
      taxType: 'Exclusive',
      discountAmount: 100,
    })
    expect(result.subtotal).toBe(1000)
    expect(result.taxTotal).toBe(50)
    expect(result.discountTotal).toBe(100)
    expect(result.grandTotal).toBe(950)
  })

  it('computes totals for inclusive tax', () => {
    const result = computeCartTotals({
      subtotal: 105,
      taxPercent: 5,
      taxType: 'Inclusive',
      discountAmount: 0,
    })
    expect(result.taxTotal).toBeCloseTo(5, 0)
    expect(result.grandTotal).toBe(105)
  })
})

describe('safeParseJSON', () => {
  it('parses valid JSON', () => {
    expect(safeParseJSON('{"a":1}', { a: 0 })).toEqual({ a: 1 })
  })

  it('returns fallback on invalid JSON', () => {
    expect(safeParseJSON('bad', { a: 0 })).toEqual({ a: 0 })
  })
})

describe('debounce', () => {
  it('delays function execution', () => new Promise<void>((done) => {
    let calls = 0
    const fn = debounce(() => { calls++ }, 100)
    fn()
    fn()
    fn()
    expect(calls).toBe(0)
    setTimeout(() => { expect(calls).toBe(1); done() }, 200)
  }))
})

describe('truncate', () => {
  it('returns short strings as-is', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('truncates long strings', () => {
    const result = truncate('hello world', 5)
    expect(result).toBe('hell…')
  })
})
