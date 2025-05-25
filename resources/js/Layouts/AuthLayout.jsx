import { Link } from '@inertiajs/react';

export default function AuthLayout({ children }) {
    return (
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
                    className="absolute -top-64 -right-64 w-[1400px] h-[1400px] opacity-30 pointer-events-none"
                />
                <dotlottie-player
                    src="https://lottie.host/2c9557a7-b65b-4d41-8e57-d6e566c92891/0uJzquhaU2.lottie"
                    background="transparent"
                    speed="1"
                    loop
                    autoplay
                    className="absolute -bottom-64 -left-64 w-[1400px] h-[1400px] opacity-30 pointer-events-none"
                />

                <div className="relative z-10 max-w-md mx-auto w-full">
                    <div className="text-center mb-6">
                        <img src="/images/Logo MindsahreHub-07.png" alt="Logo" className="w-32 h-32 mx-auto mb-3" />
                        <h2 className="text-4xl font-bold">
                            {window.location.pathname === '/register' ? 'Yuk, bikin akunmu!' : 'Selamat Datang Kembali!'}
                        </h2>
                    </div>

                    <div className="p-5 max-w-md w-full rounded-lg shadow-md bg-white bg-opacity-20 backdrop-blur-lg">
                        {children}

                        <div className="mt-4 text-center text-sm">
                            {window.location.pathname === '/register' ? (
                                <>
                                    Sudah punya akun?{' '}
                                    <Link href="/login" className="underline">
                                        Masuk di sini
                                    </Link>
                                </>
                            ) : (
                                <>
                                    Belum punya akun?{' '}
                                    <Link href="/register" className="underline">
                                        Daftar di sini
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 