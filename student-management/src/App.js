import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import StudentForm from './StudentForm';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Bài 5: State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  // Bài 6: State cho sắp xếp
  const [sortAsc, setSortAsc] = useState(true);

  // Bài 5: Lọc danh sách (Client-side filtering)
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Bài 6: Sắp xếp danh sách (Client-side sorting)
  const processedStudents = [...filteredStudents].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    // Fetch students from backend API
    // Bài 1: GET danh sách học sinh (Task Bài 1 - Bước 6)
    // This loads all students when the App mounts and is used to render the table.
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

        {/* Bài 2: Form thêm học sinh (Frontend + POST)
            - StudentForm is a reusable component used for creating students.
            - onSubmit calls POST /api/students and updates local state on success.
            This implements Task Bài 2 (Form + axios.post). */}
        <StudentForm
          submitLabel="Thêm học sinh"
          onSubmit={async (payload) => {
            try {
              setSubmitting(true);
              // Bài 2: Create (POST /api/students)
              const res = await axios.post('http://localhost:5000/api/students', payload);
              setStudents(prev => [res.data, ...prev]);
              return true;
            } catch (err) {
              console.error('Lỗi khi thêm học sinh:', err);
              alert('Lỗi khi thêm học sinh: ' + (err.response?.data?.error || err.message));
              return false;
            } finally {
              setSubmitting(false);
            }
          }}
        />
        {loading && <p>Đang tải...</p>}
        {error && <p style={{ color: 'salmon' }}>Lỗi: {error}</p>}
        
        {/* Bài 5 & 6: UI Tìm kiếm và Sắp xếp */}
        <div className="controls" style={{ margin: '20px 0', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {/* Bài 5: Input tìm kiếm */}
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          
          {/* Bài 6: Nút sắp xếp */}
          <button 
            onClick={() => setSortAsc(!sortAsc)}
            className="btn"
            style={{ backgroundColor: '#61dafb', color: '#282c34', fontWeight: 'bold' }}
          >
            Sắp xếp: {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
        </div>

        {!loading && !error && (
          <div className="table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Tuổi</th>
                  <th>Lớp</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {processedStudents.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center' }}>
                    {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Không có học sinh nào.'}
                  </td></tr>
                )}
                {processedStudents.map((s) => (
                  // If editingId matches, show inline edit row (Bài 3)
                  editingId === s._id ? (
                    <tr key={s._id}>
                      <td colSpan={4}>
                        <StudentForm
                          initialData={s}
                          submitLabel="Lưu"
                          onSubmit={async (payload) => {
                            try {
                              // Bài 3: Update (PUT /api/students/:id)
                              const res = await axios.put(`http://localhost:5000/api/students/${s._id}`, payload);
                              setStudents(prev => prev.map(p => p._id === s._id ? res.data : p));
                              setEditingId(null);
                              return true;
                            } catch (err) {
                              console.error('Lỗi khi lưu thay đổi:', err);
                              alert('Lỗi khi lưu: ' + (err.response?.data?.error || err.message));
                              return false;
                            }
                          }}
                          onCancel={() => setEditingId(null)}
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr id={`student-item-${s._id}`} key={s._id}>
                      <td>{s.name}</td>
                      <td>{s.age}</td>
                      <td>{s.class}</td>
                      <td>
                        {/* Bài 3 trigger: show inline edit form */}
                        <button className="btn edit" onClick={() => setEditingId(s._id)}>Sửa</button>
                        {/* Bài 4: Delete (DELETE /api/students/:id) */}
                        <button className="btn delete" onClick={async () => {
                          if (!window.confirm('Xóa học sinh này?')) return;
                          try {
                            await axios.delete(`http://localhost:5000/api/students/${s._id}`);
                            setStudents(prev => prev.filter(p => p._id !== s._id));
                          } catch (err) {
                            console.error('Lỗi khi xóa học sinh:', err);
                            alert('Lỗi khi xóa: ' + (err.response?.data?.error || err.message));
                          }
                        }}>Xóa</button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
