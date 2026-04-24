import axios from "axios"; 

export const ACCESS_TOKEN_STORAGE_KEY = "shop_access_token";

const axiosInstance = axios.create({
  baseURL : "http://localhost:3000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  }, 
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export function setAccessToken(token) {
  if (!token) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

export function clearAccessToken() {
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export default axiosInstance;    
