@extends('layouts.app')

@section('title', 'FAQ - MindshareHub')

@push('styles')
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
body, html {
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 0;
}
.content {
    flex: 1;
    background-image: url("{{ asset('Login - visible (1).png') }}");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
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
<div class="content flex flex-col">
    <div class="container mx-auto p-8">
        <h1 class="text-white text-2xl font-medium mb-6 text-center">Frequently Asked Questions</h1>
        <div class="bg-white shadow-md rounded-lg p-6 mb-4">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">What is MindshareHub?</h2>
                <button onclick="toggleFAQ('faq1')" class="text-gray-500 focus:outline-none">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </div>
            <div id="faq1" class="hidden mt-2">
                <p class="text-gray-600">MindshareHub is a platform for individuals to share thoughts, ideas, and experiences anonymously.</p>
            </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6 mb-4">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">How can I join MindshareHub?</h2>
                <button onclick="toggleFAQ('faq2')" class="text-gray-500 focus:outline-none">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </div>
            <div id="faq2" class="hidden mt-2">
                <p class="text-gray-600">You can join by registering on our website. It’s quick and easy!</p>
            </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6 mb-4">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">Is my data safe?</h2>
                <button onclick="toggleFAQ('faq3')" class="text-gray-500 focus:outline-none">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </div>
            <div id="faq3" class="hidden mt-2">
                <p class="text-gray-600">Yes, we prioritize your privacy and ensure that your data is protected.</p>
            </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6 mb-4">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">Can I remain anonymous?</h2>
                <button onclick="toggleFAQ('faq4')" class="text-gray-500 focus:outline-none">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </div>
            <div id="faq4" class="hidden mt-2">
                <p class="text-gray-600">Absolutely! Our platform allows you to share without revealing your identity.</p>
            </div>
        </div>
    </div>
    
    <div class="pl-48 pr-48 mb-[118px]" id="cp">
        <h2 class="text-2xl font-medium mt-12 mb-6 text-center text-white">Contact MindshareHub Team</h2>
        <form action="#" method="POST" class="bg-white bg-opacity-25 shadow-md rounded-lg p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label for="fullname" class="block text-white text-sm font-bold mb-2">Full Name</label>
                    <input type="text" id="fullname" name="fullname" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                </div>
                <div>
                    <label for="email" class="block text-white text-sm font-bold mb-2">Email Address</label>
                    <input type="email" id="email" name="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                </div>
            </div>
            <div class="mb-4">
                <label for="phone" class="block text-white text-sm font-bold mb-2">Phone Number</label>
                <input type="tel" id="phone" name="phone" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>
            <div class="mb-4">
                <label for="message" class="block text-white text-sm font-bold mb-2">Message</label>
                <textarea id="message" name="message" rows="5" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
            </div>
            <div class="flex items-center justify-between">
                <button type="submit" class="border border-white bg-[#2B1B54] bg-opacity-25 hover:bg-white hover:text-[#2B1B54] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
            </div>
        </form>
    </div>

    @include('partials.modal')
</div>

<script>
    function toggleFAQ(id) {
        const faq = document.getElementById(id);
        faq.classList.toggle('hidden');
    }
</script>
@endsection
