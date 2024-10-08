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
import { upload } from "../middlewares/multer.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);
contactsRouter.get("/", ctrlWrapper(getAllContactsController));
contactsRouter.get("/:contactId", ctrlWrapper(getContactByIdController));
contactsRouter.post(
  "",
  upload.single("photo"),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);
contactsRouter.delete("/:contactId", ctrlWrapper(deleteContactController));
contactsRouter.put(
  "/:contactId",
  upload.single("photo"),
  ctrlWrapper(updateContactController)
);
contactsRouter.patch(
  "/:contactId",
  upload.single("photo"),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController)
);

export default contactsRouter;
