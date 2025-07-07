import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AnimatedWaveformProps {
  isSpeaking: boolean;
  className?: string;
}

const AnimatedWaveform: React.FC<AnimatedWaveformProps> = ({ isSpeaking, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const windowX = window.innerWidth;
    const windowY = window.innerHeight;
    const amountX = 50;
    const amountY = 50;
    const SEPARATION = windowX / amountX;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(45, windowX / windowY, 1, 10000);
    camera.position.z = 1000;
    camera.position.y = 250;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles
    const numParticles = amountX * amountY;
    const positions = new Float32Array(numParticles * 3);

    let i = 0;
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        positions[i] = ix * SEPARATION - (amountX * SEPARATION) / 2; // x
        positions[i + 1] = 0; // y
        positions[i + 2] = iy * SEPARATION - (amountY * SEPARATION) / 2; // z
        i += 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Create circle texture for particles
    const createCircleTexture = (color: string, size: number) => {
      const matCanvas = document.createElement("canvas");
      matCanvas.width = matCanvas.height = size;
      const matContext = matCanvas.getContext("2d");
      const texture = new THREE.Texture(matCanvas);
      const center = size / 2;
      
      if (matContext) {
        matContext.beginPath();
        matContext.arc(center, center, size / 2, 0, 2 * Math.PI, false);
        matContext.closePath();
        matContext.fillStyle = color;
        matContext.fill();
      }
      
      texture.needsUpdate = true;
      return texture;
    };

    const material = new THREE.PointsMaterial({
      size: 10,
      map: createCircleTexture("#3b82f6", 256), // Blue color matching the original
      transparent: true,
      depthWrite: false,
      opacity: isSpeaking ? 0.8 : 0.3
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Handle window resize
    const onWindowResize = () => {
      const newWindowX = window.innerWidth;
      const newWindowY = window.innerHeight;
      
      if (cameraRef.current) {
        cameraRef.current.aspect = newWindowX / newWindowY;
        cameraRef.current.updateProjectionMatrix();
      }
      
      if (rendererRef.current) {
        rendererRef.current.setSize(newWindowX, newWindowY);
      }
    };

    window.addEventListener("resize", onWindowResize);

    // Animation variables
    let count = 0;
    const waveFrequency = 0.2;
    const waveLength = 0.5;
    const waveHeightFTB = 50;
    const waveHeightRTL = 50;

    // Animation loop
    const animate = () => {
      if (!particlesRef.current || !cameraRef.current || !sceneRef.current || !rendererRef.current) return;

      cameraRef.current.lookAt(sceneRef.current.position);

      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      let i = 0;

      // Adjust wave intensity based on speaking state
      const intensity = isSpeaking ? 1.0 : 0.3;
      const speed = isSpeaking ? 0.1 : 0.05;

      for (let ix = 0; ix < amountX; ix++) {
        for (let iy = 0; iy < amountY; iy++) {
          positions[i + 1] =
            Math.sin((ix + count) * waveFrequency) * waveHeightRTL * intensity +
            Math.sin((iy + count) * waveLength) * waveHeightFTB * intensity;
          i += 3;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;

      // Update particle opacity based on speaking state
      if (particlesRef.current.material instanceof THREE.PointsMaterial) {
        particlesRef.current.material.opacity = isSpeaking ? 0.8 : 0.3;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      count += speed;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        if (particlesRef.current.material instanceof THREE.PointsMaterial) {
          particlesRef.current.material.dispose();
        }
      }
    };
  }, [isSpeaking]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ 
        zIndex: 0,
        background: 'radial-gradient(circle at center, #EFFEFD 0%, #F7EEE7 100%)'
      }}
    />
  );
};

export default AnimatedWaveform; 