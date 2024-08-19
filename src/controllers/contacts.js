import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";

export async function getAllContactsController(req, res, next) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  try {
    const userId = req.user._id;
    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId,
    });

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
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await getContactById(contactId, userId);

    if (!contact) {
      throw createHttpError(404, `Contact not found with id ${contactId}`);
    }

    res.status(200).json({
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
    const userId = req.user._id;
    const photo = req.file;
    const contact = await createContact({ ...payload, photo }, userId, photo);

    res.status(201).json({
      status: 201,
      message: "Successfully created contact!",
      data: contact,
    });
  } catch (error) {
    if (error.status === 409) {
      throw res.status(409).send({
        status: 409,
        message: `Such contact already exists`,
      });
    }
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await deleteContact(contactId, userId);

    if (!contact) {
      throw createHttpError(404, `Contact not found with id ${contactId}`);
    }

    res.status(200).json({
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
    const userId = req.user._id;
    const payload = req.body;
    const updatedContact = await updateContact(contactId, payload, userId);

    if (!updatedContact) {
      throw createHttpError(404, `Contact not found with id ${contactId}`);
    }

    res.status(200).json({
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
  const userId = req.user._id;
  const payload = req.body;
  const photo = req.file;
  const result = await updateContact(contactId, { ...payload, photo }, userId);

  if (!result) {
    next(createHttpError(404, "Contact not found"));
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result,
  });
};
