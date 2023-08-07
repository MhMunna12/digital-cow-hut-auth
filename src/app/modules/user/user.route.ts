import express from "express";
import { UserController } from "./user.controller";
import auth from "../../../middleware/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
const router = express.Router();

router.get("/:id", auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser);
router.patch("/:id", auth(ENUM_USER_ROLE.ADMIN), UserController.updateUser);
router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);
router.get("/", auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUser);
export const UserRoutes = router;
