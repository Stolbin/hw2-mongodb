import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import { getAllContacts, getContactById } from "./services/contacts.js";

dotenv.config();

const PORT = Number(process.env.PORT);

console.log({ PORT });
export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  app.get("/contacts", async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  });

  app.get("/contacts/:contactId", async (req, res) => {
    const contacts = await getAllContacts();

    const { contactId } = req.params;
    const queryId = contacts.find((item) => item.id === contactId);
    if (!queryId) {
      res.status(404).json({
        status: 404,
        message: `Contact with ${contactId} not found`,
      });
      return;
    }
    const contact = await getContactById(contactId);

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use("*", (req, res) => {
    res.status(404).json({
      message: "Not found",
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
