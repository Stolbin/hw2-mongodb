import { Contact } from "../db/models/contact.js";

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const deleteContact = async (contact_id) => {
  const contact = await Contact.findOneAndDelete({
    _id: contact_id,
  });
  return contact;
};

export const updateContact = async (contact_id, payload, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contact_id },
    payload,
    { new: true, includeResultMetadata: true, ...options }
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
