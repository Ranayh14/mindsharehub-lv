import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Ziggy } from '@/ziggy';
import TermsModal from '@/Components/TermsModal';
import '@dotlottie/player-component';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
  });

  const { flash = {} } = usePage().props;
  const [showTerms, setShowTerms] = useState(false);
  const [message, setMessage] = useState(flash.success || flash.error);

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => setMessage(null), 5000);
    }
    return () => timer && clearTimeout(timer);
  }, [message]);

  const submit = (e) => {
    e.preventDefault();
    post(route('register.attempt', {}, false, Ziggy), {
      onSuccess: () => {
        reset('password', 'password_confirmation');
      },
    });
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

          <div className="relative z-10 max-w-md mx-auto w-full">
            <div className="text-center mb-6">
              <img src="/images/Logo MindsahreHub-07.png" alt="Logo" className="w-32 h-32 mx-auto mb-3" />
              <h2 className="text-4xl font-bold">Yuk, bikin akunmu!</h2>
            </div>

            {message && (
              <div className={`mb-4 p-3 text-sm rounded text-center ${flash.error ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'}`}>
                {message}
              </div>
            )}

            <form onSubmit={submit} className="space-y-6 p-5 max-w-md w-full rounded-lg shadow-md bg-white bg-opacity-20 backdrop-blur-lg">
              {/* Email */}
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
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
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
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
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
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
                  checked={data.terms}
                  onChange={(e) => setData('terms', e.target.checked)}
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
                Daftar
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
