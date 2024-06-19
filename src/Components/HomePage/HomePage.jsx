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
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
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
    localStorage.setItem("role", "");
    localStorage.removeItem("role");
    localStorage.setItem("user", "");
    localStorage.removeItem("user");
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
        setEnrollmentModalOpen(true);

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
        setEnrollmentModalOpen(false);
      })
      .catch((error) => console.error("Error enrolling user:", error));
  };

  const role = localStorage.getItem("role");
  useEffect(() => {
    if (userData) {
      const role = userData.roleID?.toString();
      if (role) {
        localStorage.setItem("role", role);
      }
      const user = userData.userID?.toString();
      if (user) {
        localStorage.setItem("user", user);
      }
    }
  }, [userData]);

  const filteredRepositories = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="repository-page">
        <div className="header-buttons">
          <button onClick={goToMyAccountPage}>Moje Konto</button>
          <button onClick={handleLogout}>Wylogowanie</button>
          {role === "2" && (
            <button onClick={handleCreateRepository}>
              Utwórz repozytorium
            </button>
          )}
        </div>
      </div>
      <h1>Lista repozytoriów</h1>
      <input
        type="text"
        placeholder="Wyszukaj repozytorium..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {filteredRepositories.map((repo) => (
          <li key={repo.id} onClick={() => checkAndNavigate(repo.repositoryID)}>
            <h2>{repo.name}</h2>
          </li>
        ))}
      </ul>

      {checkingEnrollment && <p>Sprawdzanie zapisów...</p>}

      {enrollmentModalOpen && (
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
          <button onClick={() => setEnrollmentModalOpen(false)}>Zamknij</button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
