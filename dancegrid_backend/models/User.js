import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const schema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
