<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title inertia>{{ config('app.name') }}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css'>
  @routes
  @viteReactRefresh
  @vite(['resources/js/app.jsx', 'resources/css/app.css'])
  @inertiaHead
</head>
<body class="bg-gray-50 font-sans antialiased">
  @inertia
</body>
</html>
