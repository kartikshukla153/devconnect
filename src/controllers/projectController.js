import Project from "../models/Project.js";
import Notification from "../models/Notification.js";

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

    const userId = req.user.id;

    if (
      project.creator.toString() === userId
    ) {
      return res.status(400).json({
        message:
          "Project owner cannot send join request",
      });
    }

    const alreadyMember =
      project.members.some(
        (member) =>
          member.user.toString() === userId
      );

    if (alreadyMember) {
      return res.status(400).json({
        message:
          "You are already a member of this project",
      });
    }

    const alreadyRequested =
      project.joinRequests.some(
        (requestId) =>
          requestId.toString() === userId
      );

    if (alreadyRequested) {
      return res.status(400).json({
        message:
          "Join request already sent",
      });
    }

    project.joinRequests.push(userId);

    await project.save();

    await Notification.create({
      recipient: project.creator,
      sender: userId,
      type: "project_join_request",
      message:
        "A developer requested to join your project",
      relatedProject: project._id,
    });

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
 * INVITE DEVELOPER TO PROJECT
 */
export const inviteDeveloperToProject =
  async (req, res) => {
    try {
      const { projectId, userId } =
        req.params;

      const project =
        await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      if (
        project.creator.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          message:
            "Only project owner can send invites",
        });
      }

      const alreadyMember =
        project.members.some(
          (member) =>
            member.user.toString() === userId
        );

      if (alreadyMember) {
        return res.status(400).json({
          message:
            "User is already a project member",
        });
      }

      const alreadyInvited =
        project.pendingInvites.some(
          (invite) =>
            invite.user.toString() === userId
        );

      if (alreadyInvited) {
        return res.status(400).json({
          message:
            "Invite already sent",
        });
      }

      project.pendingInvites.push({
        user: userId,
      });

      await project.save();

      await Notification.create({
        recipient: userId,
        sender: req.user.id,
        type: "project_invite",
        message:
          "You have been invited to join a project",
        relatedProject: project._id,
      });

      return res.status(200).json({
        success: true,
        message:
          "Project invite sent successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };

/**
 * APPROVE JOIN REQUEST
 */
export const approveJoinRequest = async (
  req,
  res
) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(
      projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (
      project.creator.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "Only project owner can approve requests",
      });
    }

    const requestExists =
      project.joinRequests.some(
        (id) => id.toString() === userId
      );

    if (!requestExists) {
      return res.status(404).json({
        message: "Join request not found",
      });
    }

    project.joinRequests =
      project.joinRequests.filter(
        (id) => id.toString() !== userId
      );

    project.members.push({
      user: userId,
      role: "member",
    });

    await project.save();

    await Notification.create({
      recipient: userId,
      sender: req.user.id,
      type: "project_invite",
      message:
        "Your join request has been approved",
      relatedProject: project._id,
    });

    return res.status(200).json({
      success: true,
      message:
        "Join request approved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * REJECT JOIN REQUEST
 */
export const rejectJoinRequest = async (
  req,
  res
) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(
      projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (
      project.creator.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "Only project owner can reject requests",
      });
    }

    project.joinRequests =
      project.joinRequests.filter(
        (id) => id.toString() !== userId
      );

    await project.save();

    return res.status(200).json({
      success: true,
      message:
        "Join request rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
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