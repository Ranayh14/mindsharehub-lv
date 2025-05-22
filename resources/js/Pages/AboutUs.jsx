// File: resources/js/Pages/AboutUs.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '../Components/Footer';
import CookieConsent from '../Components/CookieConsent';
import Header   from '../Components/Header';

export default function AboutUs() {
  return (
    <>
      <Head title="About Us" />

      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/Login - visible (1).png')" }}
      >
        <Header />

        {/* About Us Section */}
        <section className="text-center py-10">
          <h1 className="text-2xl font-medium mb-6 text-white">About Us</h1>
          <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
            MindshareHub adalah platform yang bertujuan untuk menciptakan ruang aman bagi individu
            untuk berbagi pemikiran, ide, dan pengalaman. Kami percaya bahwa setiap orang memiliki
            cerita yang layak didengarkan dan kami berkomitmen untuk menyediakan lingkungan yang
            mendukung dan inklusif bagi semua pengguna.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="space-y-20 px-10 mt-10">
          <div className="flex flex-col items-center max-w-5xl mx-auto gap-10 fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed text-sm text-center">
              Misi kami adalah memberdayakan individu untuk berbicara secara terbuka dan anonim tentang
              topik yang penting bagi mereka. Kami ingin menjembatani kesenjangan komunikasi dan
              menciptakan komunitas yang saling mendukung.
            </p>
          </div>

          <div className="flex flex-col items-center max-w-5xl mx-auto gap-10 fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-white">Our Vision</h2>
            <p className="text-gray-300 leading-relaxed text-sm text-center">
              Kami berharap dapat menjadi platform terdepan untuk diskusi terbuka dan berbagi
              pengalaman. Dengan teknologi dan komunitas yang kuat, kami ingin menjadikan
              MindshareHub sebagai tempat yang aman dan nyaman bagi semua orang.
            </p>
          </div>
        </section>

        {/* Cookie Consent*/}
        <CookieConsent />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
