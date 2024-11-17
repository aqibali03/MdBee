import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./style.css";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/register/", formData);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          className="register-input"
          name="first_name"
          type="text"
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          className="register-input"
          name="last_name"
          type="text"
          onChange={handleChange}
          placeholder="Last Name"
        />
        <input
          className="register-input"
          name="username"
          type="text"
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          className="register-input"
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          className="register-input"
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
        />
        <button className="register-button" type="submit">
          Register
        </button>
        Already have an account? <a href="/login">Login</a>
      </form>
    </div>
  );
};

export default Register;
