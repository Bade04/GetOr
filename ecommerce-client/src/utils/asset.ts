export function publicAssetUrl(value?: string | null) {
  if (!value) {
    return value;
  }

  const normalized = value.replace(/^\/*/, "");
  return `/${normalized}`;
}
