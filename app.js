const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 2200;
const app = express();
const connectDB = require("./config/db")
// const colors = require("colors");



app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const faceRouter = require('./face');



app.use('/api/face', faceRouter);


app.get('/', async (req, res) => {
  res.json({ message: `server is running at ${PORT}` })
})



connectDB().then(() => {

  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
})