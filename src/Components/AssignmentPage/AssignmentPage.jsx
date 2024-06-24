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
  const createdById = localStorage.getItem("createdById")
  const isStudent = roleID === '3';
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [mark, setMark] = useState("");
  const [comment, setComment] = useState("");
  const location = useLocation();
  const assignmentID = location.state.id;
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

  useEffect(() => {
    if (!token) {
      console.error("Token not found in local storage");
      return;
    }

    if (isStudent) {
       const tmp = fetch(
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
      const tmp = fetch(
        "https://localhost:7164/API/File/FilesNames/" +
          assignmentID,
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
    }
  }, [token, assignmentID, userID]);

  useEffect(() => {
    if (!token) {
      console.error("Token not found in local storage");
      return;
    }
    if (!isStudent) {
      fetch(
        "https://localhost:7164/API/Assigment/getUserAssignments/" +
          assignmentID,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching data:", error));
      console.log(users);
    } else {
      fetch(
        "https://localhost:7164/API/Assigment/getUserAssignment/" +
          assignmentID + '/' +
          userID,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => console.error("Error fetching data:", error));
      console.log(users);
    }
  }, [token, assignmentID]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const goToMyAccountPage = () => {
    navigate("/myAccountPage");
  };

  const updateAssigment = () => {
    navigate("/createAssignmentPage", {state: {assignment}})
  }

  const handleUpload = () => {
    const fileList = document.getElementById("pliczki").files;
    const formData = new FormData();
    formData.append("UserID", userID);
    formData.append("AssigmentID", assignmentID);
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i]);
    }

    try {
      fetch("https://localhost:7164/API/File/upload/", {
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
        files.userID +
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

  function handleCommentAndMark(userID) {
    const userMarkAndComment = {
      assigmnentID: assignmentID,
      userID: userID,
      mark: mark,
      comment: comment,
    };
    const response = fetch(
      "https://localhost:7164/API/Assigment/CommentAndMark",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userMarkAndComment),
      }
    );
    if (response.ok) {
      const data = response.json();
      console.log("Successfully commented and marked: ", data);
    }
    window.location.reload();
  }

  const removeFile = (file) =>{
    if (!token) {
      return;
    }

    
  fetch("https://localhost:7164/API/File/RemoveFile", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(file),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      window.location.reload();
    })
    .catch((error) => console.error("Error fetching assignments:", error));

    window.location.reload();
  }

  return (
    <div className="repository-page">
      <div className="header-buttons">
        <button hidden = {createdById != userID} onClick={updateAssigment}>Update Assignment</button>
        <button onClick={goToMyAccountPage}>My account</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {assignment ? (
        <div>
          <h1>{assignment.name}</h1>
          <h2>{assignment.topic}</h2>
          <input type="file" id="pliczki" multiple hidden = {!isStudent}/>
          <br />
          <br />
          <button onClick={handleUpload}hidden = {!isStudent}>Upload</button>
          <div hidden = {!isStudent}>
            <p/>
                <label>Ocena: {user.mark}</label>
                  <p/>
                  <label>Komentarz: {user.comment}</label>
                  <p>Lista plików:</p>
                  <ul>
                  {files.map((file) => (
                    <li
                    key={file.fileName}
                    >
                        <a>{file.fileName}</a>
                        <button onClick={() => handleDownload(file.fileName)}>Download File</button>
                        <p/>
                        <button onClick={() => removeFile(file)}>Remove File</button>
                      </li>
                    ))}
                  </ul>
          </div>
          <div hidden = {isStudent}>
            <p>List of students:</p>
            <ul>
              {users.map((user) => (
                user.userID != createdById &&
                user.roleID !== '2' &&
                (
                <li key={user.userID}>
                  <label>Student: {user.userFirstName} {user.userLastName}</label>
                  <p />
                  <label hidden = {roleID === '1'}>
                    Rating: {user.mark}
                    <select
                      type="number"
                      min="2"
                      max="5"
                      step="0.5"
                      content={user.mark}
                      value={mark}
                      onChange={(e) => setMark(e.target.value)}
                    >
                      <option>2</option>
                      <option>3</option>
                      <option>3.5</option>
                      <option>4</option>
                      <option>4.5</option>
                      <option>5</option>
                    </select>
                  </label>
                  <p/>
                  <label hidden = {roleID === '1'}>
                    Comment: {user.comment}
                    <p />
                    <input
                      type="text"
                      content={user.comment}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </label>
                  <button
                    type="submit"
                    onClick={() => handleCommentAndMark(user.userID)}
                    hidden = {roleID === '1'}
                  >
                    Save Mark And Comment
                  </button>
                  <p>File list:</p>
                  <ul>
                    {files.map((file) => (
                     file.userID == user.userID && ( 
                      <li
                        key={file.fileName}
                      >
                        <a>{file.fileName}</a>
                        <button onClick={() => handleDownload(file.fileName)}>Download File</button>
                        <p/>
                        <button onClick={() => removeFile(file)}>Remove File</button>
                      </li>
                    )
                    ))}
                  </ul>
                </li>
                )
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AssignmentPage;
