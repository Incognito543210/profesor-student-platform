import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CreateAssignmentPage.css";

function CreateAssignmentPage(){
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const location = useLocation();
    const assignment = location.state?.assignment;
    const repository = location.state?.repository;

    const [name, setName] = useState(assignment?.name || "");
    const [endDate, setEndDate] = useState(assignment?.endDate || null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validation checks
        if (name.trim().length === 0) {
          setErrorMessage("Namecannot be empty.");
          return;
        }
        const assignmentData ={
            assignmentID: assignment ? assignment.assignmentID : 0,
            name: name,
            endDate: endDate,
            repositoryID: assignment ? assignment.repositoryID : repository.repositoryID,
        }
        
        try {
            const response = await fetch(
                assignment ?
                "https://localhost:7164/API/Assigment/updateAssigment":
                "https://localhost:7164/API/Assigment/AddAssigment",
                {
                    method: assignment ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify(assignmentData),
                    }
            );

            const rawResponse = await response.text();
      console.log("Raw response:", rawResponse);

      if (response.ok) {
        if (response.headers.get("content-type").includes("application/json")) {
          const data = JSON.parse(rawResponse);
          console.log(
            assignment
              ? "Assignment updated successfully:"
              : "Assignment created successfully:",
            data
          );
          navigate("/assignmentPage", {
            state: { id: data.assignment.ID },
          });
        } else {
          console.log(
            assignment
              ? "Assignment updated successfully"
              : "Assignment created successfully"
          );
          const repositoryID = assignment ? assignment.repositoryID : 0;
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
            ? "Failed to update assignment"
            : "Failed to create assignment",
          errorData
        );
        setErrorMessage(errorData.message || "An unexpected error occurred.");
      }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Network error. Please try again later.");
          }
    }    

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
        <div className="create-assignment">
          <div className="header-buttons">
            <button onClick={goToMyAccountPage}>My account</button>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={goToHome}>Repositories</button>
          </div>
    
          <h1>{assignment ? "Update Assignment" : "Create Assignment"}</h1>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={1}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </label>
            </div>
            <button type="submit">
              {assignment ? "Update Assignment" : "Create Assignment"}
            </button>
          </form>
        </div>
      );
}

export default CreateAssignmentPage;