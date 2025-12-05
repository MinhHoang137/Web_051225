import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [stuClass, setStuClass] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch students from backend API
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi fetch danh sách:', err);
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Danh sách học sinh</h1>

        {/* Add Student Form */}
        <form onSubmit={async (e) => {
          e.preventDefault();
          // basic client-side validation
          if (!name || !age || !stuClass) return;
          const payload = { name: name.trim(), age: Number(age), class: stuClass.trim() };
          setSubmitting(true);
          try {
            // Ensure we are hitting the correct backend URL (port 5000)
            const res = await axios.post('http://localhost:5000/api/students', payload);
            // Append created student to list
            setStudents(prev => [res.data, ...prev]);
            // Clear form
            setName(''); setAge(''); setStuClass('');
          } catch (err) {
            console.error('Lỗi khi thêm học sinh:', err);
            alert('Lỗi khi thêm học sinh: ' + (err.response?.data?.error || err.message));
          } finally {
            setSubmitting(false);
          }
        }} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Họ tên"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ marginRight: '8px' }}
          />
          <input
            type="number"
            placeholder="Tuổi"
            value={age}
            onChange={e => setAge(e.target.value)}
            required
            style={{ width: '80px', marginRight: '8px' }}
          />
          <input
            type="text"
            placeholder="Lớp"
            value={stuClass}
            onChange={e => setStuClass(e.target.value)}
            required
            style={{ marginRight: '8px' }}
          />
          <button type="submit" disabled={submitting}>{submitting ? 'Đang thêm...' : 'Thêm học sinh'}</button>
        </form>
        {loading && <p>Đang tải...</p>}
        {error && <p style={{ color: 'salmon' }}>Lỗi: {error}</p>}
        {!loading && !error && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {students.length === 0 && <li>Không có học sinh nào.</li>}
            {students.map((s) => (
              <li key={s._id} style={{ marginBottom: '8px' }}>
                <strong>{s.name}</strong> — Tuổi: {s.age} — Lớp: {s.class}
              </li>
            ))}
          </ul>
        )}
      </header>
    </div>
  );
}

export default App;
