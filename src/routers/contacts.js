import { Router } from "express";
import { addContactController, deleteContactController, getAllContactsController, getContactsByIdController, patchContactController } from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { contactsAddSchema, contactsPatchSchema } from "../validation/contacts.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get('/:id', isValidId, ctrlWrapper(getContactsByIdController));

contactsRouter.post('/', validateBody(contactsAddSchema), ctrlWrapper(addContactController));

contactsRouter.patch('/:id', isValidId, validateBody(contactsPatchSchema), ctrlWrapper(patchContactController));

contactsRouter.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;