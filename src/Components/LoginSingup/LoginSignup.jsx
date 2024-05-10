import React, { useState } from "react";
import "./LoginSignup.css";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import user_icon from "../Assets/person.png";

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    roleId: 0,
    userFirstName: "",
    userLastName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async () => {
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
      } else {
        const errorMessage = await response.text();
        console.error("Registration failed:", errorMessage);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleLogin = async () => {
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
        // Login successful, you can handle the token or redirect
        const token = await response.text();
        localStorage.setItem("token", token);
      } else {
        const errorMessage = await response.text();
        console.error("Login failed:", errorMessage);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="action-buttons">
          <button
            onClick={() => setAction("Login")}
            className={action === "Login" ? "active" : ""}
          >
            Login
          </button>
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
              <img src={user_icon} alt="" />
              <input
                type="text"
                name="userFirstName"
                placeholder="First Name"
                value={formData.userFirstName}
                onChange={handleChange}
              />
            </div>
            <div className="input">
              <img src={user_icon} alt="" />
              <input
                type="text"
                name="userLastName"
                placeholder="Last Name"
                value={formData.userLastName}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
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
          </div>
        )}
      </div>
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
