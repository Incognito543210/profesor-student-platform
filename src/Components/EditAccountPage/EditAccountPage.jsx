import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EditAccountPage.css";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import user_icon from "../Assets/person.png";
import eye_icon from "../Assets/eye_icon.png";
import { validateForm } from "./validation"; // Assuming you have a validation.js file

function EditAccountPage() {
  const [formData, setFormData] = useState({
    userID: "",
    email: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
    roleId: 0,
    userFirstName: "",
    userLastName: "",
  });
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.userData) {
      const { email, roleId, userFirstName, userLastName } =
        location.state.userData;
      setFormData((prevFormData) => ({
        ...prevFormData,
        email,
        roleId,
        userFirstName,
        userLastName,
      }));
    }
  }, [location.state]);

  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.removeItem("token");
    localStorage.setItem("role", "");
    localStorage.removeItem("role");
    localStorage.setItem("user", "");
    localStorage.removeItem("user");
    navigate("/");
  };

  const goToHome = () => {
    navigate("/home");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm(formData, "Edit", "");
    if (Object.keys(formErrors).length !== 0) {
      setErrors(formErrors);
      return;
    }

    formData.userID = localStorage.getItem("user");
    formData.roleIde = localStorage.getItem("role");
    try {
      const response = await fetch(
        "https://localhost:7164/API/Account/updateUser",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        navigate("/myAccountPage");
      } else {
        const errorMessage = await response.text();
        setApiError(errorMessage);
        console.error("Failed to update account:", errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const goToMyAccountPage = () => {
    navigate("/myAccountPage");
  };

  return (
    <div className="repository-page">
      <div className="header-buttons">
        <button onClick={goToHome}>Repositories</button>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={goToMyAccountPage}>My account</button>
      </div>
      <h1>Edit account</h1>
      <form onSubmit={handleFormSubmit} className="edit-account-form">
        <div className="input">
          <img src={email_icon} alt="" />
          <p>Email: </p>
          <input type="email" name="email" value={formData.email} readOnly />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <p>Current password: </p>
          <input
            type={currentPasswordVisible ? "text" : "password"}
            name="currentPassword"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleInputChange}
          />
          <img
            src={eye_icon}
            alt="Toggle Password Visibility"
            onClick={toggleCurrentPasswordVisibility}
            className="toggle-visibility"
          />
          {errors.currentPassword && (
            <span className="error">{errors.currentPassword}</span>
          )}
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <p>New password: </p>
          <input
            type={newPasswordVisible ? "text" : "password"}
            name="password"
            value={formData.password || ""}
            onChange={handleInputChange}
          />
          <img
            src={eye_icon}
            alt="Toggle Password Visibility"
            onClick={toggleNewPasswordVisibility}
            className="toggle-visibility"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <p>Confirm new passowrd: </p>
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword || ""}
            onChange={handleInputChange}
          />
          <img
            src={eye_icon}
            alt="Toggle Confirm Password Visibility"
            onClick={toggleConfirmPasswordVisibility}
            className="toggle-visibility"
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>
        <div className="input">
          <img src={user_icon} alt="" />
          <p>First name: </p>
          <input
            type="text"
            name="userFirstName"
            placeholder="First Name"
            value={formData.userFirstName}
            onChange={handleInputChange}
          />
          {errors.userFirstName && (
            <span className="error">{errors.userFirstName}</span>
          )}
        </div>
        <div className="input">
          <img src={user_icon} alt="" />
          <p>Last name:</p>
          <input
            type="text"
            name="userLastName"
            value={formData.userLastName}
            onChange={handleInputChange}
          />
          {errors.userLastName && (
            <span className="error">{errors.userLastName}</span>
          )}
        </div>
        <button type="submit" className="submit">
          Save Changes
        </button>
      </form>
      {apiError && <div className="api-error">{apiError}</div>}
    </div>
  );
}

export default EditAccountPage;
