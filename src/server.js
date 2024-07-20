import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import process from "process";
import contactsRoutes from "./routers/contacts.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

export const setupServer = () => {
  const app = express();

  app.use(contactsRoutes);
  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  app.use("*", (req, res) => {
    res.status(404).json({
      message: "Not found",
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
