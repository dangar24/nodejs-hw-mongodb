import Contact from "../db/models/Contact.js";
import calculatedPaginationData from "../utils/calculatedPaginationData.js";
import { SORT_ORDER } from "../constants/index.js";

export const getAllContacts = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
  userId
}) => {

  const contactQuery = Contact.find();
  contactQuery.where('userId').equals(userId);

  const skip = (page - 1) * perPage;
  const data = await contactQuery.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder }).exec();
  const count = await Contact.find().merge(contactQuery).countDocuments();
  const PaginationData = calculatedPaginationData({ count, perPage, page });
  
  return {
    page,
    perPage,
    totalItems: count,
    ...PaginationData,
    data,
  };
};

export const getContacts = (filter) => Contact.findOne(filter);

export const addContact = (payload) => Contact.create(payload);

export const updateContact = async(filter, data)=> {
    const rawResult = await Contact.findOneAndUpdate(filter, data, {
        new: true,
        includeResultMetadata: true,
    });

    if(!rawResult || !rawResult.value) return null;

  return rawResult.value;
};

export const deleteContact = (filter) => Contact.findOneAndDelete(filter);