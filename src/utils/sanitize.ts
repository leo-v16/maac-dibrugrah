/**
 * Sanitizes dirty HTML strings to prevent XSS attacks while allowing safe elements and attributes.
 * Uses dynamic import to avoid CJS/ESM conflicts with jsdom in Next.js server components.
 * @param dirtyHtml The raw HTML string to be cleaned.
 * @returns A promise that resolves to a sanitized HTML string.
 */
export const cleanHtml = async (dirtyHtml: string): Promise<string> => {
  if (!dirtyHtml) return '';
  
  // Dynamic import allows loading ESM modules in a CJS/Next.js server context
  const { default: DOMPurify } = await import('isomorphic-dompurify');
  
  return DOMPurify.sanitize(dirtyHtml, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['style'], 
    ADD_ATTR: ['class', 'style', 'id', 'target', 'rel'], 
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload'],
  });
};
