import axios from "axios";

const BASE = import.meta.env.DEV ? "" : (import.meta.env as any).VITE_API_URL || "";

const API = axios.create({
  baseURL: BASE,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {}
    return config;
  },
  (err) => Promise.reject(err)
);

export default API;
