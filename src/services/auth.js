import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { Users } from "../db/models/user.js";
import { Sessions } from "../db/models/session.js";
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "../constants/constans.js";

export const registerUser = async (payload) => {
  const user = await Users.findOne({ email: payload.email });

  if (user) throw createHttpError(409, "Email in use");

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await Users.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await Users.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, "Unauthorized");
  }

  await Sessions.deleteOne({ userId: user._id });

  return await Sessions.create({
    userId: user._id,
    accessToken: randomBytes(30).toString("base64"),
    refreshToken: randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
};

const createSession = () => {
  return {
    accessToken: randomBytes(30).toString("base64"),
    refreshToken: randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Sessions.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, "Session token expired");
  }

  const newSession = createSession();

  await Sessions.deleteOne({
    _id: sessionId,
  });

  return await Sessions.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await Sessions.deleteOne({ _id: sessionId });
};
