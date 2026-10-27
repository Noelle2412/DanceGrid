import { model, Schema } from "mongoose";

export const DancerPositionSchema = new Schema(
  {
    dancerNumber: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
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
