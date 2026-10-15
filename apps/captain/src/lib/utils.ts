export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const DEFAULT_NOTE_PRESETS = ['Running', 'Parcel', 'No Spicy', 'Less Spicy']

export function parseNotePresets(notePresets?: string | null): string[] {
  const presets = (notePresets ?? '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  return presets.length > 0 ? presets : DEFAULT_NOTE_PRESETS
}
