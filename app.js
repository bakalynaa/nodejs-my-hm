const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const contactsRouter = require('./routes/api/contacts')
const userAuth = require('./routes/api/auth')
const avatars = require('./routes/api/avatars')
const path = require('path');

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/auth", userAuth);

app.use('/api/contacts', contactsRouter)

app.use('/api', avatars)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
