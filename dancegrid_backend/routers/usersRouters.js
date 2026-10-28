import { Router } from "express";
import {
  getAllUsers,
  getUsersChoreos,
  getUserById,
  createUser,
  deleteUser,
  getSharedWithChoreos,
} from "../controllers/usersControllers.js";
import { register, login } from "../config/auth.js";

const router = Router();

router.get("/", getAllUsers);

router.post("/register", register);

router.post("/login", login);

router.get("/:id/choreos", getUsersChoreos);

router.get("/:id/shared_choreos", getSharedWithChoreos);

router.get("/:id", getUserById);

router.post("/", createUser);

router.delete("/:id", deleteUser);

export default router;
