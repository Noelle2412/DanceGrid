import { Router } from "express";
import {
  getUsersChoreos,
  getUserById,
  deleteUser,
  getSharedWithChoreos,
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/usersControllers.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/:id/logout", logoutUser);

router.get("/:id/choreos", getUsersChoreos);

router.get("/:id/shared_choreos", getSharedWithChoreos);

router.get("/:id", getUserById);

router.delete("/:id", deleteUser);

export default router;
