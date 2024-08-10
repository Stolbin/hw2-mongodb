import createHttpError from "http-errors";
import { Sessions } from "../db/models/session.js";
import { Users } from "../db/models/user.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      return next(createHttpError(401, "Please provide Authorization header"));
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return next(createHttpError(401, "Auth header should be of type Bearer"));
    }

    const session = await Sessions.findOne({ accessToken: token });

    if (!session) {
      const error = new Error("Session not found");
      error.status = 401;
      throw error;
    }

    const isAccessTokenExpired = new Date() > session.accessTokenValidUntil;

    if (isAccessTokenExpired) {
      return next(createHttpError(401, "Access token expired"));
    }

    const user = await Users.findById(session.userId);

    if (!user) {
      return next(createHttpError(401, "User not found"));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
