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

        const isAdmin = localStorage.getItem("role") === "1";

        if (data.isMember || isAdmin) {
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
    <div className="repository-page">
      <div className="header-buttons">
        <button onClick={goToMyAccountPage}>My account</button>
        <button onClick={handleLogout}>Logout</button>
        {localStorage.getItem("role") === "2" && (
          <button onClick={handleCreateRepository}>Create repository</button>
        )}
      </div>

      <h1>Repository list</h1>
      <input
        type="text"
        placeholder="Search for repository..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar" // Dodanie klasy dla wyszukiwarki
      />

      <ul>
        {filteredRepositories.map((repo) => (
          <li
            key={repo.id}
            className="repo-item"
            onClick={() => checkAndNavigate(repo.repositoryID)}
          >
            <h2>{repo.name}</h2>
            <p>{repo.description}</p>
          </li>
        ))}
      </ul>

      {checkingEnrollment && <p>Checking records...</p>}

      {enrollmentModalOpen && (
        <div className="enrollment-modal">
          {isUserEnrolled ? (
            <p>You are already registered. Wait for acceptance.</p>
          ) : (
            <div>
              <p>You are not subscribed to this repository.</p>
              <button onClick={() => enrollUser(selectedRepo)}>
                Enroll me
              </button>
            </div>
          )}
          <button onClick={() => setEnrollmentModalOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
