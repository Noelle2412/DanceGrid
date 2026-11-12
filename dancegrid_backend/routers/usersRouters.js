import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
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

router.post("/:id/logout", requireAuth, logoutUser);

router.get("/:id/choreos", requireAuth, getUsersChoreos);

router.get("/:id/shared_choreos", requireAuth, getSharedWithChoreos);

router.get("/:id", requireAuth, getUserById);

router.delete("/:id", requireAuth, deleteUser);

export default router;
