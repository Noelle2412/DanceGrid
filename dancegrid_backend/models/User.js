import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    age: {
      type: Schema.Types.Number,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
