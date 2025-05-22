import React from 'react';
import { Link } from '@inertiajs/react';

export default function Header() {
  return (
    <header className="flex justify-between items-center sticky top-0 py-1 px-10 bg-[#2B1B54] shadow-lg z-60">
      <div>
        <Link href="/">
          <img
            src="/images/Logo MindsahreHub-08 1.png"
            alt="MindshareHub Logo"
            className="w-20 py-1"
          />
        </Link>
      </div>
      <nav className="flex-grow flex justify-start ml-[50px]">
        <div className="flex gap-4 space-x-10">
          <Link
            href="/"
            className="text-white font-medium hover:text-gray-300 transition border-b-4 border-transparent hover:border-gray-300"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-white font-medium hover:text-gray-300 transition border-b-4 border-transparent hover:border-gray-300"
          >
            About Us
          </Link>
          <Link
            href="/help"
            className="text-white font-medium hover:text-gray-300 transition border-b-4 border-transparent hover:border-gray-300"
          >
            FAQ
          </Link>
        </div>
      </nav>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="py-2 px-4 text-white border border-white rounded-full hover:bg-white hover:text-[#2B1B54] transition"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="py-2 px-4 bg-white text-[#2B1B54] font-semibold rounded-full hover:bg-gray-200 transition"
        >
          Register
        </Link>
      </div>
    </header>
  );
}
