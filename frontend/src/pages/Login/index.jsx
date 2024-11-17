import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./style.css";

const Login = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = userData;
    try {
      const response = await api.post("/login/", { username, password });
      localStorage.setItem("access_token", response.data.token);
      navigate("/");
    } catch (error) {
      setError("Login failed. Please check your username and password.");
      console.error("Login failed:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="login-input"
          name="username"
          value={userData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="login-input"
          value={userData.password}
          onChange={handleChange}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">
          Login
        </button>
        <p>
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
