const express = require('express')
const {listContacts, getContactById, validateContact, addContact, removeContact, updateContact} = require("../../models/contacts");

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.post('/', async (req, res, next) => {
  const { name, email, phone } = req.body;

  const validationResult = validateContact({ name, email, phone });

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.message });
  }

  try {
    const newContact = await addContact({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await removeContact(contactId);
    if (result) {
      res.status(200).json({ message: 'Contact deleted' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  const validationResult = validateContact({ name, email, phone });

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.message });
  }

  try {
    const updatedContact = await updateContact(contactId, { name, email, phone });
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

module.exports = router