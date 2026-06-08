import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

let csrfToken = null;

const fetchCsrfToken = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/csrf-token`, { withCredentials: true });
        csrfToken = res.data.csrfToken;
    } catch (e) {
        console.error("Failed to fetch CSRF token", e);
    }
};

// Fetch token immediately on app load
fetchCsrfToken();

api.interceptors.request.use(async (config) => {
    // Only attach CSRF token to state-mutating requests
    if (["post", "put", "delete", "patch"].includes(config.method)) {
        if (!csrfToken) {
            await fetchCsrfToken();
        }
        if (csrfToken) {
            config.headers["X-CSRF-Token"] = csrfToken;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        
        if (status === 429) {
            toast.error("Too many requests. Slow down.");
        } else if (status >= 500) {
            toast.error("Server error. Try again shortly.");
        }
        
        if (status === 401 && !originalRequest._retry) {
            if (originalRequest.url === '/auth/refresh' || originalRequest.url === '/login') {
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                await api.post('/auth/refresh');
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
