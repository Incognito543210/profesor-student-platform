import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CreateUpdateRepositoryPage.css";

function CreateUpdateRepositoryPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const repository = location.state?.repository;

  const [name, setName] = useState(repository?.name || "");
  const [topic, setTopic] = useState(repository?.topic || "");
  const [createdById, setCreatedById] = useState(repository?.createdById || "");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (name.trim().length === 0 || topic.trim().length === 0) {
      setErrorMessage("Name and Topic cannot be empty.");
      return;
    }

    if (name.length < 20 || topic.length < 20) {
      setErrorMessage("Name and Topic must be at least 20 characters long.");
      return;
    }

    const repositoryData = {
      repositoryID: repository ? repository.repositoryID : 0,
      name: name,
      topic: topic,
      createdById: repository ? repository.createdById : 0,
    };

    try {
      const response = await fetch(
        repository
          ? "https://localhost:7164/API/Repository/updateRepository"
          : "https://localhost:7164/API/Repository/createRepository",
        {
          method: repository ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(repositoryData),
        }
      );

      // Handle response
      const rawResponse = await response.text();
      console.log("Raw response:", rawResponse);

      if (response.ok) {
        if (response.headers.get("content-type").includes("application/json")) {
          const data = JSON.parse(rawResponse);
          console.log(
            repository
              ? "Repository updated successfully:"
              : "Repository created successfully:",
            data
          );
          navigate("/repositoryPage", {
            state: { id: data.repositoryID },
          });
        } else {
          console.log(
            repository
              ? "Repository updated successfully"
              : "Repository created successfully"
          );
          const repositoryID = repository ? repository.repositoryID : 0;
          navigate("/home", {
            state: { id: repositoryID },
          });
        }
      } else {
        const errorData = response.headers
          .get("content-type")
          .includes("application/json")
          ? JSON.parse(rawResponse)
          : { message: rawResponse };
        console.error(
          repository
            ? "Failed to update repository"
            : "Failed to create repository",
          errorData
        );
        setErrorMessage(errorData.message || "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Network error. Please try again later.");
    }
  };

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

  const goToHome = () => {
    navigate("/home");
  };
  return (
    <div className="create-update-repository">
      <div className="header-buttons">
        <button onClick={goToMyAccountPage}>My account</button>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={goToHome}>Pepositories</button>
      </div>

      <h1>{repository ? "Update Repository" : "Create Repository"}</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={20}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Topic:
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              minLength={20}
              required
            />
          </label>
        </div>
        <button type="submit">
          {repository ? "Update Repository" : "Create Repository"}
        </button>
      </form>
    </div>
  );
}

export default CreateUpdateRepositoryPage;
