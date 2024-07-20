import createHttpError from "http-errors";
import { getAllContacts, getContactById } from "../services/contacts.js";

async function getAllContactsController(req, res, next) {
  try {
    const contacts = await getAllContacts();

    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}

async function getContactByIdController(req, res, next) {
  try {
    const { contact_id } = req.params;
    const contact = await getContactById(contact_id);

    if (!contact) {
      throw createHttpError(404, `Contact not found with id ${contact_id}`);
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contact_id}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export { getAllContactsController, getContactByIdController };
