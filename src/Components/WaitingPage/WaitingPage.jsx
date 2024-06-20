import React, { useState, useEffect, useContext } from "react";
import "./WaitingPage.css";
import { useNavigate } from "react-router-dom";

function WaitingPage() {
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState("");
  const [myRepositories, setMyRepositories] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.removeItem("token");
    localStorage.setItem("role", "");
    localStorage.removeItem("role");
    localStorage.setItem("user", "");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="repository-page">
      <div className="header-buttons">
        <button onClick={handleLogout}>Wylogowanie</button>
      </div>

      <h1>
        Access to the resources will be granted after approval by the
        administrator.
      </h1>
    </div>
  );
}
export default WaitingPage;
