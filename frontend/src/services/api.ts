import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<any>) => {
        const originalRequest = error.config as any;

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
              this.logout();
              window.location.href = '/login';
              return Promise.reject(error);
            }

            const response = await axios.post(`${API_URL}/v1/auth/refresh`, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            this.setTokens(accessToken, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  public logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  // Generic request methods
  public get<T = any>(url: string, config = {}): Promise<T> {
    return this.client.get<T>(url, config).then((res) => res.data);
  }

  public post<T = any>(url: string, data: any, config = {}): Promise<T> {
    return this.client.post<T>(url, data, config).then((res) => res.data);
  }

  public put<T = any>(url: string, data: any, config = {}): Promise<T> {
    return this.client.put<T>(url, data, config).then((res) => res.data);
  }

  public patch<T = any>(url: string, data: any, config = {}): Promise<T> {
    return this.client.patch<T>(url, data, config).then((res) => res.data);
  }

  public delete<T = any>(url: string, config = {}): Promise<T> {
    return this.client.delete<T>(url, config).then((res) => res.data);
  }
}

export const apiClient = new ApiClient();
