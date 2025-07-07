import React, { useEffect, useRef } from 'react';

interface AnimatedWaveformProps {
  isSpeaking: boolean;
  className?: string;
}

const AnimatedWaveform: React.FC<AnimatedWaveformProps> = ({ isSpeaking, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create radial gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, '#EFFEFD');
      gradient.addColorStop(1, '#F7EEE7');
      
      // Fill the background with the gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (isSpeaking) {
        // Create animated waveform when speaking
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 2) {
          const y = canvas.height / 2 + 
            Math.sin(x * 0.01 + time) * 50 * (0.5 + Math.random() * 0.5) +
            Math.sin(x * 0.02 + time * 1.5) * 30 * (0.3 + Math.random() * 0.7) +
            Math.sin(x * 0.005 + time * 0.5) * 80 * (0.2 + Math.random() * 0.8);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        
        // Add multiple layers for depth
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 3) {
          const y = canvas.height / 2 + 
            Math.sin(x * 0.015 + time * 1.2) * 40 * (0.4 + Math.random() * 0.6) +
            Math.sin(x * 0.025 + time * 0.8) * 25 * (0.5 + Math.random() * 0.5);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        
        // Add subtle background waves
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 4) {
          const y = canvas.height / 2 + 
            Math.sin(x * 0.008 + time * 0.3) * 60 * (0.3 + Math.random() * 0.7);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        
        time += 0.05;
      } else {
        // Static waveform when not speaking
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.lineWidth = 30;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 4) {
          const y = canvas.height / 2 + 
            Math.sin(x * 0.01) * 30 * (0.3 + Math.random() * 0.7);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedWaveform; 