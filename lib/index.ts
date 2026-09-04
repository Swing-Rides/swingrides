import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = "/backend";

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
            case 403: {
              const data = error.response.data as
                | { message?: string; error?: string }
                | undefined;
              if (
                data?.message === "Account suspended" ||
                data?.error === "Account suspended"
              ) {
                this.handleHostSuspended();
              } else {
                console.error("Access forbidden");
              }
              break;
            }
            // The backend's rate limiters answer with a `message` explaining
            // how long to wait, and callers already surface that text, so
            // there's nothing to do here beyond recording it.
            case 429:
              console.warn("Rate limited:", error.response.data);
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

  // The backend has already cleared the host_session cookie server-side once
  // it detects the account is suspended — this just gets the host off the
  // suspended dashboard and onto a page that explains why.
  private handleHostSuspended() {
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/host/login")
    ) {
      window.location.href = "/host/login?suspended=1";
    }
  }

  public getClient(): AxiosInstance {
    return this.instance;
  }
}

export const apiClient = new ApiClient().getClient();
export default apiClient;
