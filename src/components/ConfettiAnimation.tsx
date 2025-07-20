import React, { useEffect, useState } from 'react';

interface ConfettiAnimationProps {
  isActive: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
  duration?: number; // in seconds, 0 means infinite
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'square' | 'triangle';
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ 
  isActive, 
  intensity = 'medium',
  duration = 0 // 0 means infinite
}) => {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [animationId, setAnimationId] = useState<number | null>(null);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#FFD700', '#FF69B4', '#00CED1', '#FF4500', '#9370DB'
  ];

  const intensityConfig = {
    light: { count: 30, spawnRate: 3 },
    medium: { count: 50, spawnRate: 5 },
    heavy: { count: 80, spawnRate: 8 }
  };

  const createConfettiPiece = (id: number): ConfettiPiece => {
    return {
      id,
      x: Math.random() * window.innerWidth,
      y: -20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4, // 4-12px
      speedX: (Math.random() - 0.5) * 4, // -2 to 2
      speedY: Math.random() * 3 + 2, // 2-5
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10, // -5 to 5
      shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle'
    };
  };

  const updateConfetti = () => {
    setConfettiPieces(prevPieces => {
      const updatedPieces = prevPieces
        .map(piece => ({
          ...piece,
          x: piece.x + piece.speedX,
          y: piece.y + piece.speedY,
          rotation: piece.rotation + piece.rotationSpeed,
          speedY: piece.speedY + 0.1 // gravity
        }))
        .filter(piece => piece.y < window.innerHeight + 50 && piece.x > -50 && piece.x < window.innerWidth + 50);

      // Add new pieces if needed
      const config = intensityConfig[intensity];
      if (updatedPieces.length < config.count && isActive) {
        const newPieces = [];
        for (let i = 0; i < config.spawnRate; i++) {
          newPieces.push(createConfettiPiece(Date.now() + i));
        }
        return [...updatedPieces, ...newPieces];
      }

      return updatedPieces;
    });
  };

  useEffect(() => {
    if (!isActive) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        setAnimationId(null);
      }
      setConfettiPieces([]);
      return;
    }

    // Initialize confetti pieces
    const config = intensityConfig[intensity];
    const initialPieces = [];
    for (let i = 0; i < config.count; i++) {
      initialPieces.push(createConfettiPiece(i));
    }
    setConfettiPieces(initialPieces);

    // Start animation loop
    const animate = () => {
      updateConfetti();
      const id = requestAnimationFrame(animate);
      setAnimationId(id);
    };

    const id = requestAnimationFrame(animate);
    setAnimationId(id);

    // Auto-stop after duration if specified
    let timeoutId: NodeJS.Timeout | null = null;
    if (duration > 0) {
      timeoutId = setTimeout(() => {
        if (animationId) {
          cancelAnimationFrame(animationId);
          setAnimationId(null);
        }
        setConfettiPieces([]);
      }, duration * 1000);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isActive, intensity, duration]);

  if (!isActive || confettiPieces.length === 0) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          style={{
            position: 'absolute',
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            width: piece.shape === 'triangle' ? '0' : `${piece.size}px`,
            height: piece.shape === 'triangle' ? '0' : `${piece.size}px`,
            backgroundColor: piece.shape === 'triangle' ? 'transparent' : piece.color,
            borderLeft: piece.shape === 'triangle' ? `${piece.size/2}px solid transparent` : 'none',
            borderRight: piece.shape === 'triangle' ? `${piece.size/2}px solid transparent` : 'none',
            borderBottom: piece.shape === 'triangle' ? `${piece.size}px solid ${piece.color}` : 'none',
            borderRadius: piece.shape === 'circle' ? '50%' : '0',
            transform: `rotate(${piece.rotation}deg)`,
            opacity: 0.9
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiAnimation;