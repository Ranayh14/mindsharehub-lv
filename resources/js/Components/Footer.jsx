import React from 'react';
import { Link } from '@inertiajs/react';
import TermsModal   from './TermsModal';

export default function Footer() {
  return (
    <footer className="bg-[#2B1B54] text-white py-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center space-x-4 mb-4">
          <Link href="/help#cp" className="hover:text-gray-300">
            Contact Us
          </Link>
          <TermsModal />
        </div>
        <p className="text-xs">© 2024 MindshareHub. Hak cipta dilindungi.</p>
      </div>
    </footer>
  );
}
