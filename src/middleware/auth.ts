import { Request, Response, NextFunction } from "express";
import ApiError from "../errors/ApiError";
import { jwtHelpers } from "../helpers/jwt.helpers";
import config from "../config";
import { Secret } from "jsonwebtoken";

interface MyRequest extends Request {}

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(400, "You are not authorized");
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as string);

      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(400, "Role is not required");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
export default auth;
