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
import { isValidId } from "../middlewares/validateId.js";

const router = Router();

router.use("/contacts/:contactId", isValidId("contactId"));
router.get("/contacts", isValidId, ctrlWrapper(getAllContactsController));
router.get("/contacts/:contactId", ctrlWrapper(getContactByIdController));
router.post(
  "/contacts",
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);
router.delete(
  "/contacts/:contactId",
  isValidId,
  ctrlWrapper(deleteContactController)
);
router.put("/contacts/:contactId", ctrlWrapper(updateContactController));
router.patch(
  "/contacts/:contactId",
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController)
);

export default router;
