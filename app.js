const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const port = process.env.PORT || 7000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

mongoose.connect('mongodb://localhost:27017/studentForm')
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
});
app.use(authRoutes);
app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});
