import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function RepositoryPage() {
  const [repository, setRepository] = useState(null);
  const token = localStorage.getItem("token");
  const location = useLocation();
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

  return (
    <div>
      {repository ? (
        <div>
          <h1>{repository.name}</h1>
          <h2>{repository.topic}</h2>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default RepositoryPage;
