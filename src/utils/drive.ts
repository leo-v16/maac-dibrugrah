/**
 * Utility to convert standard Google Drive sharing links into direct media URLs.
 * @param url The Google Drive sharing URL.
 * @returns A direct link suitable for img or video tags.
 */
export const parseDriveUrl = (url: string): string => {
  if (!url || !url.includes('drive.google.com')) return url;
  
  try {
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (fileIdMatch && fileIdMatch[0]) {
      const fileId = fileIdMatch[0];
      // Note: This works for images and small videos. 
      // Larger videos might require the Google Drive API or a proxy.
      return `https://drive.google.com/uc?id=${fileId}`;
    }
  } catch (e) {
    console.error("Error parsing Drive URL", e);
  }
  
  return url;
};
