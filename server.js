const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/studentForm')
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
});
const studentSchema = new mongoose.Schema({
    email: String,
    password: String
});
const student = mongoose.model('details', studentSchema);
router.get('/signin', (req, res) => {
    res.render('signin');
});
router.post('/signin', async (req, res) => {
    const { name,email, password } = req.body;
    try {
        const newStudent = new student({ name,email, password });
        await newStudent.save();
        console.log('signed successfully:', newStudent);
        res.redirect('/login');
    } catch (error) {
        console.error('Error saving user :', error.message);
        res.status(500).send('Error saving  database');
    }
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      
        const user = await student.findOne({ email, password });
        if (user) {
            console.log('User logged in:', student.email);
            res.redirect('/stuform');
        } else {
            res.send('Invalid email or password');
        }
    } catch (error) {
        console.log(' logging error:', error.message);
        res.status(500).send('logging error');
    }
});
router.get('/stuform', (req, res) => {
    res.render('stuform');
});

router.post('/submit',(req,res)=>{
    res.send("submitted sucessfully 👍🏻")
})
app.use(router);
app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});

