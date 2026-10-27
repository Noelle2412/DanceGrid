import { Router } from "express";
import {
  getAllUsers,
  getUsersChoreos,
  getUserById,
  createUser,
  deletedUser,
} from "../controllers/usersControllers.js";

const router = Router();

router.get("/", getAllUsers);

router.get("/:id/choreos", getUsersChoreos);

router.get("/:id", getUserById);

router.post("/", createUser);

router.delete("/:id", deleteUser);

export default router;
