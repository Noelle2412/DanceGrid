import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Choreo";
const COLLECTION_NAME = "choreos";

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gridSize: {
      type: [Schema.Types.Double, Schema.Types.Double],
      required: true,
    },
    dancers: {
      number: {
        type: Schema.Types.Int,
        required: true,
      },
      role: {},
    },
    pictures: {
      type: [{ type: Schema.Types.String, ref: "Picture" }],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const TodoModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
