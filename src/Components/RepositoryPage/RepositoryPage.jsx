import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./RepositoryPage.css";
import { useNavigate } from "react-router-dom";

function RepositoryPage() {
  const [repository, setRepository] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);

  useEffect(() => {
    if (!token) {
      console.error("Token not found in local storage");
      return;
    }

    fetch(
      "https://localhost:7164/API/Repository/repositoryById/" +
        location.state.id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setRepository(data))
      .catch((error) => console.error("Error fetching data:", error));
    console.log(repository);
  }, [token, location.state.id]);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch(
      "https://localhost:7164/API/Assigment/assignmentForRepository/" +
        location.state.id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setAssignments(data))
      .catch((error) => console.error("Error fetching assignments:", error));
  }, [token, location.state.id]);

  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.removeItem("token");
    navigate("/");
  };

  const goToMyAccountPage = () => {
    navigate("/myAccountPage");
  };

  return (
    <div className="repository-page">
      <div className="header-buttons">
        <button onClick={goToMyAccountPage}>Moje Konto</button>
        <button onClick={handleLogout}>Wylogowanie</button>
      </div>
      {repository ? (
        <div>
          <h1>{repository.name}</h1>
          <h2>{repository.topic}</h2>
          <h3>Assignments:</h3>
          <ul>
            {assignments.map((assignment) => (
              <li
                key={assignment.assignmentID}
                onClick={() =>
                  navigate("/assignmentPage", {
                    state: { id: assignment.assignmentID },
                  })
                }
              >
                <p>Name: {assignment.name}</p>
                <p>
                  Start Date:{" "}
                  {new Date(assignment.startDate).toLocaleDateString()}
                </p>
                <p>
                  End Date: {new Date(assignment.endDate).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default RepositoryPage;
