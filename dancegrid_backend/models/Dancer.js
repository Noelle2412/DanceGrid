import { Schema } from "mongoose";

const DancerSchema = new Schema(
  {
    design: {
      color: {
        type: Schema.Types.String,
        required: true,
      },
      shape: {
        type: Schema.Types.String,
        enum: ["circle", "square", "triangle"],
        default: "circle",
      },
    },
  },
  { _id: false },
);

export const CoupleSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },
    leader: {
      type: DancerSchema,
      required: true,
    },
    follower: {
      type: DancerSchema,
      required: true,
    },
  },
  { _id: false },
);
