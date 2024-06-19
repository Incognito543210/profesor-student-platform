import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./AssignmentPage.css";
import { useNavigate } from "react-router-dom";

function AssignmentPage() {
  const [assignment, setAssignment] = useState(null);
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("user");
  const roleID = localStorage.getItem("role");
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

  useEffect(() =>{
    if (!token) {
      console.error("Token not found in local storage");
      return;
    }

    if(roleID == '3')
      {
    fetch(
      "https://localhost:7164/API/File/FilesNames/" +
        assignmentID + "/" + userID,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setFiles(data))
      .catch((error) => console.error("Error fetching data:", error));
    console.log(files);
  }else
  {
    fetch(
      "https://localhost:7164/API/File/FilesNames/" + assignmentID,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
      .then((response) => response.json())
      .then((data) => setFiles(data))
      .catch((error) => console.error("Error fetching data:", error));
    console.log(files);
  }
  }, [token, assignmentID, userID]);

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
    }
  );
    }catch (error) {
      console.error("Error during file upload:", error);
    }
    window.location.reload();
  };

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

          <ul>
            {files.map((file) =>(
              <li>
                <p>Name: {file.fileName}</p>
              </li>
            ))
            }
          </ul>

        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AssignmentPage;
