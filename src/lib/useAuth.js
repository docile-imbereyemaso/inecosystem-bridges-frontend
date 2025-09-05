import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";



export const useAuth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("token_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem("token_ineco");

  // Logout function
  const logout = () => {
    localStorage.removeItem("token_ineco");
    localStorage.removeItem("token_user");
    setUser(null);
    navigate("/login"); // redirect to login page
  };

  return { user, setUser, isAuthenticated, logout };
};
