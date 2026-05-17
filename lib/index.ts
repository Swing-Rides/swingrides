import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// const API_BASE_URL = 'http://147.93.190.15:3000';
const API_BASE_URL = "http://localhost:3000";
// const API_BASE_URL = '';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              console.error("Bad request:", error.response.data);
              break;
            case 401:
              this.clearAuthToken();
              break;
            case 403:
              console.error("Access forbidden");
              break;
            case 500:
              console.error("Server error");
              break;
          }
        } else if (error.request) {
          console.error("Network error:", error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  private clearAuthToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  public getClient(): AxiosInstance {
    return this.instance;
  }
}

export const apiClient = new ApiClient().getClient();
export default apiClient;
