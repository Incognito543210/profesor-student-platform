import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./AssignmentPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AssignmentPage() {
  const [assignment, setAssignment] = useState(null);
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("user");
  const location = useLocation();
  const assignmentID = location.state.id
  console.log(location);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.error("Token not found in local storage");
      return;
    }

    fetch(
      "https://localhost:7164/API/Assigment/assigmnentByID/" +
        location.state.id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setAssignment(data))
      .catch((error) => console.error("Error fetching data:", error));
    console.log(assignment);
  }, [token, location.state.id]);

  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.removeItem("token");
    navigate("/");
  };

  const goToMyAccountPage = () => {
    navigate("/myAccountPage");
  };

  const handleUpload = () => {
    const fileList = document.getElementById("pliczki").files;
    const formData = new FormData();
    formData.append('UserID', userID);
    formData.append('AssigmentID', assignmentID);
    // formData.append("files", fileList[0]);
    // formData.append("files", fileList[1]);
    for(let i = 0; i < fileList.length; i++){
      formData.append("files", fileList[i]);
    }

    try{
    const response = fetch('https://localhost:7164/API/File/upload/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: formData
    });
    }catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  async function uploadFile(e){
    const formData = new FormData(e.target)
    const response = await fetch('https://localhost:7164/API/File/upload/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: formData
    });

    const data = await response.json();

    console.log(data)
  }

  return (
    <div className="repository-page">
      <div className="header-buttons">
        <button onClick={goToMyAccountPage}>Moje Konto</button>
        <button onClick={handleLogout}>Wylogowanie</button>
      </div>
      {assignment ? (
        <div>
          <h1>{assignment.name}</h1>
          <h2>{assignment.topic}</h2>

          <input type="file" id="pliczki" multiple />
          <br /><br />
          <button onClick={handleUpload}>Upload</button>
          {/* <form id="uploadF" enctype="multipart/form-data" onSubmit={upFile}>
            <label htmlFor="files">Wybierz plik(i)</label>
            <br /><br />
            <input type="file" id="files" multiple required name="files" />

            <br /><br />
            <input type="submit" value="Upload" className="btn"/>
          </form> */}

        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AssignmentPage;
