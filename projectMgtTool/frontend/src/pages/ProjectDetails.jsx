import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Modal,
} from "@mui/material";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

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

const ProjectDetails = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/api/projects/${projectId}/tasks`);
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleOpenDialog = (task = null) => {
    if (task) {
      setCurrentTask(task);
      setTaskName(task.title);
      setTaskDescription(task.description);
      setTaskDeadline(task.deadline.slice(0, 10));
      setTaskStatus(task.status);
    } else {
      setCurrentTask(null);
      setTaskName("");
      setTaskDescription("");
      setTaskDeadline("");
      setTaskStatus("Pending");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleOpenDeleteModal = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setTaskToDelete(null);
    setDeleteModalOpen(false);
  };

  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setTaskDeadline("");
    setTaskStatus("Pending");
    setCurrentTask(null);
  };

  const handleCreateTask = async () => {
    try {
      setLoading(true);
      await api.post(`/api/projects/${projectId}/tasks`, {
        title: taskName,
        description: taskDescription,
        deadline: taskDeadline,
        status: taskStatus.trim(),
      });
      setSuccess("Task created successfully.");
      fetchTasks();
      handleCloseDialog();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create task. Try again."
      );
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
    }
  };

  const handleUpdateTask = async () => {
    try {
      setLoading(true);
      await api.put(`/api/projects/${projectId}/tasks/${currentTask._id}`, {
        title: taskName,
        description: taskDescription,
        deadline: taskDeadline,
        status: taskStatus.trim(),
      });
      setSuccess("Task updated successfully");
      fetchTasks();
      handleCloseDialog();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update task. Try again."
      );
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
    }
  };

  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setLoading(true);
      await api.delete(`/api/projects/${projectId}/tasks/${taskToDelete}`);
      setSuccess("Task deleted successfully.");
      fetchTasks();
      handleCloseDeleteModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
    }
  };

  const handlePrevPage = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="dash-main-container">
      <section>
        <h2>Project Details</h2>
        <span className="icon-pointer" onClick={handlePrevPage}>
          <IoIosArrowRoundBack size={40} />
        </span>
      </section>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {success && (
            <Alert className="alert-message-holder" severity="success">
              {success}
            </Alert>
          )}
          {error && (
            <Alert className="alert-message-holder" severity="error">
              {error}
            </Alert>
          )}
          {tasks.length === 0 ? (
            <Typography>No tasks found. Start by adding a new task!</Typography>
          ) : (
            <div className="table-container">
              <div className="table-header">
                <div className="table-row-header" id="table-row-header-id">
                  <h3 id="table-cell">Title</h3>
                  <h3 id="table-cell">Description</h3>
                  <h3 id="table-cell">Deadline</h3>
                  <h3 id="table-cell">Status</h3>
                  <h3 id="table-cell">Actions</h3>
                </div>
              </div>
              <div className="table-body">
                {tasks.map((task) => (
                  <div className="table-row" id="table-row-id" key={task._id}>
                    <div className="table-cell" id="table-text-s">
                      {task.title}
                    </div>
                    <div className="table-cell" id="table-text-s">
                      {task.description}
                    </div>
                    <div className="table-cell" id="table-text-s">
                      {task.deadline.slice(0, 10)}
                    </div>
                    <div className="table-cell" id="table-text-s">
                      {task.status}
                    </div>
                    <div className="table-cell" id="table-cell-btn">
                      <button
                        className="btn btn-edit"
                        onClick={() => handleOpenDialog(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleOpenDeleteModal(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      <div>
        <button className="proj-btn" onClick={() => handleOpenDialog()}>
          Add Task
        </button>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentTask ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            variant="standard"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Task Description"
            fullWidth
            variant="standard"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            fullWidth
            variant="standard"
            type="date"
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
          />
          <FormControl required sx={{ m: 1, Width: "100%" }}>
            <InputLabel id="task-status-label">Status</InputLabel>
            <Select
              labelId="task-status-label"
              id="task-status-select"
              value={taskStatus}
              label="Status"
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={currentTask ? handleUpdateTask : handleCreateTask}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={style}>
          <Typography id="delete-modal-title" variant="h6" component="h2">
            Are you sure you want to permanently delete this task?
          </Typography>
          <Typography id="delete-modal-description" sx={{ mt: 2 }}>
            Tasks cannot be recovered after this action.
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
              onClick={handleConfirmDeleteTask}
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

export default ProjectDetails;
