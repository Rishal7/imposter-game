type ClassValue = string | false | null | undefined;

/** Tiny conditional-classname joiner — not worth a dependency for this. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
