import Task from "../models/Task.js";
import Project from "../models/project.js";

/**
 * CREATE TASK
 */
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      assignedTo,
      priority,
      deadline,
    } = req.body;

    const project = await Project.findById(
      projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const member = project.members.find(
      (member) =>
        member.user.toString() ===
        req.user._id.toString()
    );

    if (
      !member ||
      !["owner", "admin"].includes(member.role)
    ) {
      return res.status(403).json({
        message:
          "Only owner or admin can create tasks",
      });
    }

    if (assignedTo) {
      const assignedMember =
        project.members.find(
          (member) =>
            member.user.toString() ===
            assignedTo
        );

      if (!assignedMember) {
        return res.status(400).json({
          message:
            "Assigned user must be a project member",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      createdBy: req.user._id,
      priority,
      deadline,
    });

    const populatedTask =
      await Task.findById(task._id)
        .populate(
          "assignedTo",
          "name email"
        )
        .populate(
          "createdBy",
          "name email"
        );

    return res.status(201).json({
      success: true,
      task: populatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET PROJECT TASKS
 */
export const getProjectTasks = async (
  req,
  res
) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(
      projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const tasks = await Task.find({
      project: projectId,
    })
      .populate(
        "assignedTo",
        "name email"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};