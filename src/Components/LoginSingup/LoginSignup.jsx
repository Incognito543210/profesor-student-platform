import React, { useState } from "react";
import "./LoginSignup.css";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import user_icon from "../Assets/person.png";
import eye_icon from "../Assets/eye_icon.png";
import { Navigate } from "react-router-dom";
import { validateForm } from "./validation";

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [role, setRole] = useState("");
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    currentPassword: "",
    roleId: 0,
    userFirstName: "",
    userLastName: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [errors, setErrors] = useState({});
  const [goToHome, setGoToHome] = React.useState(false);

  const goHome = () => {
    if (isApproved) {
      return <Navigate to="/home" />;
    } else {
      return <Navigate to="/waitingpage" />;
    }
  };

  if (goToHome) {
    return goHome();
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async () => {
    const formErrors = validateForm(formData, action, role);
    if (Object.keys(formErrors).length !== 0) {
      setErrors(formErrors);
      return;
    }
    try {
      if (role == "teacher") {
        formData.roleId = 2;
      } else if (role == "student") {
        formData.roleId = 3;
      }
      const response = await fetch(
        `https://localhost:7164/API/Account/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        // Registration successful, you can redirect or show a success message
        console.log("Registration successful");
        setAction("Login");
      } else {
        const errorMessage = await response.text();
        setApiError(errorMessage);
        console.error("Registration failed:", errorMessage);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleLogin = async () => {
    const formErrors = validateForm(formData, action, role);
    if (Object.keys(formErrors).length !== 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const response = await fetch(`https://localhost:7164/API/Account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      if (response.ok) {
        // Login successful, check approval status
        const token = await response.text();
        localStorage.setItem("token", token);

        // Check if user is approved
        const approvalResponse = await fetch(
          `https://localhost:7164/API/Account/isApproved`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Assuming token is required for approval check
            },
          }
        );

        if (approvalResponse.ok) {
          const isApproved = await approvalResponse.json();
          setIsApproved(isApproved);

          // Redirect based on approval status
          setGoToHome(true);
        } else {
          const errorMessage = await approvalResponse.text();
          console.error("Error checking approval status:", errorMessage);
          setApiError(errorMessage);
        }
      } else {
        const errorMessage = await response.text();
        console.error("Login failed:", errorMessage);
        setApiError(errorMessage);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="action-button">
          <button
            onClick={() => setAction("Login")}
            className={action === "Login" ? "active" : ""}
          >
            Login
          </button>
        </div>
        <div className="action-button">
          <button
            onClick={() => setAction("Sign Up")}
            className={action === "Sign Up" ? "active" : ""}
          >
            Sign Up
          </button>
        </div>
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Login" ? null : (
          <>
            <div className="input">
              <img src={user_icon} alt="user icon" />
              <input
                type="text"
                name="userFirstName"
                placeholder="First Name"
                value={formData.userFirstName}
                onChange={handleChange}
              />
              {errors.userFirstName && (
                <span className="error">{errors.userFirstName}</span>
              )}
            </div>
            <div className="input">
              <img src={user_icon} alt="user icon" />
              <input
                type="text"
                name="userLastName"
                placeholder="Last Name"
                value={formData.userLastName}
                onChange={handleChange}
              />
              {errors.userLastName && (
                <span className="error">{errors.userLastName}</span>
              )}
            </div>
          </>
        )}
        <div className="input">
          <img src={email_icon} alt="email icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="input">
          <img src={password_icon} alt="password icon" />
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <img
            src={eye_icon}
            alt="Toggle Password Visibility"
            onClick={togglePasswordVisibility}
            className="toggle-visibility"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {action === "Login" ? null : (
          <>
            <div className="input">
              <img src={password_icon} alt="password icon" />
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
          </>
        )}

        {action === "Login" ? null : (
          <div className="role-selection">
            <div>
              <input
                type="radio"
                id="teacher"
                name="roleId"
                value="2" // Assuming teacher role ID is 2
                checked={role === "teacher"}
                onChange={() => setRole("teacher")}
              />
              <label htmlFor="teacher">Teacher</label>
            </div>
            <div>
              <input
                type="radio"
                id="student"
                name="roleId"
                value="3" // Assuming student role ID is 3
                checked={role === "student"}
                onChange={() => setRole("student")}
              />
              <label htmlFor="student">Student</label>
            </div>
            {errors.role && <span className="error">{errors.role}</span>}
          </div>
        )}
      </div>
      {apiError && <div className="api-error">{apiError}</div>}
      <div className="submit-container">
        {action === "Login" ? (
          <button onClick={handleLogin} className="submit">
            Login
          </button>
        ) : (
          <button onClick={handleSignUp} className="submit">
            Sign Up
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
