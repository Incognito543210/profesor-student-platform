import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateUpdateRepositoryPage.css";

function CreateUpdateRepositoryPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [createdById, setCreatedById] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const repositoryData = {
      repositoryID: 0,
      name: name,
      topic: topic,
      createdById: 0,
    };

    try {
      const response = await fetch(
        "https://localhost:7164/API/Repository/createRepository",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(repositoryData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Repository created successfully:", data);
        navigate("/repositories"); // Redirect to the repositories list page or another page
      } else {
        console.error("Failed to create repository");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="create-update-repository">
      <h1>Create Repository</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              required
            />
          </label>
        </div>
        <button type="submit">Create Repository</button>
      </form>
    </div>
  );
}

export default CreateUpdateRepositoryPage;
