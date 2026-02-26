export const ENV = {
  API_BASE_URL: 'http://localhost:3000',
};

export const getApiUrl = (endpoint: string) => {
  return `${ENV.API_BASE_URL}${endpoint}`;
};
