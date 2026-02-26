import mongoose, { Schema } from "mongoose";

const LinkSchema = new Schema(
  {
    source: { type: String, required: true },
    target: { type: String, required: true },
    type: {
      type: String,
      enum: ["e2s", "e2e", "s2s", "s2e"],
      default: "e2s",
    },
  },
  { timestamps: true },
);

export const Link = mongoose.model("Link", LinkSchema);
