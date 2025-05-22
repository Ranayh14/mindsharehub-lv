@extends('layouts.app')

@section('title', 'MindshareHub - Home')

@section('body-class', 'bg-cover bg-center bg-no-repeat')
@section('body-style', "background-image: url('{{ asset('Login - visible (1).png') }}');")

@push('styles')
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
body {
    font-family: 'Poppins', sans-serif;
}
/* Animasi fade-in */
@keyframes fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}
.fade-in {
    animation: fadeIn 1s ease-out forwards;
}
</style>
@endpush

@section('content')
<!-- Welcome Section -->
<section class="text-center py-10">
    <h1 class="text-2xl font-medium mb-6 text-white">Welcome To</h1>
    <div class="inline-block bg-white text-[#2B1B54] py-3 px-6 rounded-full font-semibold text-3xl">
        MindshareHub
    </div>
</section>

<!-- Features Section -->
<section class="space-y-20 px-10 mt-10">
    <!-- Forum Anonym -->
    <div class="flex flex-col lg:flex-row items-center max-w-5xl mx-auto gap-10 fade-in">
        <div class="flex-1 text-left">
            <h2 class="text-2xl font-semibold mb-4 text-white">Forum Anonym</h2>
            <p class="text-gray-300 leading-relaxed text-sm">
                Forum anonim adalah platform online di mana pengguna dapat berpartisipasi dalam diskusi, bertukar
                informasi, dan berbagi konten tanpa harus mengungkapkan identitas mereka. Ini memungkinkan individu
                untuk berbicara secara bebas tanpa takut terhadap konsekuensi pribadi atau sosial yang mungkin
                timbul dari pengungkapan identitas mereka.
            </p>
        </div>
        <div class="w-24 h-24">
            <img src="{{ asset('People Working Together.png') }}" alt="Forum Icon" class="w-full h-full object-contain">
        </div>
    </div>

    <!-- Diary -->
    <div class="flex flex-col lg:flex-row items-center max-w-5xl mx-auto gap-10 fade-in">
        <div class="flex-1 text-left">
            <h2 class="text-2xl font-semibold mb-4 text-white">Diary</h2>
            <p class="text-gray-300 leading-relaxed text-sm">
                Fitur diary di anonim forum adalah layanan yang memungkinkan pengguna untuk membuat catatan pribadi
                atau entri harian tanpa harus mengungkapkan identitas mereka kepada publik. Ini berarti pengguna
                dapat menyimpan catatan pribadi mereka, mencurahkan pikiran, atau berbagi pengalaman tanpa takut
                identitas mereka terungkap.
            </p>
        </div>
        <div class="w-24 h-24">
            <img src="{{ asset('Journal.png') }}" alt="Diary Icon" class="w-full h-full object-contain">
        </div>
    </div>
</section>

<!-- Cookie Consent Section -->
<div id="cookieConsent" class="fixed bottom-0 left-0 right-0 bg-white text-[#2B1B54] py-4 px-8 flex items-center justify-between shadow-lg z-50 rounded-t-lg">
    <div class="flex items-center gap-4">
        <span class="text-sm">
            We use cookies to ensure you get the best experience on our website.
        </span>
    </div>
    <button id="acceptCookies" class="py-2 px-6 bg-[#2B1B54] text-white font-semibold rounded-full hover:bg-[#4C3A75] transition">
        Got it!
    </button>
</div>

<script>
    // Cookie consent functionality
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookies = document.getElementById('acceptCookies');

    // Check if the user has already accepted cookies
    if (!localStorage.getItem('cookieAccepted')) {
        cookieConsent.classList.remove('hidden');
    }

    // Hide cookie consent when accepted
    acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookieAccepted', 'true');
        cookieConsent.classList.add('hidden');
    });
</script>
@endsection
