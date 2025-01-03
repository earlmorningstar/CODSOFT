import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../utils/api";
import LogoutModal from "./LogoutModal";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Modal,
  Button,
} from "@mui/material";
import { CgProfile } from "react-icons/cg";
import "./Index.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "1px solid #fff",
  boxShadow: 24,
  p: 2,
};

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/api/projects");
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        resolve();
      }, 1000);
    });
  };

  const handleOpenDeleteModal = (projectId) => {
    setProjectToDelete(projectId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setProjectToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await api.delete(`/api/projects/${projectToDelete}`);
      setDeleteSuccess("Project deleted successfully!");
      setProjects((prev) =>
        prev.filter((project) => project._id !== projectToDelete)
      );
      handleCloseDeleteModal();
      setTimeout(() => setDeleteSuccess(""), 3000);
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Failed to delete project."
      );
      setTimeout(() => setDeleteError(""), 3000);
    }
  };

  const handlePopState = () => {
    setLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    setLogoutModalOpen(false);
    window.history.pushState(null, "", window.location.pathname);
  };

  useEffect(() => {
    fetchProjects();

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="dash-main-container">
      <section>
        <h2>Project Dashboard</h2>
        <div className="profile-logoutBtn-flex">
          <span onClick={() => navigate("/profile")} className="icon-pointer">
            <CgProfile size={28} />
          </span>
          <span>
            <LogoutModal onLogout={handleLogout} />
          </span>
        </div>
      </section>
      {projects.length > 0 && <h4>Click on project to assign a task to it</h4>}
      {deleteError && (
        <Alert className="alert-message-holder" severity="error">
          {deleteError}
        </Alert>
      )}
      {deleteSuccess && (
        <Alert className="alert-message-holder" severity="success">
          {deleteSuccess}
        </Alert>
      )}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert className="alert-message-holder" severity="error">
          {error}
        </Alert>
      ) : projects.length === 0 ? (
        <Typography>
          No projects found. Start by adding a new project!
        </Typography>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <div className="table-row-header">
              <h3 id="table-cell">Name</h3>
              <h3 id="table-cell">Description</h3>
              <h3 id="table-cell">Actions</h3>
            </div>
          </div>
          <div className="table-body">
            {projects.map((project) => (
              <div className="table-row" key={project._id}>
                <NavLink
                  to={`/projects/${project._id}`}
                  className="project-link"
                >
                  <div className="table-cell" id="table-text-s">
                    {project.name}
                  </div>
                </NavLink>
                <NavLink
                  to={`/projects/${project._id}`}
                  className="project-link"
                >
                  <div className="table-cell" id="table-text-s">
                    {project.description}
                  </div>
                </NavLink>

                <div className="table-cell" id="table-cell-btn">
                  <button
                    className="btn btn-edit"
                    onClick={() => navigate(`/edit-project/${project._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleOpenDeleteModal(project._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <NavLink id="proj-btn-id" to="/create-project">
        <button className="proj-btn">Create Project</button>
      </NavLink>
      <Modal
        open={logoutModalOpen}
        onClose={handleCloseLogoutModal}
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
      >
        <Box sx={style}>
          <Typography id="logout-modal-title" variant="h6" component="h2">
            Logout Confirmation
          </Typography>
          <Typography id="logout-modal-description" sx={{ mt: 2 }}>
            Do you want to log out?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              onClick={handleCloseLogoutModal}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button onClick={handleLogout} variant="contained" color="error">
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={style}>
          <Typography id="delete-modal-title" variant="h6" component="h2">
            Are you sure you want to permanently delete this project?
          </Typography>
          <Typography id="delete-modal-description" sx={{ mt: 2 }}>
            Projects cannot be recovered after this action.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              onClick={handleCloseDeleteModal}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDeleteProject}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Dashboard;
