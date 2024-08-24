"use client";
import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function Home() {
  const [wordPosition, setWordPosition] = useState({ x: 50, y: 50 });
  const wordRef = useRef(null);

  const words = ["Run", "Chase", "Catch", "Escape", "Dodge", "Jump"];
  const randomWord = words[Math.floor(Math.random() * words.length)];

  const handleMouseMove = (e) => {
    const wordElement = wordRef.current;
    const { left, top } = wordElement.getBoundingClientRect();
    const distance = Math.hypot(e.clientX - left, e.clientY - top);

    if (distance < 100) {
      setWordPosition({
        x: Math.random() * window.innerWidth * 0.8,
        y: Math.random() * window.innerHeight * 0.8,
      });
    }
  };

  const handleButtonClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setWordPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center">
      <h1
        ref={wordRef}
        style={{ top: wordPosition.y, left: wordPosition.x }}
        className="absolute text-4xl font-extrabold transition-transform duration-300 ease-in-out"
      >
        {randomWord}
      </h1>

      <button
        onClick={handleButtonClick}
        className="px-8 py-4 bg-yellow-500 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none"
      >
        Click Me!
      </button>
    </div>
  );
}

