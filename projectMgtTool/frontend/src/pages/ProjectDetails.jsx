import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
} from "@mui/material";
import api from "../utils/api";

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

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/projects/${projectId}/tasks`);
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
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
      await api.post(`/projects/${projectId}/tasks`, {
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
      await api.put(`/projects/${projectId}/tasks/${currentTask._id}`, {
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

  const handleDeleteTask = async (taskId) => {
    try {
      setLoading(true);
      await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      setSuccess("Task deleted successfully.");
      fetchTasks();
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

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Project Details
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            sx={{ mb: 2 }}
          >
            Add Task
          </Button>
          {tasks.length === 0 ? (
            <Typography>No tasks found. Start by adding a new task!</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleOpenDialog(task)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

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
            // label="Deadline"
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
              <MenuItem value="In progress">In Progress</MenuItem>
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
    </Box>
  );
};

export default ProjectDetails;
