import React, { useState, useEffect, useContext } from "react";
import "./MyAccountPage.css";
import { useNavigate } from "react-router-dom";

function MyAccountPage() {
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState("");
  const [myRepositories, setMyRepositories] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
      .then((data) => {
        setUserData(data);
        if (data.roleID === 2) {
          setRole("Nauczyciel");
        } else if (data.roleID === 3) {
          setRole("Student");
        } else if (data.roleID === 1) {
          setRole("Admin");
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [token]);

  useEffect(() => {
    if (!token) {
      console.error("Token not found in local storage");
      return;
    }

    fetch("https://localhost:7164/API/Repository/repositoryForUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setMyRepositories(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [token]);

  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.removeItem("token");
    localStorage.setItem("role", "");
    localStorage.removeItem("role");
    localStorage.setItem("user", "");
    localStorage.removeItem("user");
    navigate("/");
  };

  const goToHome = () => {
    navigate("/home");
  };

  const goToEditAccount = () => {
    navigate("/editAccountPage", { state: { userData } });
  };

  const goToAcceptUser = () => {
    navigate("/acceptUserPage");
  };

  return (
    <div className="repository-page">
      <div className="header-buttons">
        <button onClick={goToHome}>Repositories</button>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={goToEditAccount}>Edit account</button>
        {role === "Admin" && (
          <button onClick={goToAcceptUser}>Accept users</button>
        )}
      </div>

      {userData ? (
        <div className="user-info-box">
          <h1>User info:</h1>
          <h2>First name: {userData.userFirstName}</h2>
          <h2>Last name: {userData.userLastName}</h2>
          <h2>Email: {userData.email}</h2>
          <h2>
            Enter date: {new Date(userData.enterDate).toLocaleDateString()}
          </h2>
          <h2>Role: {role}</h2>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <h1>My repositories:</h1>
      <ul>
        {myRepositories.map((repo) => (
          <li
            key={repo.id}
            onClick={() =>
              navigate("/repositoryPage", {
                state: { id: repo.repositoryID },
              })
            }
          >
            <h2>{repo.name}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default MyAccountPage;
