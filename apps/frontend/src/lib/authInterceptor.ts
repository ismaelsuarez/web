import axios from 'axios';
import { authApi } from './api';

// Crear instancia de axios para interceptores (soporta runtime env y fallback al proxy /api)
const runtimeEnv = (globalThis as any)?.window?.ENV;
const runtimeBaseURL = runtimeEnv?.VITE_API_URL as string | undefined;
const buildBaseURL = (import.meta as any).env.VITE_API_URL as string | undefined;

// Elegir baseURL solo cuando es una URL absoluta (http/https). Si es un path como '/api',
// dejamos baseURL vacío para evitar duplicar '/api' en las rutas ya absolutas del caller.
const chosenBaseURL = runtimeBaseURL ?? buildBaseURL;
const effectiveBaseURL = chosenBaseURL && !chosenBaseURL.startsWith('/') ? chosenBaseURL : '';

const api = axios.create({
  // Default to empty base URL so callers can use absolute paths like '/api/...'
  // and avoid duplicating '/api' when ENV provides '/api' as well.
  baseURL: effectiveBaseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar refresh token automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await authApi.refreshToken({ refreshToken });
          
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          // Reintentar la request original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si el refresh token falla, limpiar localStorage y redirigir al login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
