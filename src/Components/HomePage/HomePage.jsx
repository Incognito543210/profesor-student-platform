import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);
  const [isUserAccepted, setIsUserAccepted] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
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
  }, [token]);

  useEffect(() => {
    if (userData) {
      const role = userData.roleID?.toString();
      if (role) {
        localStorage.setItem("role", role);
      }
    }
  }, [userData]);

  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.removeItem("token");
    navigate("/");
  };

  const goToMyAccountPage = () => {
    navigate("/myAccountPage");
  };

  const handleCreateRepository = () => {
    navigate("/createUpdateRepositoryPage");
  };

  const checkAndNavigate = (repoId) => {
    setCheckingEnrollment(true);
    fetch("https://localhost:7164/API/Repository/UserExistInRepo/" + repoId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setIsUserEnrolled(data.userID !== 0);
        setIsUserAccepted(data.isMember);
        setSelectedRepo(repoId);
        setCheckingEnrollment(false);

        if (data.isMember) {
          navigate("/repositoryPage", { state: { id: repoId } });
        }
      })
      .catch((error) => {
        console.error("Error checking enrollment:", error);
        setCheckingEnrollment(false);
      });
  };

  const enrollUser = (repoId) => {
    const enrollmentData = {
      enterDate: new Date().toISOString(),
      hasPrivilage: false,
      isMember: false,
      userID: 0,
      repositoryID: repoId,
    };

    fetch("https://localhost:7164/API/Repository/addStudentToRepository", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(enrollmentData),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Zostałeś zapisany. Czekaj na akceptację.");
        setSelectedRepo(null);
      })
      .catch((error) => console.error("Error enrolling user:", error));
  };

  const role = localStorage.getItem("role");

  return (
    <div>
      <div className="repository-page">
        <div className="header-buttons">
          <button onClick={goToMyAccountPage}>Moje Konto</button>
          <button onClick={handleLogout}>Wylogowanie</button>
          {(role === "1" || role === "2") && (
            <button onClick={handleCreateRepository}>
              Utwórz repozytorium
            </button>
          )}
        </div>
      </div>
      <h1>Lista repozytoriów</h1>
      <ul>
        {repositories.map((repo) => (
          <li key={repo.id} onClick={() => checkAndNavigate(repo.repositoryID)}>
            <h2>{repo.name}</h2>
          </li>
        ))}
      </ul>

      {checkingEnrollment && <p>Sprawdzanie zapisów...</p>}

      {selectedRepo && !checkingEnrollment && (
        <div className="enrollment-modal">
          {isUserEnrolled ? (
            <p>Jesteś już zapisany. Czekaj na akceptację.</p>
          ) : (
            <div>
              <p>Nie jesteś zapisany do tego repozytorium.</p>
              <button onClick={() => enrollUser(selectedRepo)}>
                Zapisz mnie
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
