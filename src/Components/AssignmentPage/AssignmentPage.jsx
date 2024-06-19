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
  const assignmentID = location.state.id;
  console.log(location);
  const navigate = useNavigate();
  const dBtn = document.getElementById("downloadBtn");

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

  useEffect(() => {
    if (!token) {
      console.error("Token not found in local storage");
      return;
    }

    if (roleID == "3") {
      fetch(
        "https://localhost:7164/API/File/FilesNames/" +
          assignmentID +
          "/" +
          userID,
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
    } else {
      fetch("https://localhost:7164/API/File/FilesNames/" + assignmentID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setFiles(data))
        .catch((error) => console.error("Error fetching data:", error));
      console.log(files);
    }
  }, [token, assignmentID, userID]);

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

  const handleUpload = () => {
    const fileList = document.getElementById("pliczki").files;
    const formData = new FormData();
    formData.append("UserID", userID);
    formData.append("AssigmentID", assignmentID);
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i]);
    }

    try {
      const response = fetch("https://localhost:7164/API/File/upload/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Error during file upload:", error);
    }
    window.location.reload();
  };

  function handleDownload(fileName) {
    fetch(
      "https://localhost:7164/API/File/DownloadFile/" +
        assignmentID +
        "/" +
        userID +
        "/" +
        fileName,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          console.error(
            "Something went wrong with the file downloading. Check backend"
          );
        }
        return res.blob();
      })
      .then((file) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = fileName;
        link.click();
      });
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
          <br />
          <br />
          <button onClick={handleUpload}>Upload</button>
          <p>Lista plików:</p>
          <ul>
            {files.map((file) => (
              <li
                key={file.fileName}
                onClick={() => handleDownload(file.fileName)}
              >
                <a>{file.fileName}</a>
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

export default AssignmentPage;
