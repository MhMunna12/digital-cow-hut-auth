import express from "express";
import { CowController } from "./cow.controller";
import auth from "../../../middleware/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
const router = express.Router();
router.post(
  "/create-cow",
  auth(ENUM_USER_ROLE.SELLER),
  CowController.createCow
);
router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  CowController.getSingleCow
);
router.patch("/:id", auth(ENUM_USER_ROLE.SELLER), CowController.updateCow);
router.delete("/:id", auth(ENUM_USER_ROLE.SELLER), CowController.deleteCow);
router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  CowController.getAllCow
);
export const CowRoutes = router;
