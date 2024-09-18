import Contact from "../db/models/Contact.js";
import calculatedPaginationData from "../utils/calculatedPaginationData.js";
import { SORT_ORDER } from "../constants/index.js";

export const getAllContacts = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0]
}) => {
  const skip = (page - 1) * perPage;
  const data = await Contact.find().skip(skip).limit(perPage).sort({[sortBy]:sortOrder});
  const count = await Contact.find().countDocuments();

  const PaginationData = calculatedPaginationData({ count, perPage, page });
  
  return {
    page,
    perPage,
    totalItems: count,
    ...PaginationData,
    data,
  };
};

export const getContactsById = async (id) => {
    const data = await Contact.findById(id);
    return data;
};

export const addContact = (payload) => Contact.create(payload);

export const updateContact = async(filter, data)=> {
    const rawResult = await Contact.findOneAndUpdate(filter, data, {
        new: true,
        includeResultMetadata: true,
    });

    if(!rawResult || !rawResult.value) return null;

  return rawResult.value;
};

export const deleteContact = id => Contact.findOneAndDelete(id);