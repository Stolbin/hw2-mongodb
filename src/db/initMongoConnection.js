import mongoose from "mongoose";
import "dotenv/config";
import { env } from "../utils/env.js";

export const initMongoConnection = async () => {
  try {
    const MONGODB_USER = env.MONGODB_USER;
    const MONGODB_PASSWORD = env.MONGODB_PASSWORD;
    const MONGODB_URL = env.MONGODB_URL;
    const MONGODB_DB = env.MONGODB_DB;

    await mongoose.connect(
      `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}`
    );

    console.log("Mongo connection successfully established!");
    console.log({ MONGODB_URL });
  } catch (error) {
    console.log("Error while setting up mongo connection", error);
    throw error;
  }
};
