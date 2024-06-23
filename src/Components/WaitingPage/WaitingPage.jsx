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
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="repository-page">
      <div className="header-buttons">
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h1>
        Access to the resources will be granted after approval by the
        administrator.
      </h1>
    </div>
  );
}
export default WaitingPage;
