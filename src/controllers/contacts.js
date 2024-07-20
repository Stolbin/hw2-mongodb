import createHttpError from "http-errors";
import { getAllContacts, getContactById } from "../services/contacts.js";

async function getAllContactsController(req, res) {
  const contacts = getAllContacts();

  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
}

async function getContactByIdController(req, res) {
  const { contact_id } = req.params;
  const contact = await getContactById(contact_id);

  if (!contact) {
    res.createHttpError(404, "Contact not found with id ");
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contact_id}!`,
    data: contact,
  });
}
export { getAllContactsController, getContactByIdController };
