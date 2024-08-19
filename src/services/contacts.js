import { Contact } from "../db/models/contact.js";
import mongoose from "mongoose";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/constans.js";
import { saveFile } from "../utils/saveFile.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = "_id",
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find({ userId });

  if (filter.contactType) {
    contactsQuery.where("contactType").equals(filter.contactType);
  }

  if (filter.isFavourite !== null && filter.isFavourite !== undefined) {
    contactsQuery.where("isFavourite").equals(filter.isFavourite);
  }

  contactsQuery.where("userId").equals(userId);

  const contactsCount = await Contact.countDocuments(contactsQuery.getFilter());

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id, payload, userId) => {
  const contactPayload = { ...payload, userId };
  const existingContact = await Contact.findOne(contactPayload);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  if (existingContact) {
    const error = new Error("Such contact already exists");
    error.status = 409;
    throw error;
  }
  const contact = await Contact.findOne({ _id: id, userId });
  return contact;
};

export const createContact = async ({ photo, ...payload }, userId) => {
  let url = null;

  if (photo) {
    url = await saveFile(photo);
  }

  return await Contact.create({ ...payload, userId, photo: url });
};

export const updateContact = async (
  contactId,
  { photo, ...payload },
  userId
) => {
  let updatedData = { ...payload };

  if (photo) {
    const url = await saveFile(photo);
    updatedData.photo = url;
  }

  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updatedData,
    { new: true }
  );
};

// export const updateContact = async (id, payload, userId) => {
//   const rawResult = await Contact.findOneAndUpdate(
//     { _id: id, userId },
//     payload,
//     {
//       new: true,
//     }
//   );

//   if (!rawResult) {
//     return null;
//   }
//   return rawResult;
// };

export const deleteContact = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};
