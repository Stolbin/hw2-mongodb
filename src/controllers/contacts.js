import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from "../services/contacts.js";
import createHttpError from "http-errors";

export async function getAllContactsController(req, res, next) {
  try {
    const contacts = await getAllContacts();

    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}

export async function getContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw createHttpError(404, `Contact not found with id ${contactId}`);
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export const createContactController = async (req, res, next) => {
  try {
    const payload = req.body;
    const contact = await createContact(payload);

    res.json({
      status: 200,
      message: "Successfully created contact!",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);

    if (!contact) {
      throw createHttpError(404, `Contact not found with id ${contactId}`);
    }

    res.json({
      status: 200,
      message: `Successfully deleted contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const payload = req.body;
    const updatedContact = await updateContact(contactId, payload);

    if (!updatedContact) {
      throw createHttpError(404, `Contact not found with id ${contactId}`);
    }

    res.json({
      status: 200,
      message: `Successfully updated contact with id ${contactId}!`,
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, "Contact not found"));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};
