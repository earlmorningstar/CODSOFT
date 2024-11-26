const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const mongoose = require("mongoose");

const createProject = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Project name and description are required" });
  }
  try {
    const project = await Project.create({
      name,
      description,
      user: req.user._id,
    });
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating project", error: error.message });
  }
};

const editProject = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const project = await Project.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { name, description },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    res.status(200).json({ message: "Project updated successfully!", project });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating project", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findOneAndDelete({
      _id: id,
      user: req.user._id, //Making sure it belongs to the user
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleteing project", error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).populate(
      "tasks"
    );

    if (projects.length === 0) {
      return res
        .status(200)
        .json({ message: "No project found for this user", projects: [] });
    }
    res
      .status(200)
      .json({ message: "Projects fetched successfully", projects });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching projects", error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, deadline, status } = req.body;
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const validStatuses = ["Pending", "In Progress", "Completed"];
    const sanitizedStatuus = status.trim().replace(/\.$/, "");

    if (!validStatuses.includes(sanitizedStatuus)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.create({
      title,
      description,
      deadline,
      status,
      project: projectId,
    });

    project.tasks.push(task._id);
    await project.save();

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error creating task: All fields are required",
        error: error.message,
      });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid Project" });
    }

    const project = await Project.findById(projectId).populate("tasks");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res
      .status(200)
      .json({ message: "Project created successfully.", tasks: project.tasks });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, deadline, status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        deadline,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(400).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};

module.exports = {
  createProject,
  editProject,
  deleteProject,
  getProjects,
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
};
