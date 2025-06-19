import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error(error.response.data?.error || "Invalid request");
          break;
        case 401:
          toast.error("Unauthorized - Please login");
          break;
        case 404:
          toast.error("Resource not found");
          break;
        case 429:
          toast.error("Rate limit exceeded. Please try again later.");
          break;
        case 500:
          toast.error("Server error - Please try again later");
          break;
        default:
          toast.error(`Error: ${error.message}`);
      }
    } else if (error.request) {
      toast.error("No response received from server");
    } else {
      toast.error("Request setup error");
    }
    
    return Promise.reject(error);
  }
);

interface ShortenUrlPayload {
  targetUrl: string;
  custom_id?: string;
  userId?: string;
}

export const shortenUrl = async (payload: ShortenUrlPayload | string) => {
  try {
    const requestPayload =
      typeof payload === "string" 
        ? { target_url: payload } 
        : payload;

    const response = await api.post("/shorten", requestPayload);
    
    if (!response.data?.short_url) {
      throw new Error("Invalid response format");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error shortening URL:", error);
    throw error;
  }
};

export const redirectToUrl = async (shortId: string) => {
  try {
    const cleanShortId = shortId.replace(/^\//, '');
    
    const response = await api.get(`/${cleanShortId}`, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });

    if (response.data?.target_url) {
      return response.data.target_url;
    }

    if (response.headers.location) {
      return response.headers.location;
    }

    throw new Error("No redirect URL found");
  } catch (error) {
    console.error("Redirect error:", error);
    return process.env.NEXT_PUBLIC_FRONTEND_URL + "/404";
  }
};

export default api;