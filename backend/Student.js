import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    class: { type: String, required: true }
}, { collection: 'students' });

export default mongoose.model('Student', studentSchema);
