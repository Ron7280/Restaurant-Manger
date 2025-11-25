import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Change_Theme_context } from "./Contexts";
import { useContext, useEffect } from "react";
import Alert from "./Components/Alert";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const [changeTheme] = useContext(Change_Theme_context);
  const { notifyS, notifyE, notifyW, notifyI } = Alert({ changeTheme });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      notifyW("You must be logged in to access this page!");
    }
  }, [loading, isAuthenticated, notifyW]);

  if (loading) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
