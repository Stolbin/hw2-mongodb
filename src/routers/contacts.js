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
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);
contactsRouter.use("/contacts/:contactId", isValidId);
contactsRouter.get("/contacts", ctrlWrapper(getAllContactsController));
contactsRouter.get(
  "/contacts/:contactId",
  ctrlWrapper(getContactByIdController)
);
contactsRouter.post(
  "/contacts",
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);
contactsRouter.delete(
  "/contacts/:contactId",
  ctrlWrapper(deleteContactController)
);
contactsRouter.put(
  "/contacts/:contactId",
  ctrlWrapper(updateContactController)
);
contactsRouter.patch(
  "/contacts/:contactId",
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController)
);

export default contactsRouter;
