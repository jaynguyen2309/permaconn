import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "..";

export const checkSuperAdminRole = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.decodedUser; // Assuming the user information is attached by the authentication middleware
  if (!user || user.roles !== "super admin") {
    return res.status(403).json({ message: "Permission denied" });
  }
  next();
};
