import Contact from "../db/models/Contact.js";

export const getAllContacts = async () => {
  const data = await Contact.find();
  return data;
};

export const getContactsById = async (id) => {
    const data = await Contact.findById(id);
    return data;
};