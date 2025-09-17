import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../utils/api";

export default function PublicRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get("/auth/me");
        setAuth(true);
      } catch (err) {
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) return <div>Loading...</div>;
  if (auth === true) return <Navigate to="/leads" replace />;
  return children;
}
