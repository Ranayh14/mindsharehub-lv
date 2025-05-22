import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Layouts/Sidebar';

const Diary = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  // Ambil data catatan dari backend
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/diaries');
      setNotes(response.data);
      setError(null);
    } catch (err) {
      console.error('Gagal ambil data diary', err);
      setError('Gagal mengambil data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Simpan atau update catatan baru/lama
  const handleSave = async () => {
    if (!title.trim()) {
      setError('Judul tidak boleh kosong!');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = { title, content };
      
      if (selectedNoteId) {
        await axios.put(`/api/diaries/${selectedNoteId}`, data);
        setSuccessMessage('Catatan berhasil diperbarui!');
      } else {
        await axios.post('/api/diaries', data);
        setSuccessMessage('Catatan baru berhasil disimpan!');
      }

      fetchNotes();
      setTitle('');
      setContent('');
      setSelectedNoteId(null);
      
      // Hilangkan success message setelah 3 detik
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Gagal menyimpan', err);
      setError('Gagal menyimpan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNoteId) {
      setError('Pilih catatan yang ingin dihapus terlebih dahulu');
      return;
    }

    if (!window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/api/diaries/${selectedNoteId}`);
      setSuccessMessage('Catatan berhasil dihapus!');
      
      // Reset state
      setTitle('');
      setContent('');
      setSelectedNoteId(null);
      
      // Refresh list
      fetchNotes();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Gagal menghapus', err);
      setError('Gagal menghapus: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk pilih note dari list agar bisa diedit/hapus 
  function handleSelectNote(note){
    setSelectedNoteId(note.id)
    setTitle(note.title)
    setContent(note.content)
  }

  return (
    
    <div className="flex bg-[#1a1b26] text-white">
        <Sidebar />
      <div className="flex-1 p-5">
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-100">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded text-green-100">
            {successMessage}
          </div>
        )}

        <div className="flex justify-between items-center mb-5">
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className="title-input w-full p-3 bg-[#2d2d3d] text-white text-lg rounded outline-none mr-3" placeholder="Judul"/>
          <div className="flex space-x-2">
            <button onClick={()=>{setTitle("");setContent("");setSelectedNoteId(null)}}className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">+ Catatan Baru</button>
            <button onClick={handleSave} disabled={loading} className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
            <button onClick={handleDelete} disabled={!selectedNoteId || loading} className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors ${(!selectedNoteId || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}>Hapus</button>
          </div>
        </div>

        <textarea value={content} onChange={(e)=>setContent(e.target.value)} className="w-full h-[12rem] p-[20px] bg-[#2d2d3d] text-white rounded outline-none resize-none mb-[20px]" placeholder='Tulis di sini...'></textarea>

        {/* TODO: Voice Recording Section bisa ditambahkan di sini */}
      </div>

      <div className='w-[18rem] bg-[#13141f] h-screen p-[20px_20px_10px_20px_] overflow-y-auto'>
        <h3 className='text-lg font-semibold mb-[12px_]'>Catatan Anda</h3>
        {loading && <p className="text-gray-400">Memuat...</p>}
        {!loading && notes.length>0?(
          notes.map((note)=>(
            <div key={note.id}onClick={()=>handleSelectNote(note)}className={`p-4 bg-[#1e1f2e] rounded mb-3 cursor-pointer hover:bg-[#2d2d3d] ${selectedNoteId === note.id ? 'border-2 border-blue-500' : ''}`} >
              <h3 className='font-bold mb-[4px_]'>{note.title}</h3><p classNmae='text-sm text-[#8e8ea0]'>{note.content.slice(0,50)}...</p></div>))) : (<p>Belum ada catatan.</p>)}
      </div></div>);
};

export default Diary;
