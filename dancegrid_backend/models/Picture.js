import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Tag";
const COLLECTION_NAME = "tags";

const schema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
});

export const TagModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
