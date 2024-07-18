const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const router = express.Router();
const model=require('./model')
const port = process.env.PORT || 7000;
const signin=require('./views/signin')

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key', // Replace with a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Database connection
mongoose.connect('mongodb://localhost:27017/studentForm')
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
});

// // Schemas
// const studentSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     password: String
// });
// const Student = mongoose.model('details', studentSchema);

// const studentFormSchema = new mongoose.Schema({
//     studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'details' },
//     name: String,
//     sin: String,
//     dep: String,
//     // Add more fields as needed
// });
// const StudentForm = mongoose.model('StudentForm', studentFormSchema);

// Routes
// router.get('/signin', (req, res) => {
//     res.render('signin');
// });
router.get('/signin',()=>signin)
// router.post('/signin', async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const newStudent = new Student({ name, email, password });
//         await newStudent.save();
//         console.log('Signed up successfully:', newStudent);
//         res.redirect('/login');
//     } catch (error) {
//         console.error('Error saving user:', error.message);
//         res.status(500).send('Error saving to database');
//     }
// });

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Student.findOne({ email, password });
        if (user) {
            req.session.userId = user._id; // Store user ID in session
            console.log('User logged in:', user.email);
            res.redirect('/profile');
        } else {
            res.send('Invalid email or password');
        }
    } catch (error) {
        console.log('Login error:', error.message);
        res.status(500).send('Login error');
    }
});

router.get('/profile', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).send('Unauthorized: No user logged in');
    }
    try {
        const user = await Student.findById(userId);
        if (user) {
            res.render('profile', { user });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).send('Error fetching user details');
    }
});

router.get('/stuform', (req, res) => {
    res.render('stuform');
});

router.post('/stuform', async (req, res) => {
    const { name, sin, dep } = req.body;
    try {
        const studentId = req.session.userId; // Get userId from session
        if (!studentId) {
            return res.status(401).send('Unauthorized: No user logged in');
        }
        const newForm = new StudentForm({ studentId, name, sin, dep });
        await newForm.save();
        console.log('Form submitted successfully:', newForm);
        res.send("Submitted successfully 👍🏻");
    } catch (error) {
        console.error('Error saving form:', error.message);
        res.status(500).send('Error saving form to database');
    }
});

app.use(router);

app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});
