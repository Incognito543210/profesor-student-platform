import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from "../../Context/AuthContext";

function HomePage() {
  const [repositories, setRepositories] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.error('Token not found in local storage');
      return;
    }

    fetch('https://localhost:7164/API/Repository/allRepository', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setRepositories(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [token]);


  return (
    <div>
      <h1>Lista repozytoriów</h1>
      <ul>
        {repositories.map(repo => (
          <li key={repo.id}>
            <h2>{repo.topic}</h2>
            <p>{repo.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
