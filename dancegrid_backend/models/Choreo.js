import { model, Schema } from "mongoose";
import CoupleSchema from "./Couple.js";
import PictureSchema from "./Picture.js";

const DOCUMENT_NAME = "Choreo";
const COLLECTION_NAME = "choreos";

const ChoreoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gridSize: {
      type: [Number],
      required: true,
      validate: {
        validator: (value) => value.length === 2 && value.every((n) => n > 0),
        message: "gridSize must be [x, y] with both values being positive.",
      },
    },
    mode: {
      type: Schema.Types.String,
      enum: ["solo", "couple"],
      required: true,
    },
    couples: {
      type: [CoupleSchema],
      default: [],
      validate: {
        validator: function (couples) {
          const numbers = couples.map((couple) => couple.number);
          return new Set(numbers).size === numbers.length;
        },
        message: "Each couple / solo dancer must have a unique number.",
      },
    },

    pictures: {
      type: [PictureSchema],
      default: [],
    },

    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export const ChoreoModel = model(DOCUMENT_NAME, ChoreoSchema, COLLECTION_NAME);
