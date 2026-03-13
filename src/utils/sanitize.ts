import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes dirty HTML strings to prevent XSS attacks while allowing safe elements and attributes.
 * Updated to allow a wide range of inline CSS properties for layout and design (Flexbox, Borders, Shadows, etc.)
 * @param dirtyHtml The raw HTML string to be cleaned.
 * @returns A sanitized HTML string.
 */
export const cleanHtml = (dirtyHtml: string): string => {
  if (!dirtyHtml) return '';
  
  return sanitizeHtml(dirtyHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 
      'img', 'style', 'div', 'section', 'article', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'br' 
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'style', 'id'],
      'a': ['href', 'name', 'target', 'rel'],
      'img': ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading']
    },
    allowedStyles: {
      '*': {
        // Layout & Flexbox
        'display': [/^flex$/, /^block$/, /^inline-block$/, /^grid$/, /^none$/],
        'flex': [/^.*$/],
        'flex-wrap': [/^wrap$/, /^nowrap$/, /^wrap-reverse$/],
        'flex-direction': [/^row$/, /^column$/],
        'justify-content': [/^.*$/],
        'align-items': [/^.*$/],
        'gap': [/^.*$/],
        
        // Sizing & Spacing
        'width': [/^.*$/],
        'height': [/^.*$/],
        'min-width': [/^.*$/],
        'max-width': [/^.*$/],
        'margin': [/^.*$/],
        'margin-top': [/^.*$/],
        'margin-bottom': [/^.*$/],
        'margin-left': [/^.*$/],
        'margin-right': [/^.*$/],
        'padding': [/^.*$/],
        'padding-top': [/^.*$/],
        'padding-bottom': [/^.*$/],
        'padding-left': [/^.*$/],
        'padding-right': [/^.*$/],

        // Borders & Visuals
        'border': [/^.*$/],
        'border-top': [/^.*$/],
        'border-bottom': [/^.*$/],
        'border-left': [/^.*$/],
        'border-right': [/^.*$/],
        'border-radius': [/^.*$/],
        'box-shadow': [/^.*$/],
        'background': [/^.*$/],
        'background-color': [/^.*$/],
        
        // Typography
        'color': [/^.*$/],
        'font-family': [/^.*$/],
        'font-size': [/^.*$/],
        'text-align': [/^.*$/],
        'list-style-type': [/^.*$/]
      }
    }
  });
};
