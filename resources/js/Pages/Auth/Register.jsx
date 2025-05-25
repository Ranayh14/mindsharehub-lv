import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Ziggy } from '@/ziggy';
import { route } from 'ziggy-js';
import TermsModal from '@/Components/TermsModal';
import '@dotlottie/player-component';

export default function Register() {
  const [data, setData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const { flash = {} } = usePage().props;
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (flash.success || flash.error) {
      setMessage(flash.success || flash.error);
    }
  }, [flash]);

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => setMessage(null), 5000);
    }
    return () => timer && clearTimeout(timer);
  }, [message]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    try {
      const response = await axios.post('/api/register', data);
      setProcessing(false);
      setData({
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
      });

      // Redirect ke halaman login dengan flash message
      router.visit('/login', {
        data: { success: 'Pendaftaran berhasil! Silakan login.' },
        preserveState: false,
        replace: true,
      });
    } catch (error) {
      setProcessing(false);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        setMessage(error.response.data.message || 'Validasi gagal');
      } else {
        setMessage('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };

  return (
    <>
      <Head title="Register" />

      <div className="flex flex-col md:flex-row h-screen">
        {/* Illustration */}
        <div
          className="hidden md:block flex-grow bg-cover bg-center"
          style={{ backgroundImage: "url('/images/poster1.png')" }}
        />

        {/* Form */}
        <div className="w-full md:w-8/12 p-8 bg-[#2B1B54] text-white flex flex-col justify-center relative overflow-hidden">
          <dotlottie-player
            src="https://lottie.host/2c9557a7-b65b-4d41-8e57-d6e566c92891/0uJzquhaU2.lottie"
            background="transparent"
            speed="1"
            loop
            autoplay
            class="absolute -top-64 -right-64 w-[1400px] h-[1400px] opacity-30 pointer-events-none"
          />
          <dotlottie-player
            src="https://lottie.host/2c9557a7-b65b-4d41-8e57-d6e566c92891/0uJzquhaU2.lottie"
            background="transparent"
            speed="1"
            loop
            autoplay
            class="absolute -bottom-64 -left-64 w-[1400px] h-[1400px] opacity-30 pointer-events-none"
          />

          <div className="relative z-10 max-w-md mx-auto w-full">
            <div className="text-center mb-6">
              <img src="/images/Logo MindsahreHub-07.png" alt="Logo" className="w-32 h-32 mx-auto mb-3" />
              <h2 className="text-4xl font-bold">Yuk, bikin akunmu!</h2>
            </div>

            {message && (
              <div className={`mb-4 p-3 text-sm rounded text-center bg-red-100 text-red-800 border border-red-300`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 p-5 max-w-md w-full rounded-lg shadow-md bg-white bg-opacity-20 backdrop-blur-lg">
              {/* Email */}
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-100 text-gray-800"
                  required
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1">Kata Sandi</label>
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-100 text-gray-800"
                  required
                />
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-1">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={data.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-100 text-gray-800"
                  required
                />
                {errors.password_confirmation && <p className="text-red-400 text-sm mt-1">{errors.password_confirmation}</p>}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  name="terms"
                  checked={data.terms}
                  onChange={handleChange}
                />
                <label htmlFor="terms" className="text-sm">
                  Saya menyetujui{' '}
                  <button type="button" onClick={() => setShowTerms(true)} className="underline">
                    Syarat &amp; Ketentuan
                  </button>
                </label>
              </div>
              {errors.terms && <p className="text-red-400 text-sm">{errors.terms}</p>}

              <button
                type="submit"
                disabled={processing}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
              >
                {processing ? 'Mendaftarkan...' : 'Daftar'}
              </button>

              <p className="text-center text-sm">
                Sudah punya akun?{' '}
                <Link href={route('login', {}, false, Ziggy)} className="underline">
                  Masuk di sini
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <TermsModal show={showTerms} onClose={() => setShowTerms(false)} />
    </>
  );
}
