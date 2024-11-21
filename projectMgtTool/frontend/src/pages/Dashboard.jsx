import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../utils/api";
import "./Index.css";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setDeleteSuccess("Project deleted successfully!");
      setProjects((prev) => prev.filter((project) => project._id !== id));
      setTimeout(() => setDeleteSuccess(""), 3000);
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Failed to delete project."
      );
      setTimeout(() => setDeleteError(""), 3000);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="dash-main-container">
      <h2>Project Dashboard</h2>
      {deleteError && <Alert severity="error">{deleteError}</Alert>}
      {deleteSuccess && <Alert severity="success">{deleteSuccess}</Alert>}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : projects.length === 0 ? (
        <Typography>
          No projects found. Start by adding a new project!
        </Typography>
      ) : (
        // <TableContainer component={Paper}>
        //   <Table>
        //     <TableHead>
        //       <TableRow>
        //         <TableCell>Project Name</TableCell>
        //         <TableCell>Description</TableCell>
        //         <TableCell>Actions</TableCell>
        //       </TableRow>
        //     </TableHead>
        //     <TableBody>
        //       {projects.map((project) => (
        //         <TableRow key={project._id}>
        //           <TableCell><NavLink to={`/projects/${project._id}`}>{project.name}</NavLink></TableCell>
        //           <TableCell>{project.description}</TableCell>
        //           <TableCell>
        //             <Button
        //               variant="contained"
        //               color="primary"
        //               size="small"
        //               onClick={() => navigate(`/edit-project/${project._id}`)}
        //             >
        //               Edit
        //             </Button>
        //             <Button
        //               variant="contained"
        //               color="error"
        //               size="small"
        //               sx={{ ml: 1 }}
        //               onClick={() => handleDelete(project._id)}
        //             >
        //               Delete
        //             </Button>
        //           </TableCell>
        //         </TableRow>
        //       ))}
        //     </TableBody>
        //   </Table>
        // </TableContainer>

        <div className="table-container">
          <div className="table-header">
            <div className="table-row-header">
              <h3 id="table-cell">Project Name</h3>
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
                  <div className="table-cell" id="table-text-s">
                    {project.description}
                  </div>
                  <div className="table-cell" id="table-cell-btn">
                    <button
                      className="btn btn-edit"
                      onClick={() => navigate(`/edit-project/${project._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </button>
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      )}
      <NavLink to="/create-project">
        <button className="proj-btn">Create project</button>
      </NavLink>
    </div>
  );
};

export default Dashboard;
