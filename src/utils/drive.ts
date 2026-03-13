/**
 * Utility to convert standard Google Drive sharing links into direct media URLs or embeddable previews.
 * @param url The Google Drive sharing URL.
 * @param mode 'direct' for <img>/<video> tags, 'preview' for <iframe> embeds.
 * @returns A transformed URL.
 */
export const parseDriveUrl = (url: string, mode: 'direct' | 'preview' = 'direct'): string => {
  if (!url || !url.includes('drive.google.com')) return url;
  
  try {
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (fileIdMatch && fileIdMatch[0]) {
      const fileId = fileIdMatch[0];
      
      if (mode === 'preview') {
        // Most reliable for videos in iframes to avoid "access denied" or "too large to scan" errors
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
      
      // Direct download link (works for images and small files)
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  } catch (e) {
    console.error("Error parsing Drive URL", e);
  }
  
  return url;
};
