import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Alert, CircularProgress } from "@mui/material";
import api from "../utils/api";
import { IoIosArrowRoundBack } from "react-icons/io";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    if (password) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        return false;
      }
      const uppercaseRegex = /[A-Z]/;
      if (!uppercaseRegex.test(password)) {
        setError("Password must contain at least one uppercase letter");
        return false;
      }
      if (password === "Password") {
        setError("Password cannot be 'Password'");
        return false;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    return true;
  };

  const fetchUserProfile = async () => {
    try {
      const { data } = await api.get("/api/users/profile");
      setName(data.name);
      setEmail(data.email);
      setCreatedAt(data.createdAt);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user profile");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await api.put("/api/users/profile", {
        name,
        email,
        password,
      });
      setSuccess("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upddate profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="dash-main-container">
      <section>
        <h2>Profile</h2>
        <span onClick={navigateToDashboard} className="icon-pointer">
          <IoIosArrowRoundBack size={30} />
        </span>
      </section>

      <div className="profile-flex">
        <span>
          Full Name: <h4>{name}</h4>
        </span>
        <span>
          Email Address: <h4>{email}</h4>{" "}
        </span>
        <span>
          Account Created: <h4>{new Date(createdAt).toLocaleDateString()}</h4>{" "}
        </span>
        <span>
          Status:
          <h4>Active</h4>
        </span>
      </div>

      <section>
        <h2>Update Profile</h2>
      </section>
      {error && (
        <Alert className="alert-message-holder" severity="error">
          {error}
        </Alert>
      )}
      {success && (
        <Alert className="alert-message-holder" severity="success">
          {success}
        </Alert>
      )}
      <form onSubmit={handleUpdate}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          helperText="Leave this input blank to keep your current password"
        />
        <TextField
          fullWidth
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          helperText="Leave this input blank to keep your current password"
        />
        <button disabled={loading} type="submit" className="proj-btn">
          {loading ? (
            <CircularProgress className="btn-progress" size={24} />
          ) : (
            "Update Profile"
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
