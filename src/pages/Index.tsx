import React from "react";
import AnimatedWaveform from "../components/AnimatedWaveform";
import ChatCard from "../components/ChatCard";
import { useElevenLabs } from "../context/ElevenLabsContext";

const Index = () => {
  const { isRecording } = useElevenLabs();

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated cyan waveform background */}
      <AnimatedWaveform isSpeaking={isRecording} />
      
      {/* Plane image background - positioned at bottom of viewport, full width of content area */}
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{
          backgroundImage: 'url(/bplane.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
          backgroundRepeat: 'no-repeat',
          height: '60vh',
          minHeight: '400px',
          width: '100%'
        }}
        aria-hidden="true"
      />
      
      {/* Chat card positioned above the plane */}
      <div className="relative z-20">
        <ChatCard />
      </div>
    </main>
  );
};

export default Index;
