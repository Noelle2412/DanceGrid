import { Schema } from "mongoose";
import { DancerPositionSchema } from "./DancerPosition.js";

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
      validate: {
        validator: function (coordinates) {
          const keys = coordinates.map(
            ({ coupleNumber, role }) => `${coupleNumber}:${role}`,
          );

          return new Set(keys).size === keys.length;
        },
        message: "A dancer can only appear once per picture.",
      },
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);
