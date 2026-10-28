import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  getChoreoById,
  createChoreo,
  updateChoreo,
  deleteChoreo,
  updateCouples,
  updatePictures,
  addSharedUser,
  removeSharedUser,
  removeAccessToChoreo,
} from "../controllers/choreosControllers.js";

const router = Router();

router.get("/:id", requireAuth, getChoreoById);
router.post("/", requireAuth, createChoreo);
router.patch("/:id", requireAuth, updateChoreo);
router.delete("/:id", requireAuth, deleteChoreo);

router.patch("/update_dancers/:id", requireAuth, updateCouples);

router.patch("/update_picture/:id", requireAuth, updatePictures);

router.post("/add_shared_user/:id", requireAuth, addSharedUser);
router.delete("/remove_shared_user/:id", requireAuth, removeSharedUser);

router.delete("/remove_access/.id", requireAuth, removeAccessToChoreo);

export default router;
