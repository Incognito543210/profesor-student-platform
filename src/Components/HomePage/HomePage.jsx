import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../../Context/AuthContext";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      console.error("Token not found in local storage");
      return;
    }

    fetch("https://localhost:7164/API/Repository/allRepository", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setRepositories(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("https://localhost:7164/API/Account/getUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching assignments:", error));
    console.log(userData);
  }, [token]);

  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.removeItem("token");
    navigate("/");
  };

  const goToMyAccountPage = () => {
    navigate("/myAccountPage");
  };

  useEffect(() => {
    if (userData) {
      const role = userData.roleID?.toString();
      if (role) {
        localStorage.setItem("role", role);
      }
      const user = userData.userID?.toString();
      if (user){
        localStorage.setItem("user", user);
      }
    }
  }, [userData]);

  return (
    <div>
      <div className="repository-page">
        <div className="header-buttons">
          <button onClick={goToMyAccountPage}>Moje Konto</button>
          <button onClick={handleLogout}>Wylogowanie</button>
        </div>{" "}
      </div>
      <h1>Lista repozytoriów</h1>
      <ul>
        {repositories.map((repo) => (
          <li
            key={repo.id}
            onClick={() =>
              navigate("/repositoryPage", { state: { id: repo.repositoryID } })
            }
          >
            <h2>{repo.name}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
