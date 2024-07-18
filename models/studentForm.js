const mongoose = require('mongoose');

const studentFormSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    name: String,
    sin: String,
    dep: String
    // Add more fields as needed
});

const StudentForm = mongoose.model('StudentForm', studentFormSchema);
module.exports = StudentForm;
