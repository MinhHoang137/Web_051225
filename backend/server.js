
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Student from './Student.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Bài 1 =====
// Thiết lập server Express và kết nối tới MongoDB
// - Server + middleware (CORS, JSON parser) => Cho phép frontend (React) gọi API
// - Kết nối Mongoose tới database `student_db`
// Đây thực hiện các bước: Bước 2 (server), Bước 4 (mongoose.connect) trong Task.
// (Bài 1 yêu cầu hiển thị danh sách học sinh; route GET ở dưới cũng thuộc Bài 1.)

// Connect to MongoDB (Bài 1)
mongoose.connect('mongodb://localhost:27017/student_db')
    .then(() => console.log("Đã kết nối MongoDB thành công"))
    .catch(err => console.error("Lỗi kết nối MongoDB:", err));

// Middleware (Bài 1)
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

// GET /api/students  (Bài 1)
// Bài 1 yêu cầu hiển thị danh sách học sinh; endpoint này trả về toàn bộ students
// (Task Bước 6 maps to this route)
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

// ===== Bài 2 =====
// Bài 2: Thêm chức năng tạo học sinh (POST)
// - Endpoint POST /api/students nhận JSON và tạo document mới trong collection `students`.
// - Đây tương ứng với Task Bài 2, Bước 1 (POST) và Bước 3 (frontend gửi POST)
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

// ===== Bài 3 =====
// Bài 3: Cập nhật thông tin học sinh (PUT)
// - Endpoint PUT /api/students/:id nhận payload và cập nhật document tương ứng.
// - Task hướng dẫn tạo PUT và trả về document mới ({ new: true }).
// API Route: Update a student by ID
app.put('/api/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const { name, age, class: className } = req.body;   
        // Find the student by ID and update
        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { name, age, class: className },
            { new: true, runValidators: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        return res.json(updatedStudent);
    }
    catch (err) {
        console.error('Error updating student:', err);
        return res.status(500).json({ error: 'Server error while updating student.' });
    }
});

// Bài 4: Thêm Chức năng Xóa Học sinh
// ===== Bài 4 =====
// Bài 4: Xóa học sinh (DELETE)
// - Endpoint DELETE /api/students/:id xóa document khỏi collection.
// - Task Bài 4 hướng dẫn tạo route này và cập nhật giao diện phía client.
// API Route: Delete a student by ID
app.delete('/api/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const deleted = await Student.findByIdAndDelete(studentId);
        if (!deleted) return res.status(404).json({ error: 'Student not found' });
        return res.json({ success: true });
    } catch (err) {
        console.error('Error deleting student:', err);
        return res.status(500).json({ error: 'Server error while deleting student.' });
    }
});
