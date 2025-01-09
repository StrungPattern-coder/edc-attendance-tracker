import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navigation = () => {
  const { authenticated, role, logoutUser } = useAuth();

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>

        {/* Display different links based on the role */}
        {authenticated && role === "admin" && (
          <>
            <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
            <li><Link to="/manage-users">Manage Users</Link></li>
          </>
        )}

        {authenticated && role === "member" && (
          <li><Link to="/user-dashboard">User Dashboard</Link></li>
        )}

        {!authenticated && <li><Link to="/login">Login</Link></li>}

        {authenticated && (
          <li>
            <button onClick={logoutUser}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;