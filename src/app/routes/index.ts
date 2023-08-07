import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { CowRoutes } from "../modules/cow/cow.route";
// import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { AdminRoutes } from "../modules/admins/admin.route";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/cows",
    route: CowRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
// router.use("/users/", UserRoutes);
// router.use("/cow/", CowRoutes);

export default router;
