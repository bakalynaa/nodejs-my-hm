const {model, Schema } = require("mongoose");

const contactSchemaDB = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
});

const Contact = model('Contact', contactSchemaDB);

const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

function validateContact(contact) {
  return contactSchema.validate(contact);
}

const listContacts = async () => {
    const contacts = await Contact.find({});

    return contacts || null;
}

const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);

  return contact || null;
}

const removeContact = async (contactId) => {
  const deletedContact = await Contact.findByIdAndDelete(contactId);

  return deletedContact || null;
}

const addContact = async (contact) => {
  const createdContact = await Contact.create(contact);

  return createdContact || null;
}

const updateContact = async (contactId, body) => {
  const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { ...body },
      { new: true, runValidators: true }
  );

  return updatedContact || null;
}

const updateStatusContact = async (contactId, body) => {
  const updatedStatusContact = await Contact.findByIdAndUpdate(
      contactId,
      { ...body },
      { new: true, runValidators: true }
  );

  return updatedStatusContact || null;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  validateContact,
  updateStatusContact
}
