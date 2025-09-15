import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin-user");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        setUser({
          ...decoded,
          token: savedToken,
        });
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("admin-user");
      }
    }
    setLoading(false); 
  }, []);

  const login = (token) => {
    localStorage.setItem("admin-user", token);
    const decoded = jwtDecode(token);
    setUser({
      ...decoded,
      token,
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("admin-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };