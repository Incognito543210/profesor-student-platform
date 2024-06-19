import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./AcceptStudentsPage.css";
import { useNavigate } from "react-router-dom";

function AcceptStudentsPage() {
  const [studentList, setStudentList] = useState([]);
  const [acceptedStudentList, setAcceptedStudentList] = useState([]);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  console.log(location);

  useEffect(() => {
    if (!token) {
      return;
    }

    // Fetch students to be accepted
    fetch(
      "https://localhost:7164/API/Repository/accountToConfirm/" +
        location.state.id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setStudentList(data))
      .catch((error) => console.error("Error fetching students:", error));

    // Fetch accepted students
    fetch(
      "https://localhost:7164/API/Repository/acceptedStudentinRepository/" +
        location.state.id,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setAcceptedStudentList(data))
      .catch((error) =>
        console.error("Error fetching accepted students:", error)
      );
  }, [token, location.state.id]);

  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.removeItem("token");
    navigate("/");
  };

  const goToMyAccountPage = () => {
    navigate("/myAccountPage");
  };

  const goToHome = () => {
    navigate("/home");
  };

  const acceptStudent = (userID) => {
    fetch(
      "https://localhost:7164/API/Repository/confirmStudent/" +
        userID +
        "/" +
        location.state.id,
      {
        method: "POST", // or PUT, depending on the API
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Student accepted successfully!");
          // Optionally, refresh the student list or update the UI to reflect the change
          setStudentList(
            studentList.filter((student) => student.userID !== userID)
          );
        } else {
          console.error("Failed to accept student.");
        }
      })
      .catch((error) => console.error("Error accepting student:", error));
  };

  const removeStudent = (userID) => {
    fetch(
      "https://localhost:7164/API/Repository/removeStudentFromRepository/" +
        location.state.id +
        "/" +
        userID,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Student removed successfully!");
          // Update the accepted student list
          setAcceptedStudentList(
            acceptedStudentList.filter((student) => student.userID !== userID)
          );
        } else {
          console.error("Failed to remove student.");
        }
      })
      .catch((error) => console.error("Error removing student:", error));
  };

  return (
    <div className="repository-page">
      <div className="header-buttons">
        <button onClick={goToMyAccountPage}>Moje Konto</button>
        <button onClick={handleLogout}>Wylogowanie</button>
        <button onClick={goToHome}>Repozytoria</button>
      </div>
      <div className="student-lists">
        <div className="student-list">
          <h2>Students to Accept</h2>
          {studentList.length > 0 ? (
            studentList.map((student) => (
              <div key={student.userID} className="student-item">
                <span>
                  Enter Date: {new Date(student.enterDate).toLocaleString()}
                </span>
                <span>User ID: {student.userID}</span>
                <button onClick={() => acceptStudent(student.userID)}>
                  Accept
                </button>
              </div>
            ))
          ) : (
            <p>No students to display.</p>
          )}
        </div>
        <div className="student-list">
          <h2>Accepted Students</h2>
          {acceptedStudentList.length > 0 ? (
            acceptedStudentList.map((student) => (
              <div key={student.userID} className="student-item">
                <span>
                  Enter Date: {new Date(student.enterDate).toLocaleString()}
                </span>
                <span>User ID: {student.userID}</span>
                <button onClick={() => removeStudent(student.userID)}>
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No students to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AcceptStudentsPage;
