import { useState } from "react";
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { IoIosArrowRoundBack } from "react-icons/io";

const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { data } = await api.post("/api/projects", { name, description });
      setMessage(data.message || "Project created successfully!");
      setTimeout(() => {
        navigate("/dashboard", {replace: true});
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    navigate("/dashboard");
  };

  return (
    <div className="dash-main-container">
      <section>
        <h2>Create a New Project</h2>
        <span className="icon-pointer" onClick={handlePrevPage}>
          <IoIosArrowRoundBack size={40} />
        </span>
      </section>
      {message && (
        <Alert
          className="alert-message-holder"
          severity="success"
          sx={{ marginBottom: 2 }}
        >
          {message}
        </Alert>
      )}
      {error && (
        <Alert
          className="alert-message-holder"
          severity="error"
          sx={{ marginBottom: 2 }}
        >
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            label="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            fullWidth
            multiline
            rows={3}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Project"
            )}
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default CreateProject;
