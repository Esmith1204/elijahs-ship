/** Content that starts with "TODO" is a gap still to fill. */
export function isTodo(text: string): boolean {
  return text.trimStart().startsWith('TODO');
}

/** "TODO: who you talked to." → "who you talked to." */
export function stripTodo(text: string): string {
  return text.trimStart().replace(/^TODO(\([^)]*\))?:?\s*/, '');
}
