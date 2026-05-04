export function publicAssetUrl(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.replace(/^\/*/, "");
  return `/${normalized}`;
}
