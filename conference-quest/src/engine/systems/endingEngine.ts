export const endings: Record<string, (ending: string) => void> = {};

export function triggerEnding(ending: string): void {
  const handler = endings[ending];
  if (handler) handler(ending);
}
