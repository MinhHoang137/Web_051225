import React, { useState, useEffect } from 'react';

export default function StudentForm({ initialData = null, onSubmit, onCancel, submitLabel = 'Lưu' }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [stuClass, setStuClass] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setAge(initialData.age != null ? String(initialData.age) : '');
      setStuClass(initialData.class || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !age || !stuClass) return;
    const payload = { name: name.trim(), age: Number(age), class: stuClass.trim() };
    setBusy(true);
    try {
      const result = await onSubmit(payload);
      // If parent handler returns truthy, reset the form (useful for create)
      if (result) {
        setName(''); setAge(''); setStuClass('');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
      <input
        type="text"
        placeholder="Họ tên"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{ marginRight: 8 }}
      />
      <input
        type="number"
        placeholder="Tuổi"
        value={age}
        onChange={e => setAge(e.target.value)}
        required
        style={{ width: 80, marginRight: 8 }}
      />
      <input
        type="text"
        placeholder="Lớp"
        value={stuClass}
        onChange={e => setStuClass(e.target.value)}
        required
        style={{ marginRight: 8 }}
      />
      <button type="submit" disabled={busy}>{busy ? 'Đang lưu...' : submitLabel}</button>
      {onCancel && (
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Hủy</button>
      )}
    </form>
  );
}
