import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    techStack: [
      {
        type: String,
      },
    ],

    rolesNeeded: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["open", "closed", "in-progress"],
      default: "open",
    },

    githubRepo: {
      type: String,
    },

    liveLink: {
      type: String,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;