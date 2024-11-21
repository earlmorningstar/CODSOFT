const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createProject,
  editProject,
  deleteProject,
  getProjects,
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
} = require("../controllers/projectController");

const router = express.Router();

router.route("/").post(protect, createProject).get(protect, getProjects);
router
  .route("/:projectId/tasks")
  .post(protect, createTask)
  .get(protect, getProjectTasks);

router.route("/:id").put(protect, editProject).delete(protect, deleteProject);

router
  .route("/:projectId/tasks/:taskId")
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
