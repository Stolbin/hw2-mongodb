import { Router } from "express";
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
  patchContactController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.get("/contacts", ctrlWrapper(getAllContactsController));
router.get("/contacts:contact_id", ctrlWrapper(getContactByIdController));
router.post("/contacts", ctrlWrapper(createContactController));
router.delete("/contacts:contact_id", ctrlWrapper(deleteContactController));
router.put("/contacts:contact_id", ctrlWrapper(updateContactController));
router.patch("/contacts:contact_id", ctrlWrapper(patchContactController));

export default router;
