const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = 5050;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connection successful");
});

const usersRouter = require('./routes/users');

app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`server listening on port:${port}`);
});