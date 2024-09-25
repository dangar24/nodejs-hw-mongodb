import { Schema, model } from "mongoose";
import { contactTypeList } from "../../constants/contacts.js";

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  isFavourite: {
    type: Boolean,
    required: true,
    default: false,
  },
  contactType: {
    type: String,
    required: true,
    default: 'personal',
    enum: contactTypeList,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  }
},
  {
    timestamps: true,
    versionKey: false,
  },
);

const Contact = model('contacts', contactSchema);

export const sortFields = [
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
  'createdAt',
  'updatedAt',
];

export default Contact;