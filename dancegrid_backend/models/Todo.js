import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Todo";
const COLLECTION_NAME = "todos";

const schema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    priority: {
      type: Schema.Types.String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    dueDate: {
      type: Schema.Types.Date,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: false,
    },
    isCompleted: {
      type: Schema.Types.Boolean,
      required: false,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: {
      type: [{ type: Schema.Types.String, ref: "Tag" }],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const TodoModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
