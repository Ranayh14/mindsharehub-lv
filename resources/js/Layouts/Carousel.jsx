import React, { useState, useEffect } from 'react';

const images = [
  '/images/Banner1.png',
  '/images/Banner2.png',
  '/images/Banner3.png',
];

export default function Carousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-lg h-48 md:h-64">
      <img
        src={images[idx]}
        alt={`Slide ${idx+1}`}
        className="w-full h-full object-cover transition-opacity duration-700"
      />
      <button
        onClick={() => setIdx((idx-1+images.length)%images.length)}
        className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white bg-opacity-70 p-1 rounded-full"
      >‹</button>
      <button
        onClick={() => setIdx((idx+1)%images.length)}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white bg-opacity-70 p-1 rounded-full"
      >›</button>
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${i===idx ? 'bg-white' : 'bg-gray-400'}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}
