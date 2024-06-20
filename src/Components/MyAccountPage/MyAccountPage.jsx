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
  return (
    <div className="repository-page">
      <div className="header-buttons">
        <button onClick={goToHome}>Repozytoria</button>
        <button onClick={handleLogout}>Wylogowanie</button>
      </div>
      {userData ? (
        <div>
          <h1>{userData.userFirstName}</h1>
          <h1>{userData.userLastName}</h1>
          <h1>{userData.email}</h1>
          <h1>{userData.enterDate}</h1>
          <h1>{role}</h1>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <h1>Moje repozytoria:</h1>
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
