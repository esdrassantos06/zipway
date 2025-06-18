import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      toast.error("Rate limit exceeded. Please try again later.");
    }
    return Promise.reject(error);
  },
);

export const shortenUrl = async (url: string) => {
  return await api.post("/shorten", { target_url: url });
};

export default api;
