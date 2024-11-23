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

  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const { data } = await api.get("/users/profile");
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
    try {
      await api.put("/users/profile", {
        name,
        email,
        password,
      });
      setSuccess("Profile updated successfully!");
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
          helperText="Leave 'New Password' blank to keep your current password"
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
