import { Router } from "express";
import { addContactController, deleteContactController, getAllContactsController, getContactsByIdController, patchContactController } from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get('/:id', ctrlWrapper(getContactsByIdController));

contactsRouter.post('/', ctrlWrapper(addContactController));

contactsRouter.patch('/:id', ctrlWrapper(patchContactController));

contactsRouter.delete('/:id', ctrlWrapper(deleteContactController));

export default contactsRouter;