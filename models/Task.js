import mongoose, { Schema } from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    type: {
      type: String,
      enum: ["task", "summary", "milestone"],
      default: "task",
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
      required: false,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Task = mongoose.model("Task", TaskSchema);
