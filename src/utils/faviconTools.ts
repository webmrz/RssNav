/**
 * 获取网站的 favicon
 * @param url 网站 URL
 * @returns favicon URL
 */
export const getFavicon = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch (error) {
    console.error('Invalid URL:', url);
    return '';
  }
};

/**
 * 检查 favicon 是否可用
 * @param faviconUrl favicon URL
 * @returns Promise<boolean>
 */
export const checkFavicon = async (faviconUrl: string): Promise<boolean> => {
  if (!faviconUrl) return false;
  
  try {
    const response = await fetch(faviconUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}; 