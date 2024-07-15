import mongoose from "mongoose";
import "dotenv/config";

export const initMongoConnection = async () => {
  try {
    const MONGODB_USER = process.env.MONGODB_USER;
    const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
    const MONGODB_URL = process.env.MONGODB_URL;
    const MONGODB_DB = process.env.MONGODB_DB;

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
