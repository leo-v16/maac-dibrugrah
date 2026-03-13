import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes dirty HTML strings to prevent XSS attacks while allowing safe elements and attributes.
 * @param dirtyHtml The raw HTML string to be cleaned.
 * @returns A sanitized HTML string.
 */
export const cleanHtml = (dirtyHtml: string): string => {
  return DOMPurify.sanitize(dirtyHtml, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['style'], 
    ADD_ATTR: ['class', 'style', 'id', 'target', 'rel'], // Explicitly allow styling attributes
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload'],
  });
};
