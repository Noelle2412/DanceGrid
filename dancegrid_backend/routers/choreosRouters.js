import { Router } from "express";
import {
  addTag,
  createTodo,
  deleteTodo,
  getAllTodos,
  getTodoById,
  removeTag,
  updateTodo,
} from "../controllers/todosControllers.js";

const router = Router();

router.get("/", getAllTodos);

router.get("/:id", getTodoById);

router.post("/", createTodo);

router.patch("/add_tag/:id", addTag);
router.patch("/remove_tag/:id", removeTag);

router.patch("/:id", updateTodo);

router.delete("/:id", deleteTodo);

export default router;
