export const ENV = {
  API_BASE_URL: 'https://ecofuelglobal.com',
};

export const getApiUrl = (endpoint: string) => {
  const baseUrl = ENV.API_BASE_URL.endsWith('/') ? ENV.API_BASE_URL.slice(0, -1) : ENV.API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  
  // Already a full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Base64 data URL
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Server path (starts with /uploads/)
  if (imagePath.startsWith('/uploads/')) {
    const baseUrl = ENV.API_BASE_URL.endsWith('/') ? ENV.API_BASE_URL.slice(0, -1) : ENV.API_BASE_URL;
    return `${baseUrl}${imagePath}`;
  }
  
  // Base64 string without prefix
  if (imagePath.length > 100 && !imagePath.includes('/')) {
    return `data:image/jpeg;base64,${imagePath}`;
  }
  
  return imagePath;
};
