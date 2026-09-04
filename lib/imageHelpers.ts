/**
 * Validates whether a given value is a usable image `src`.
 *
 * Returns `true` for non-empty strings that start with `/`, `http://`,
 * `https://`, or `data:image/`.
 */
export const isValidImageSrc = (src: unknown): src is string => {
  if (typeof src !== 'string' || src.trim().length === 0) return false;
  return (
    src.startsWith('/') ||
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:image/')
  );
};

