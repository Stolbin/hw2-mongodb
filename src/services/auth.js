import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import handlebars from "handlebars";
import path from "node:path";
import fs from "node:fs/promises";
import { Users } from "../db/models/user.js";
import { Sessions } from "../db/models/session.js";
import { env } from "../utils/env.js";
import { sendEmail } from "../utils/sendMail.js";
import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  TEMPLATES_DIR,
  SMTP,
} from "../constants/constans.js";

const createSession = () => {
  return {
    accessToken: randomBytes(30).toString("base64"),
    refreshToken: randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  };
};

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
    ...createSession(),
  });
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

export const requestResetToken = async (email) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw createHttpError(404, "User not found");
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env("JWT_SECRET"),
    {
      expiresIn: "15m",
    }
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    "reset-password-email.html"
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env("APP_DOMAIN")}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: "Reset your password",
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env("JWT_SECRET"));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await Users.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await Users.updateOne({ _id: user._id }, { password: encryptedPassword });
};
