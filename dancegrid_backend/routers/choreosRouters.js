import { Router } from "express";
import {} from "../controllers/choreosController.js";

const router = Router();

router.get("/:id", getChoreoById);
router.post("/", createChoreo);
router.patch("/:id", updateChoreo);
router.delete("/:id", deleteChoreo);

router.patch("/update_dancers/:id", updateCouples);

router.post("/add_picture/:id", addPicture);
router.patch("/update_picture/:id", updatePicture);
router.delete("/remove_picture/:id", removePicture);

router.post("/add_shared_user/:id", addSharedUser);
router.delete("/remove_shared_user/:id", removeSharedUser);

export default router;
