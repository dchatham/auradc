import React, { useState } from 'react';
import { AuraReading } from '../types';
import { SparklesIcon, EyeIcon, StarIcon, BookOpenIcon, RefreshIcon } from './icons';

interface ReadoutScreenProps {
  image: string;
  reading: AuraReading;
  onReset: () => void;
}

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20 shadow-lg backdrop-blur-md h-full">
        <div className="flex items-center mb-3">
            {icon}
            <h3 className="text-xl font-bold text-cyan-300 ml-3">{title}</h3>
        </div>
        <p className="text-slate-300 text-base leading-relaxed">{children}</p>
    </div>
);


const ReadoutScreen: React.FC<ReadoutScreenProps> = ({ image, reading, onReset }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000); // Reset after 2 seconds
  };

  return (
    <div className="flex flex-col items-center w-full p-4 md:p-6 bg-slate-900/70 rounded-2xl shadow-2xl backdrop-blur-lg border border-cyan-500/20 animate-[fadeIn_1s_ease-in-out]">
        <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        `}</style>
      <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6">
        Your Aura Revealed
      </h2>
      
      <div className="w-full h-3 mb-8 rounded-full bg-gradient-to-r from-violet-500 via-blue-500 via-green-400 via-yellow-300 to-red-500 animate-[spectrum-glow_4s_ease-in-out_infinite]"></div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="lg:col-span-1 w-full aspect-square rounded-lg overflow-hidden shadow-lg border border-purple-500/30 relative">
            <img src={image} alt="Your captured aura" className="w-full h-full object-cover transform scaleX-[-1]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-cyan-400/20 mix-blend-color-dodge pointer-events-none"></div>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6 justify-center">
            <InfoCard title="Aura Color" icon={<SparklesIcon className="w-6 h-6 text-purple-400" />}>
                {reading.auraColorInsight}
            </InfoCard>
            <InfoCard title="Future Glimpse" icon={<EyeIcon className="w-6 h-6 text-purple-400" />}>
                {reading.futureGlimpse}
            </InfoCard>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20 shadow-lg backdrop-blur-md">
                <h3 className="text-xl font-bold text-cyan-300 mb-4">Primary Aura Colors</h3>
                <div className="flex justify-around items-center gap-4">
                    {reading.primaryColors.map((color) => (
                        <div key={color} className="flex flex-col items-center gap-2 group">
                            <button
                                onClick={() => handleCopy(color)}
                                className="w-16 h-16 rounded-full border-2 border-slate-600 shadow-md transition-all duration-300 ease-in-out transform group-hover:scale-110 group-hover:shadow-lg"
                                style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
                                aria-label={`Copy color ${color}`}
                            />
                            <div className="relative">
                                <span 
                                    className={`absolute bottom-full mb-2 w-28 text-center text-sm font-mono px-2 py-1 bg-slate-700 text-white rounded-md transition-all duration-300 ease-in-out ${copiedColor === color ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                >
                                    {copiedColor === color ? 'Copied!' : `Click to copy ${color}`}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-[fadeIn_0.5s_ease-in-out]">
          <InfoCard title="Angel Number" icon={<StarIcon className="w-6 h-6 text-purple-400" />}>
              Your guiding number is <span className="font-bold text-white">{reading.angelNumber}</span>. Keep an eye out for it as a sign of alignment and encouragement from your spiritual guides.
          </InfoCard>
          <InfoCard title="Spiritual Guidance" icon={<BookOpenIcon className="w-6 h-6 text-purple-400" />}>
              {reading.spiritualGuidance}
          </InfoCard>
      </div>
      
      <button 
        onClick={onReset}
        className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-slate-300 bg-slate-800/70 rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:bg-slate-700/90 focus:outline-none focus:ring-2 focus:ring-slate-500 mt-4"
      >
        <RefreshIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-rotate-90" />
        Read Another Aura
      </button>

    </div>
  );
};

export default ReadoutScreen;