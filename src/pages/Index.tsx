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
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10 flex justify-center" aria-hidden="true">
        <img 
          src="/bplane.png" 
          alt="Plane background" 
          className="w-screen max-w-none h-auto object-cover object-bottom"
          style={{ minHeight: '200px' }}
        />
      </div>
      
      {/* Chat card positioned above the plane */}
      <div className="relative z-20">
        <ChatCard />
      </div>
    </main>
  );
};

export default Index;
