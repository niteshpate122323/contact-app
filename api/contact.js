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
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const Contact = mongoose.model('Contact', {
  name: String,
  email: String,
  message: String,
});

app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.send('✅ Message received!');
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).send('❌ Something went wrong');
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const all = await Contact.find();
    res.json(all);
  } catch (error) {
    res.status(500).send('❌ Failed to fetch submissions');
  }
});

if (process.env.LOCAL === "true") {
  app.listen(3000, () => {
    console.log("🚀 Local server running at http://localhost:3000");
  });
} else {
  module.exports = app;
}
