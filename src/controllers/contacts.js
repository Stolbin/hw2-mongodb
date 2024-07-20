import createHttpError from "http-errors";
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from "../services/contacts.js";

export async function getAllContactsController(req, res, next) {
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

export async function getContactByIdController(req, res, next) {
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

export const createContactController = async (req, res, next) => {
  try {
    const payload = req.body;
    const newContact = await createContact(payload);

    res.status(201).json({
      status: 201,
      message: "Successfully created contact!",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contact_id } = req.params;
    const deletedContact = await deleteContact(contact_id);

    if (!deletedContact) {
      throw createHttpError(404, `Contact not found with id ${contact_id}`);
    }

    res.status(200).json({
      status: 200,
      message: `Successfully deleted contact with id ${contact_id}!`,
      data: deletedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const upsertContactController = async (req, res, next) => {
  try {
    const { contact_id } = req.params;
    const payload = req.body;
    const updatedContact = await updateContact(contact_id, payload);

    if (!updatedContact) {
      throw createHttpError(404, `Contact not found with id ${contact_id}`);
    }

    res.status(200).json({
      status: 200,
      message: `Successfully updated contact with id ${contact_id}!`,
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  const { contact_id } = req.params;

  const result = await updateContact(contact_id, req.body);

  if (!result) {
    next(createHttpError(404, "Contact not found"));
    return;
  }

  res.status(201).json({
    status: 201,
    message: "Successfully putched a contact",
    data: result.contact,
  });
};
