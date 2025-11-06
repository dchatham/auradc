
import React, { useState, useCallback } from 'react';
import { AppState, AuraReading } from './types';
import StartScreen from './components/StartScreen';
import CameraView from './components/CameraView';
import ProcessingScreen from './components/ProcessingScreen';
import ReadoutScreen from './components/ReadoutScreen';
import { getAuraReading } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('start');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [auraReading, setAuraReading] = useState<AuraReading | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setError(null);
    setAppState('camera');
  };

  const handleCapture = useCallback(async (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setAppState('processing');
    try {
      const reading = await getAuraReading(imageDataUrl);
      setAuraReading(reading);
      setAppState('readout');
    } catch (err) {
      console.error(err);
      setError('Failed to connect with the cosmos. Please try again.');
      setAppState('start');
    }
  }, []);

  const handleReset = () => {
    setAppState('start');
    setCapturedImage(null);
    setAuraReading(null);
    setError(null);
  };

  const renderContent = () => {
    switch (appState) {
      case 'camera':
        return <CameraView onCapture={handleCapture} />;
      case 'processing':
        return <ProcessingScreen />;
      case 'readout':
        if (capturedImage && auraReading) {
          return <ReadoutScreen image={capturedImage} reading={auraReading} onReset={handleReset} />;
        }
        // Fallback if state is inconsistent
        handleReset();
        return null;
      case 'start':
      default:
        return <StartScreen onStart={handleStart} error={error} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
