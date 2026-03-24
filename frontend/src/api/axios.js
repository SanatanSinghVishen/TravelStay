import axios from "axios";

// Determine base URL: mostly likely localhost:3001 if developing locally
// In production, we might point to the Render URL.
// For now, hardcode localhost or use VITE_ env var.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 60000, // 60s — handles Render free-tier cold start
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
