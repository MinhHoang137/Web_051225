
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Student from './Student.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Bài 1: Kết nối MongoDB và thiết lập server Express

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student_db')
    .then(() => console.log("Đã kết nối MongoDB thành công"))
    .catch(err => console.error("Lỗi kết nối MongoDB:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Server is running correctly');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// API Route: Get all students
app.get('/api/students', async (req, res) => {
    try {
        // Fetch all students from the database
        const students = await Student.find();
        // Return the list of students as JSON
        res.json(students);
    } catch (err) {
        // Handle errors and return a 500 status code
        res.status(500).json({ error: err.message });
    }
});

// Bài 2: Tạo API thêm học sinh mới
// API Route: Create a new student
app.post('/api/students', async (req, res) => {
    try {
        // Destructure and rename `class` because it's a JS reserved word
        const { name, age, class: className } = req.body;

        // Basic validation
        if (!name || typeof name !== 'string' || !age || typeof age !== 'number' || !className || typeof className !== 'string') {
            return res.status(400).json({
                error: 'Invalid student data. Required fields: name (string), age (number), class (string).'
            });
        }

        // Create the student document
        const newStudent = await Student.create({ name, age, class: className });

        // Return created document with 201 status
        return res.status(201).json(newStudent);
    } catch (err) {
        // Log the error for debugging and return a 500 status
        console.error('Error creating student:', err);
        return res.status(500).json({ error: 'Server error while creating student.' });
    }
});
