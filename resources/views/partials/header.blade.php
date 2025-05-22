<header class="flex justify-between items-center sticky top-0 py-1 px-10 bg-[#2B1B54] shadow-lg z-60">
    <div>
        <img src="{{ asset('Logo MindsahreHub-08 1.png') }}" alt="MindshareHub Logo" class="w-20 py-1">
    </div>
    <nav class="flex-grow flex justify-start ml-[50px]">
        <div class="flex gap-4 space-x-10">
            <a href="{{ url('/') }}" class="text-white font-medium hover:text-gray-300 transition border-b border-b-4 border-rounded border-gray-300">Home</a>
            <a href="{{ url('/about') }}" class="text-white font-medium hover:text-gray-300 hover:border-b hover:border-b-4 hover:border-rounded hover:border-gray-300">About Us</a>
            <a href="{{ url('/faq') }}" class="text-white font-medium hover:text-gray-300 hover:border-b hover:border-b-4 hover:border-rounded hover:border-gray-300">FAQ</a>
        </div>
    </nav>
    <div class="flex gap-4">
        <a href="{{ url('/login') }}" class="py-2 px-4 text-white border border-white rounded-full hover:bg-white hover:text-[#2B1B54] transition">Login</a>
        <a href="{{ url('/register') }}" class="py-2 px-4 bg-white text-[#2B1B54] font-semibold rounded-full hover:bg-gray-200 transition">Register</a>
    </div>
</header>
