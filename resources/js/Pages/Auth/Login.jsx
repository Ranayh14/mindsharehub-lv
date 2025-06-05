import React, { useEffect, useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Ziggy } from '@/ziggy'; // import route file hasil generate

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  const flash = usePage().props?.flash || {};
  const [message, setMessage] = useState(flash.success);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  function submit(e) {
    e.preventDefault();
    post(route('login.attempt', {}, false, Ziggy));
  }

  return (
    <>
      <Head title="Login" />
      <div className="bg-[#2B1B54] h-screen flex items-center justify-center m-0">
        <div className="flex flex-col md:flex-row bg-[#2B1B54] shadow-lg overflow-hidden w-full h-screen relative">

          {/* Left Side Illustration */}
          <div
            className="relative flex-grow bg-cover bg-center h-full hidden md:block"
            style={{ backgroundImage: "url('/images/poster1.png')" }}
          />

          {/* Right Side Form */}
          <div className="w-full md:w-8/12 p-8 bg-[#2B1B54] text-white flex flex-col justify-center h-full relative overflow-hidden">
          {/* Background animations */}
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

            <div className="relative z-10 max-w-md mx-auto">
              <div className="text-center mb-6">
                <img src="/images/Logo MindsahreHub-07.png" alt="Logo" className="w-32 h-32 mx-auto mb-3" />
                <h2 className="text-4xl font-bold">Selamat Datang Kembali!</h2>
              </div>

              {message && (
                <div className="mb-4 p-3 text-sm text-green-800 bg-green-100 border border-green-300 rounded text-center">
                  {message}
                </div>
              )}

              {errors.email && <div className="text-red-400">{errors.email}</div>}
              {errors.password && <div className="text-red-400">{errors.password}</div>}

              <form onSubmit={submit} className="space-y-6 p-5 max-w-md w-full rounded-lg shadow-md bg-white bg-opacity-20 backdrop-blur-lg">
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="w-full px-4 py-2 rounded bg-gray-100 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Kata Sandi</label>
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className="w-full px-4 py-2 rounded bg-gray-100 text-gray-800"
                    required
                  />
                </div>
                <div className="text-right">
                  <Link href="/gantiPassword/gpTahap1.html" className="underline text-sm">
                    Lupa Kata Sandi?
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded"
                >
                  Masuk
                </button>
                <p className="text-center text-sm">
                  Belum punya akun?{" "}
                  <Link href="/register" className="underline">
                    Daftar di sini
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
