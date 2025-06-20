import '../css/app.css';
import 'flowbite/dist/flowbite.js';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { DarkModeProvider } from './Contexts/DarkModeContext';

const appName = import.meta.env.VITE_APP_NAME || 'MindshareHub';

createInertiaApp({
  title: (title) => `${title} — ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <DarkModeProvider>
        <App {...props} />
      </DarkModeProvider>
    );
  },
  progress: { color: '#2B1B54' },
});
