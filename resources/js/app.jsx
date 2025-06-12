import './bootstrap';
import '../css/app.css';
import 'flowbite/dist/flowbite.js';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

// Ubah import ziggy menjadi seperti ini
import { route } from 'ziggy-js';
// atau bisa juga seperti ini
// import * as route from 'ziggy-js';

// Buat route global
window.route = route;

const appName = import.meta.env.VITE_APP_NAME || 'MindshareHub';

createInertiaApp({
  title: (title) => `${title} — ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);
    return root.render(<App {...props} />);
  },
  progress: { color: '#2B1B54' },
});