import React, { useState } from 'react';

export default function TermsModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Tombol untuk buka modal */}
      <button
        onClick={() => setOpen(true)}
        className="text-white hover:text-gray-300"
      >
        Terms and Conditions
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Syarat dan Ketentuan
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-900"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-gray-500 text-sm">
              <p className="font-semibold">Persetujuan mu</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Pendaftaran dan Akun Pengguna:</strong>
                  <ul className="list-disc list-inside ml-5">
                    <li>Informasi yang diberikan saat pendaftaran harus akurat dan terbaru.</li>
                    <li>Pengguna bertanggung jawab untuk menjaga kerahasiaan informasi login mereka.</li>
                  </ul>
                </li>
                <li>
                  <strong>Privasi dan Anonimitas:</strong>
                  <ul className="list-disc list-inside ml-5">
                    <li>Aplikasi ini menghormati privasi Anda dan berkomitmen untuk menjaga anonimitas pengguna.</li>
                    <li>Data pribadi pengguna akan disimpan dan digunakan sesuai dengan Kebijakan Privasi kami.</li>
                  </ul>
                </li>
                <li>
                  <strong>Penggunaan Layanan:</strong>
                  <ul className="list-disc list-inside ml-5">
                    <li>Pengguna setuju untuk menggunakan layanan dengan cara yang sesuai dengan hukum yang berlaku.</li>
                    <li>Pengguna tidak boleh memposting konten yang bersifat:
                      <ul className="list-disc list-inside ml-5">
                        <li>Menghina, melecehkan, atau menyerang individu atau kelompok.</li>
                        <li>Mengandung unsur kekerasan, pornografi, atau diskriminasi.</li>
                        <li>Mempromosikan kegiatan ilegal atau berbahaya.</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
