import { model, Schema } from "mongoose";

export const DancerSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },
    role: {
      type: String,
      enum: ["solo", "leader", "follower"],
      required: true,
    },
    design: {
      color: {
        type: String,
        required: true,
      },
      shape: {
        type: String,
        enum: ["circle", "square", "triangle"],
        default: "circle",
      },
    },
  },
  { _id: false },
);
