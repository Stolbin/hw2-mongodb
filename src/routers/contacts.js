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
import { validateBody } from "../middlewares/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contacts.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);
router.get("/contacts", ctrlWrapper(getAllContactsController));
router.get("/contacts/:contactId", ctrlWrapper(getContactByIdController));
router.post(
  "/contacts",
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);
router.delete("/contacts/:contactId", ctrlWrapper(deleteContactController));
router.put("/contacts/:contactId", ctrlWrapper(updateContactController));
router.patch(
  "/contacts/:contactId",
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController)
);

export default router;
