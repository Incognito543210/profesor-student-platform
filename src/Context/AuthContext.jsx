import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext({
  token: "",
  role: "",
  logOut: () => [],
});

export const useAuth = () => {
  return useContext(authContext);
};

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false);
    };
    getToken();
  }, []);

  useEffect(() => {
    const getRole = () => {
      const storedRole = localStorage.getItem("role");
      if (storedRole) {
        setRole(storedRole);
      }
      setLoading(false);
    };
    getRole();
  }, []);

  useEffect(() => {
    console.log("Login successful, token:", token);
  }, [token]);

  const logOut = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  const values = {
    token,
    role,
    logOut,
  };

  return (
    !loading && (
      <authContext.Provider value={values}>{children}</authContext.Provider>
    )
  );
};
