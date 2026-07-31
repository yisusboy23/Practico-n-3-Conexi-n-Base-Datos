import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const login = async (credentials) => {
        try {
            const response = await authApi.login(credentials);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            return { success: true, user };
        } catch (error) {
            setError(error.response?.data?.message || 'Error al iniciar sesión');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authApi.register(userData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            return { success: true, user };
        } catch (error) {
            setError(error.response?.data?.message || 'Error al registrarse');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
            localStorage.removeItem('token');
            setUser(null);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message };
        }
    };

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            const response = await authApi.user();
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}