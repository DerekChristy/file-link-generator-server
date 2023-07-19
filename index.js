const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8000;

const apiRoute = require('./routes/api');
const authRoute = require('./routes/auth');

app.use(cors())
app.use(express.json());
app.use(fileUpload());

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true
};
mongoose.connect(process.env.DB_URI, options).then((onfullfilled) => {
  if (onfullfilled) {
    console.log('Db connected!');
  }
}, (onrejected)=> {
  console.error('Database ERROR:', onrejected);
})

app.use('/', apiRoute);
app.use('/auth', authRoute);

app.listen(PORT, () => {
  console.log('Server running at port', PORT);
});
