import { model, Schema } from "mongoose";

export const DancerPositionSchema = new Schema(
  {
    coupleNumber: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },
    role: {
      type: String,
      enum: ["leader", "follower"],
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);
