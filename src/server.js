import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundErrorHandler } from "./middlewares/notFoundHandler.js";
import cookieParser from "cookie-parser";
import { UPLOAD_DIR } from "./constants/constans.js";

dotenv.config();

export const setupServer = () => {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  app.use(
    express.json({
      type: ["application/json", "application/vnd.api+json"],
      limit: "100kb",
    })
  );
  app.use(cookieParser());

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  app.use("/uploads", express.static(UPLOAD_DIR));
  app.use(router);

  app.use("*", notFoundErrorHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
