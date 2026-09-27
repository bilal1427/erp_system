import {
    createContext,
    useContext,
    useState
} from "react";

import {
    getToken,
    getUser,
    setAuthData,
    clearAuthData
} from "../utils/auth";

import { loginApi } from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());

    const login = async (email, password) => {

        const response = await loginApi(
            email,
            password
        );

        const data = response.data;

        const userData = {
            id: data.id,
            email: data.email,
            role: data.role
        };

        setAuthData(
            data.token,
            userData
        );

        setToken(data.token);
        setUser(userData);

        return userData;
    };

    const logout = () => {

        clearAuthData();

        setToken(null);
        setUser(null);
    };

    const value = {
        token,
        user,
        role: user?.role || null,
        isAuthenticated: !!token,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};

export default AuthContext;