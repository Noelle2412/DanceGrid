import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const UserSchema = new Schema(
  {
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: function () {
        return this.provider === "local";
      },
    },
    provider: {
      type: Schema.Types.String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: Schema.Types.String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: Schema.Types.String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model(DOCUMENT_NAME, UserSchema, COLLECTION_NAME);
