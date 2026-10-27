import { Router } from "express";
import {
  createTag,
  deleteTag,
  getAllTags,
  getTagById,
  getTodosByTag,
} from "../controllers/tagsControllers.js";

const router = Router();

router.get("/", getAllTags);

router.get("/:id/todos", getTodosByTag);

router.get("/:id", getTagById);

router.post("/", createTag);

router.delete("/:id", deleteTag);

export default router;
