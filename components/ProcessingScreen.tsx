
import React, { useState, useEffect } from 'react';

const messages = [
  "Analyzing your essence...",
  "Decoding your colors...",
  "Connecting with the cosmos...",
  "Reading your spiritual frequency...",
  "Unveiling your inner light...",
];

const ProcessingScreen: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-cyan-500/20 h-96">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 bg-purple-500 rounded-full opacity-75 animate-ping"></div>
        <div className="absolute inset-2 bg-cyan-400 rounded-full opacity-75 animate-ping [animation-delay:0.5s]"></div>
        <div className="relative flex items-center justify-center w-full h-full bg-slate-700 rounded-full">
            <svg className="w-12 h-12 text-purple-300 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 0-9-9" />
            </svg>
        </div>
      </div>
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
        Processing Your Aura
      </h2>
      <p className="text-slate-300 text-lg transition-opacity duration-500">
        {messages[currentMessageIndex]}
      </p>
    </div>
  );
};

export default ProcessingScreen;
