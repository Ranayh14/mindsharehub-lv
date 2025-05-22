import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Diary = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  /**
   * Fetch all notes from the API and store them in the component state.
   * 
   * @return {Promise<void>}
   */
  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/diary');
      setNotes(res.data);
    } catch (err) {
      console.error('Gagal ambil data diary', err);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedNoteId) {
        await axios.put(`/api/diary/${selectedNoteId}`, { title, content });
      } else {
        await axios.post('/api/diary', { title, content });
      }
      fetchNotes();
      setTitle('');
      setContent('');
      setSelectedNoteId(null);
    } catch (err) {
      console.error('Gagal menyimpan', err);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedNoteId) return;
      await axios.delete(`/api/diary/${selectedNoteId}`);
      fetchNotes();
      setTitle('');
      setContent('');
      setSelectedNoteId(null);
    } catch (err) {
      console.error('Gagal menghapus', err);
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div className="flex bg-[#1a1b26] text-white">
      <Sidebar />

      <div className="flex-1 p-5">
        <div className="flex justify-between items-center mb-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input w-full p-3 bg-[#2d2d3d] text-white text-lg rounded outline-none mr-3"
            placeholder="Judul"
          />
          <div className="flex space-x-2">
            <button onClick={() => { setTitle(''); setContent(''); setSelectedNoteId(null); }} className="bg-blue-500 text-white px-4 py-2 rounded">+ Catatan Baru</button>
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Simpan</button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Hapus</button>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-48 p-5 bg-[#2d2d3d] text-white rounded outline-none resize-none mb-5"
          placeholder="Tulis di sini..."
        ></textarea>

        {/* TODO: Voice Recording Section bisa ditambahkan di sini */}
      </div>

      <div className="w-72 bg-[#13141f] h-screen p-5 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">Catatan Anda</h3>
        {notes.length > 0 ? (
          notes.map(note => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note)}
              className="p-4 bg-[#1e1f2e] rounded mb-3 cursor-pointer hover:bg-[#2d2d3d]"
            >
              <h3 className="font-bold mb-1">{note.title}</h3>
              <p className="text-sm text-[#8e8ea0]">{note.content.slice(0, 50)}...</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Belum ada catatan.</p>
        )}
      </div>
    </div>
  );
};

export default Diary;
