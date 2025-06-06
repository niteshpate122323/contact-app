const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Contact = mongoose.model('Contact', {
  name: String,
  email: String,
  message: String,
});

app.post('/api/contact', async (req, res) => {
  const contact = new Contact(req.body);
  await contact.save();
  res.send('Message received!');
});

// Optional: Show all submissions
app.get('/api/submissions', async (req, res) => {
  const all = await Contact.find();
  res.json(all);
});

module.exports = app;
