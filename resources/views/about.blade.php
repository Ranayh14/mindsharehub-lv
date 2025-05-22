@extends('layouts.app')

@section('title', 'About Us - MindshareHub')
@section('body-class', 'bg-cover bg-center bg-no-repeat')
@section('body-style', "background-image: url('{{ asset('Login - visible (1).png') }}');")

@push('styles')
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
body {
    font-family: 'Poppins', sans-serif;
}
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
<!-- About Us Section -->
<div class="flex justify-center">
    <section class="text-center py-10">
        <h1 class="text-2xl font-medium mb-6 text-white">About Us</h1>
        <p class="text-gray-300 leading-relaxed max-w-2xl mx-auto">
            MindshareHub adalah platform yang bertujuan untuk menciptakan ruang aman bagi individu untuk berbagi pemikiran, ide, dan pengalaman.
            Kami percaya bahwa setiap orang memiliki cerita yang layak didengarkan dan kami berkomitmen untuk menyediakan lingkungan 
            yang mendukung dan inklusif bagi semua pengguna.
        </p>
    </section>
</div> 
<div class="flex justify-center">
    <!-- Our Mission Section -->
    <section class="space-y-20 px-10 mt-10">
        <div class="flex flex-col items-center max-w-5xl mx-auto gap-10 fade-in">
            <h2 class="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
            <p class="text-gray-300 leading-relaxed text-sm text-center">
                Misi kami adalah memberdayakan individu untuk berbicara secara terbuka dan anonim tentang topik yang penting bagi mereka. 
                Kami ingin menjembatani kesenjangan komunikasi dan menciptakan komunitas yang saling mendukung.
            </p>
        </div>
    
        <div class="flex flex-col items-center max-w-5xl mx-auto gap-10 fade-in">
            <h2 class="text-2xl font-semibold mb-4 text-white">Our Vision</h2>
            <p class="text-gray-300 leading-relaxed text-sm text-center">
                Kami berharap dapat menjadi platform terdepan untuk diskusi terbuka dan berbagi pengalaman. 
                Dengan teknologi dan komunitas yang kuat, kami ingin menjadikan MindshareHub sebagai tempat yang aman dan nyaman bagi semua orang.
            </p>
        </div>
    </section>

    @include('partials.modal')
</div>
@endsection
