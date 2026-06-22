import Project from "../models/Project.js";

/**
 * CREATE PROJECT
 */
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      techStack,
      rolesNeeded,
      status,
      githubRepo,
      liveLink,
    } = req.body;

    const newProject = new Project({
      creator: req.user.id,

      title,
      description,
      techStack,
      rolesNeeded,
      status,
      githubRepo,
      liveLink,

      members: [
        {
          user: req.user.id,
          role: "owner",
        },
      ],
    });

    const savedProject = await newProject.save();

    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * GET ALL PROJECTS
 */
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * GET SINGLE PROJECT
 */
export const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("creator", "name email")
      .populate("members.user", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * REQUEST TO JOIN PROJECT
 */
export const requestToJoinProject = async (
  req,
  res
) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const alreadyMember =
      project.members.some(
        (member) =>
          member.user.toString() === req.user.id
      );

    if (alreadyMember) {
      return res.status(400).json({
        message:
          "You are already a member of this project",
      });
    }

    const alreadyRequested =
      project.joinRequests.includes(
        req.user.id
      );

    if (alreadyRequested) {
      return res.status(400).json({
        message:
          "Join request already sent",
      });
    }

    project.joinRequests.push(req.user.id);

    await project.save();

    res.status(200).json({
      success: true,
      message:
        "Join request sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * DELETE PROJECT
 */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};