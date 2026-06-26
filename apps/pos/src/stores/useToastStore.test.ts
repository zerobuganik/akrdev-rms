import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useToastStore } from './useToastStore'

describe('useToastStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useToastStore.setState({ toasts: [] })
  })

  it('starts with empty toasts', () => {
    expect(useToastStore.getState().toasts).toEqual([])
  })

  it('adds a toast', () => {
    useToastStore.getState().addToast('Hello world', 'success')
    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0]!.message).toBe('Hello world')
    expect(toasts[0]!.type).toBe('success')
    expect(toasts[0]!.id).toBeDefined()
  })

  it('adds toast with default info type', () => {
    useToastStore.getState().addToast('Info message')
    expect(useToastStore.getState().toasts[0]!.type).toBe('info')
  })

  it('removes toast', () => {
    useToastStore.getState().addToast('Temp')
    const id = useToastStore.getState().toasts[0]!.id
    useToastStore.getState().removeToast(id)
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('auto-removes toast after 4 seconds', () => {
    useToastStore.getState().addToast('Auto remove')
    expect(useToastStore.getState().toasts).toHaveLength(1)
    vi.advanceTimersByTime(4000)
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })
})
