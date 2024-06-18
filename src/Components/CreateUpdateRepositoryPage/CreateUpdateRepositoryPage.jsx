import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./CreateUpdateRepositoryPage.css";
import { useNavigate } from "react-router-dom";

function CreateUpdateRepositoryPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  return (
    <div>
      <h1>test</h1>
    </div>
  );
}

export default CreateUpdateRepositoryPage;
