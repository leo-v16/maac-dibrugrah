import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes dirty HTML strings to prevent XSS attacks while allowing safe elements and attributes.
 * Uses sanitize-html which is purely string-based and works perfectly in Next.js Serverless/Edge environments
 * without causing CJS/ESM jsdom module resolution issues.
 * @param dirtyHtml The raw HTML string to be cleaned.
 * @returns A sanitized HTML string.
 */
export const cleanHtml = (dirtyHtml: string): string => {
  if (!dirtyHtml) return '';
  
  return sanitizeHtml(dirtyHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'style' ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'style', 'id'],
      'a': ['href', 'name', 'target', 'rel'],
      'img': ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading']
    },
    allowedStyles: {
      '*': {
        // Allow any styling to pass through since we explicitly allow the style attribute
        // In a strict environment you might want to regex match specific CSS properties
        'color': [/^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, /^rgba?\(/],
        'background-color': [/^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, /^rgba?\(/],
        'text-align': [/^left$/, /^right$/, /^center$/],
        'font-size': [/^\d+(?:px|em|%)$/]
      }
    },
    // We allow all styles if they are inline, sanitize-html's allowedStyles can be restrictive.
    // If you need full CSS freedom inline, you can set transformTags or configure it further.
  });
};
