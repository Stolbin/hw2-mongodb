import { Router } from "express";
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController,
} from "../controllers/contacts.js";

const router = Router();

router.get("/contacts", getAllContactsController);
router.get("/contacts:contact_id", getContactByIdController);
router.post("/", createContactController);
router.delete("/contacts:contact_id", deleteContactController);
router.put("/contacts:contact_id", upsertContactController);
router.patch("/contacts:contact_id", patchContactController);

export default router;
