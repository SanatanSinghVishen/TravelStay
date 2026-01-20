import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Decode token or user stored in local storage
            // For simplicity, we stored { token, user } in login response.
            // We can also persist user in localStorage or fetch specific /me endpoint.
            // Let's rely on localStorage 'user' for now to keep state on refresh.
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await api.post("/login", { username: email, password }); // Backend expects username/password for LocalStrategy, but we might pass email as username if structured that way.
            // Wait, User model has 'username' and 'email'. PassportLocal defaults to 'username'.
            // If user logs in with email, we might need a custom strategy or tell passport to use email.
            // However, typical setup uses username. Let's assume username login for now.
            // Wait, travelstay usually used username.
            // I'll adjust the Login Form to ask for "Username" or check if backend supports email.
            // Current backend uses `passport-local-mongoose` defaults -> Username.

            const { token, user } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setToken(token);
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error("Login failed", error.response?.data);
            return { success: false, error: error.response?.data?.error || "Login failed" };
        }
    };

    const signup = async (username, email, password) => {
        try {
            const res = await api.post("/signup", { username, email, password });
            const { token, user } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setToken(token);
            setUser(user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || "Signup failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
