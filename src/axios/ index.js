import axios from "axios"; 

export const ACCESS_TOKEN_STORAGE_KEY = "access_token";

const axiosInstance = axios.create({
  baseURL : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
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

export function setItemInLocalStorage( key, value ) {
  if (!key) {
    console.error("LocalStorage Error: key is required");
    return;
  }

  try {
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);

    window.localStorage.setItem(key, stringValue);
  } catch (error) {
    console.error("LocalStorage Error:", error);
  }
}

export default axiosInstance;    
