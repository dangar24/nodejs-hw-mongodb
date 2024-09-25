import { addContact, deleteContact, getAllContacts, getContacts, updateContact } from "../services/contacts.js";
import createHttpError from "http-errors";
import parsePaginationParams from "../utils/parsePaginationParams.js";
import parseSortParams from "../utils/parseSortParams.js";
import { sortFields } from "../db/models/Contact.js";

export const getAllContactsController = async (req, res, next) => {
    const { _id: userId } = req.user;
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams({...req.query, sortFields});
    
        const data = await getAllContacts({ page, perPage, sortBy, sortOrder, userId });

        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data: data,
        });
};
    
export const getContactsByIdController = async (req, res) => {
    const { id } = req.params;
    const { _id: userId } = req.user;

    const data = await getContacts({ _id: id, userId });

    if (!data) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data: data,
    });
};

export const addContactController = async (req, res) => {
    const { _id: userId } = req.user;
    const data = await addContact({...req.body, userId});

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data
    });
};

export const patchContactController = async (req, res) => {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const data = await updateContact({ _id: id, userId }, req.body);

    if (!data) {
            throw createHttpError(404, 'Contact not found');
        }
    
    res.status(200).json({
        status: 200,
        message: "Successfully patched a contact!",
        data
    });
};

export const deleteContactController = async (req, res) => {
    const { id } = req.params;
    const { _id: userId } = req.user;

    const data = await deleteContact({ _id: id, userId });

    if (!data) {
        throw createHttpError(404, 'Contact not found');
    };
    
    res.status(204).send();
};