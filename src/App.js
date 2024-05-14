import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginSignup from "./Components/LoginSingup/LoginSignup";
import HomePage from "./Components/HomePage/HomePage";
import RepositoryPage from "./Components/RepositoryPage/RepositoryPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/repositoryPage" element={<RepositoryPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
