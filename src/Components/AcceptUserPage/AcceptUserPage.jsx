import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./AcceptUserPage.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

function AcceptUserPage() {
  const [userList, setUserList] = useState([]);
  const [acceptedUserList, setAcceptedUserList] = useState([]);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal

  useEffect(() => {
    if (!token) {
      return;
    }

    // Fetch users to be accepted
    fetch(
      "https://localhost:7164/API/Account/accountToConfirm", // Assuming this endpoint exists for admin to accept users
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setUserList(data))
      .catch((error) => console.error("Error fetching users:", error));

    // Fetch accepted users
    fetch(
      "https://localhost:7164/API/Account/ConfirmedAccount", // Endpoint for accepted users by admin
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setAcceptedUserList(data))
      .catch((error) => console.error("Error fetching accepted users:", error));
  }, [token]);

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage items
    navigate("/");
  };

  const goToMyAccountPage = () => {
    navigate("/myAccountPage");
  };

  const goToHome = () => {
    navigate("/home");
  };

  const acceptUser = (userID) => {
    fetch(
      "https://localhost:7164/API/Account/confirmUSer/" + userID, // Endpoint for admin to accept a user
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("User accepted successfully!");
          setUserList(userList.filter((user) => user.userID !== userID));
        } else {
          console.error("Failed to accept user.");
          setErrorMessage("Failed to accept user.");
          setModalIsOpen(true); // Open modal on error
        }
      })
      .catch((error) => {
        console.error("Error accepting user:", error);
        setErrorMessage("Error accepting user.");
        setModalIsOpen(true); // Open modal on error
      });
  };

  const removeUser = (userID) => {
    fetch(
      `https://localhost:7164/API/Admin/removeUser/${userID}`, // Endpoint for admin to remove a user
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
          console.log("User removed successfully!");
          setAcceptedUserList(
            acceptedUserList.filter((user) => user.userID !== userID)
          );
        } else {
          console.error("Failed to remove user.");
          setErrorMessage("Failed to remove user.");
          setModalIsOpen(true); // Open modal on error
        }
      })
      .catch((error) => {
        console.error("Error removing user:", error);
        setErrorMessage("Error removing user.");
        setModalIsOpen(true); // Open modal on error
      });
  };

  return (
    <div className="admin-page">
      <div className="header-buttons">
        <button onClick={goToMyAccountPage}>Moje Konto</button>
        <button onClick={handleLogout}>Wylogowanie</button>
        <button onClick={goToHome}>Repozytoria</button>
      </div>
      <div className="user-lists">
        <div className="user-list">
          <h2>Users to Accept</h2>
          {userList.length > 0 ? (
            userList.map((user) => (
              <div key={user.userID} className="user-item">
                <span>{user.userFirstName}</span>
                <span>{user.userLastName}</span>
                <span>{user.email}</span>
                <button onClick={() => acceptUser(user.userID)}>Accept</button>
              </div>
            ))
          ) : (
            <p>No users to display.</p>
          )}
        </div>
        <div className="user-list">
          <h2>Accepted Users</h2>
          {acceptedUserList.length > 0 ? (
            acceptedUserList.map((user) => (
              <div key={user.userID} className="user-item">
                <span>{user.userFirstName}</span>
                <span>{user.userLastName}</span>
                <span>{user.email}</span>
                <button onClick={() => removeUser(user.userID)}>Remove</button>
              </div>
            ))
          ) : (
            <p>No users to display.</p>
          )}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Error Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Error</h2>
        <p>{errorMessage}</p>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default AcceptUserPage;
