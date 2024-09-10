import Contact from "../db/models/Contact.js";

export const getAllContacts = async () => {
  const data = await Contact.find();
  return data;
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