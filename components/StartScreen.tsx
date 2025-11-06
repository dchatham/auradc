
import React from 'react';
import { SparklesIcon } from './icons';

interface StartScreenProps {
  onStart: () => void;
  error: string | null;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, error }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-cyan-500/20">
      <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
        Aura Vision
      </h1>
      <p className="text-slate-300 max-w-md mx-auto mb-8 text-lg">
        Unlock the secrets of your spiritual energy. Gaze into the camera and let us reveal the colors of your soul.
      </p>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Oh no! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <button
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-br from-purple-600 to-blue-500 rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300/50 transform hover:scale-105"
      >
        <span className="absolute left-0 top-0 w-full h-full bg-white opacity-10 group-hover:opacity-20 transition-opacity duration-300"></span>
        <SparklesIcon className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:rotate-12" />
        Begin Your Reading
      </button>
    </div>
  );
};

export default StartScreen;
