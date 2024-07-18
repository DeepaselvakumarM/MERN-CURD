const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const StudentForm = require('../models/studentForm');
router.get('/signin', (req, res) => {
    res.render('signin');
});
router.post('/signin', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newStudent = new Student({ name, email, password });
        await newStudent.save();
        console.log('Signed up successfully:', newStudent);
        req.session.userId = newStudent._id;
        res.redirect('/stuform');
    } catch (error) {
        console.error('Error saving user:', error.message);
        res.status(500).send('Error saving to database');
    }
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Student.findOne({ email, password });
        if (user) {
            req.session.userId = user._id;
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

router.get('/stuform', (req, res) => {
    const studentId = req.session.userId; // Get userId from session
    if (!studentId) {
        return res.status(401).send('Unauthorized: No user logged in');
    }
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
        res.redirect('/profile');
    } catch (error) {
        console.error('Error saving form:', error.message);
        res.status(500).send('Error saving form to database');
    }
});


router.get('/profile', async (req, res) => {
    const userId = req.session.userId; // Get userId from session
    if (!userId) {
        return res.status(401).send('Unauthorized: No user logged in');
    }
    try {
        const user = await Student.findById(userId); // Fetch user details
        const form = await StudentForm.findOne({ studentId: userId }); // Fetch form details
        if (user && form) {
            res.render('profile', { user, form });
        } else {
            res.status(404).send('User or form not found');
        }
    } catch (error) {
        console.error('Error fetching user or form:', error.message);
        res.status(500).send('Error fetching user or form details');
    }
});

module.exports = router;
