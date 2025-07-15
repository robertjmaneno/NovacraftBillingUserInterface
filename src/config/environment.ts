export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://localhost:7197',
  environment: import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export const getApiUrl = () => config.apiUrl; 