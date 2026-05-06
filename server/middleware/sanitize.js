// Removes basic HTML tags from text.
export function sanitizeText(value) {
  return String(value)
    .trim()
    .replace(/<[^>]*>/g, "");
}