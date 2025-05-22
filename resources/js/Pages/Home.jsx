import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '../Components/Footer';
import CookieConsent from '../Components/CookieConsent';
import Header   from '../Components/Header';

export default function Home() {
  return (
    <>
      <Head title="Home" />

      {/* Background Container */}
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/Login - visible (1).png')" }}
      >
        <Header />
        {/* Welcome Section */}
        <section className="text-center py-10">
          <h1 className="text-2xl font-medium mb-6 text-white">Welcome To</h1>
          <div className="inline-block bg-white text-[#2B1B54] py-3 px-6 rounded-full font-semibold text-3xl">
            MindshareHub
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-20 px-10 mt-10">
          <Feature
            title="Forum Anonym"
            text="Forum anonim adalah platform online di mana pengguna dapat berpartisipasi dalam diskusi, bertukar informasi, dan berbagi konten tanpa harus mengungkapkan identitas mereka."
            imgSrc="/images/People Working Together.png"
          />
          <Feature
            title="Diary"
            text="Fitur diary di anonim forum adalah layanan yang memungkinkan pengguna untuk membuat catatan pribadi atau entri harian tanpa harus mengungkapkan identitas mereka kepada publik."
            imgSrc="/images/Journal.png"
          />
        </section>

        {/* Cookie Consent */}
        <CookieConsent />

      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

function Feature({ title, text, imgSrc }) {
  return (
    <div className="flex flex-col lg:flex-row items-center max-w-5xl mx-auto gap-10 fade-in">
      <div className="flex-1 text-left">
        <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>
        <p className="text-gray-300 leading-relaxed text-sm">{text}</p>
      </div>
      <div className="w-24 h-24">
        <img src={imgSrc} alt={title} className="w-full h-full object-contain" />
      </div>
    </div>
  );
}