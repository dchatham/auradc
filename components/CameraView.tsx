import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraViewProps {
  onCapture: (imageDataUrl: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const startVideo = useCallback(async () => {
    // Stop any existing stream
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 720 },
                height: { ideal: 720 },
                facingMode: 'user'
            }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          videoRef.current.onloadedmetadata = () => {
              setIsCameraReady(true);
          }
        }
      } catch (err) {
        console.error("Error accessing camera", err);
        if (err instanceof Error && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
             setError("Camera access was denied. Please enable camera permissions in your browser settings to continue.");
        } else {
             setError("Could not access the camera. Please ensure it's not in use by another application and is connected properly.");
        }
      }
    } else {
      setError("Your browser does not support camera access.");
    }
  }, []);

  useEffect(() => {
    startVideo();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [startVideo]);

  const handleCaptureClick = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // Flip the image horizontally to match the user's view
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        // Apply a blur filter before drawing the image to the canvas
        context.filter = 'blur(10px)';
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Draw visual effects on top
        context.filter = 'none'; // reset filter
        context.globalCompositeOperation = 'overlay';

        // This part is tricky as DOM effects aren't on the canvas. 
        // We capture the video, not the effects. The effects are for the live view.
        // A more advanced version might recreate effects on the canvas before capture.
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-cyan-500/20">
      <div className="relative w-full max-w-lg aspect-square rounded-lg overflow-hidden shadow-lg mb-6">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scaleX-[-1] blur-lg"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Aura visual effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            <div className="aura-mist rounded-lg"></div>
            <div className="aura-shimmer"></div>
            <div className="aura-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="aura-pulse" style={{ animationDelay: '-1s' }}></div>
            <div className="aura-pulse" style={{ animationDelay: '-2s' }}></div>
        </div>

        {/* Glowing Halo Guide */}
        <div className="absolute inset-0 border-4 border-cyan-400/50 rounded-lg [animation:halo-breathe_4s_ease-in-out_infinite] pointer-events-none"></div>

        {!isCameraReady && !error && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center text-white text-xl z-10">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Initializing camera...
            </div>
        )}
      </div>

      {error ? (
        <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <p className="text-slate-300 text-lg mb-4 text-center">
            {isCameraReady ? "Gaze into the lens. Center yourself within the halo." : "Waiting for camera..."}
          </p>
          <button
            onClick={handleCaptureClick}
            disabled={!isCameraReady}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-br from-purple-600 to-blue-500 rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Capture Aura
          </button>
        </>
      )}
    </div>
  );
};

export default CameraView;