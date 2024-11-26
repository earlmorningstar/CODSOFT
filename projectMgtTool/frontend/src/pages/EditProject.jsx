import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { IoIosArrowRoundBack } from "react-icons/io";

const EditProject = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.put(`/api/projects/${id}`);
        setName(data.name);
        setDescription(data.description);
      } catch (err) {
        setError("Failed to fetch project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const { data } = await api.put(`/api/projects/${id}`, { name, description });
      setMessage(data.message || "Project updated successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handlePrevPage = () => {
    navigate("/dashboard");
  };

  return (
    <div className="dash-main-container">
      <section>
        <h2>Edit Project</h2>
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
            disabled={saving}
          >
            {saving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default EditProject;
