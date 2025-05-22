import React, { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookieAccepted')) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      id="cookieConsent"
      className="fixed bottom-0 left-0 right-0 bg-white text-[#2B1B54] py-4 px-8 flex items-center justify-between shadow-lg z-50 rounded-t-lg"
    >
      <span className="text-sm">
        We use cookies to ensure you get the best experience on our website.
      </span>
      <button
        onClick={accept}
        className="py-2 px-6 bg-[#2B1B54] text-white font-semibold rounded-full hover:bg-[#4C3A75] transition"
      >
        Got it!
      </button>
    </div>
  );
}
