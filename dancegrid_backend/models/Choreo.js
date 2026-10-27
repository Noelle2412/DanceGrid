import { model, Schema } from "mongoose";

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
        validator: (value) => value.length === 2,
      },
    },
    dancers: {
      type: [DancerSchema],
      default: [],
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
