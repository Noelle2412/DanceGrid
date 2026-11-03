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

router.patch("/:id/update_dancers", requireAuth, updateCouples);

router.patch("/:id/update_pictures", requireAuth, updatePictures);

router.patch("/:id/add_shared_user", requireAuth, addSharedUser);
router.patch("/:id/remove_shared_user", requireAuth, removeSharedUser);

router.patch("/:id/remove_access", requireAuth, removeAccessToChoreo);

export default router;
