import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUsersToDos,
  updateUser,
} from "../controllers/usersControllers.js";

const router = Router();

router.get("/", getAllUsers);

router.get("/:id/todos", getUsersToDos);

router.get("/:id", getUserById);

router.post("/", createUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
