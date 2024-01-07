const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const contactsRouter = require('./routes/api/contacts')
const userAuth = require('./routes/api/auth')
const avatars = require('./routes/api/avatars')
const path = require('path');
const jwt = require("jsonwebtoken");
const { verifyUser } = require('./routes/api/contacts');
const Joi = require("joi");

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/auth", userAuth);

app.use('/api/contacts', contactsRouter)

app.use('/api', avatars)

app.get('/api/users/verify/:verificationToken', async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);

    const user = await verifyUser(decoded.id);

    if (!user || user.verificationToken !== verificationToken) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.updateOne({ verify: true, verificationToken: null });

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/users/verify', async (req, res) => {
  try {
    // Валідація даних у запиті
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Missing required field email' });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user.verify) {
      return res.status(400).json({ message: 'Verification has already been passed' });
    }

    const verificationToken = user.verificationToken;

    const verificationLink = `http://nodejs-homework-rest-api/api/users/verify/${verificationToken}`;


    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
