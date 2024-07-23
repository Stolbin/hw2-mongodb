import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import contactsRouter from "./routers/contacts.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundErrorHandler } from "./middlewares/notFoundHandler.js";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);

export const setupServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ["application/json", "application/vnd.api+json"],
      limit: "100kb",
    })
  );
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );
  app.use(contactsRouter);
  app.use("*", notFoundErrorHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
