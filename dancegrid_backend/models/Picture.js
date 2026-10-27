import { model, Schema } from "mongoose";

export const PictureSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      default: "",
    },
    coordinates: {
      type: [DancerPositionSchema],
      default: [],
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);
