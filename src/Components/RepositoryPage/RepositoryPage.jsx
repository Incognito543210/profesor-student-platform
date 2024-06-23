import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./RepositoryPage.css";
import { useNavigate } from "react-router-dom";

function RepositoryPage() {
  const [repository, setRepository] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const userID = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
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

  useEffect(() => {
    if(repository){
      const createdById = repository.createdById?.toString()
      if(createdById)
        localStorage.setItem("createdById",createdById)
    }
  })

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const goToCreateAssignment = () => {
    navigate("/createAssignmentPage", { state: { repository } });
  };

  const goToMyAccountPage = () => {
    navigate("/myAccountPage");
  };

  const goToAcceptStudentsPage = () => {
    navigate("/acceptStudentsPage", { state: { id: location.state.id } });
  };

  const goToUpdateRepositoryPage = () => {
    navigate("/createUpdateRepositoryPage", { state: { repository } });
  };

  const removeAssignment = (assignment) => {
    if (!token) {
      return;
    }

    fetch("https://localhost:7164/API/Assigment/deleteAssigment", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(assignment),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        window.location.reload();
      })
      .catch((error) => console.error("Error fetching assignments:", error));

    window.location.reload();
  };

  const removeRepository = () => {
    if (!token) {
      return;
    }

    fetch("https://localhost:7164/API/Repository/deleteRepository", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(repository),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        navigate("/home"); // Redirect to the list of repositories or another appropriate page
      })
      .catch((error) => console.error("Error deleting repository:", error));
  };

  const canUpdateRepository =
    repository &&
    repository.createdById &&
    repository.createdById.toString() === userID;

  return (
    <div className="repository-page">
      <div className="header-buttons">
        <button onClick={goToMyAccountPage}>My account</button>
        <button onClick={handleLogout}>Logout</button>
        {canUpdateRepository && (
          <>
            <button onClick={goToAcceptStudentsPage}>Accept students</button>
            <button onClick={goToUpdateRepositoryPage}>
              Update Repository
            </button>
            <button onClick={goToCreateAssignment}>Create Assignment</button>
          </>
        )}
      </div>
      {repository ? (
        <div>
          <h1>{repository.name}</h1>
          <h2>{repository.topic}</h2>
          <h1>{role}</h1>
          <h3>Assignments:</h3>
          <ul>
            {assignments.map((assignment) => (
              <li key={assignment.assignmentID}>
                <button
                  onClick={() =>
                    navigate("/assignmentPage", {
                      state: { id: assignment.assignmentID },
                    })
                  }
                >
                  See Assigmnent
                </button>
                <p>Name: {assignment.name}</p>
                <p>
                  Start Date:{" "}
                  {new Date(assignment.startDate).toLocaleDateString()}
                </p>
                <p>
                  End Date: {new Date(assignment.endDate).toLocaleDateString()}
                </p>
                {canUpdateRepository && (
                  <button onClick={() => removeAssignment(assignment)}>
                    Remove Assignment
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {canUpdateRepository && (
        <div className="delete-repository-button">
          <button onClick={removeRepository}>Delete Repository</button>
        </div>
      )}
    </div>
  );
}

export default RepositoryPage;
