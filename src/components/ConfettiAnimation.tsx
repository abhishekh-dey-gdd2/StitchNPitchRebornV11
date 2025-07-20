import React, { useEffect, useState } from 'react';

interface ConfettiAnimationProps {
  isActive: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  shape: 'circle' | 'square' | 'triangle';
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ 
  isActive, 
  intensity = 'medium' 
}) => {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];

  const intensityConfig = {
    light: { count: 30, interval: 2000 },
    medium: { count: 50, interval: 1500 },
    heavy: { count: 80, interval: 1000 }
  };

  const generateConfetti = () => {
    const config = intensityConfig[intensity];
    const pieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < config.count; i++) {
      pieces.push({
        id: Math.random() * 10000,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4, // 4-12px
        delay: Math.random() * 3,
        duration: Math.random() * 3 + 3, // 3-6 seconds
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle'
      });
    }
    
    setConfettiPieces(pieces);
  };

  useEffect(() => {
    if (!isActive) {
      setConfettiPieces([]);
      return;
    }

    // Generate initial confetti
    generateConfetti();

    // Continuously generate new confetti
    const interval = setInterval(() => {
      if (isActive) {
        generateConfetti();
      }
    }, intensityConfig[intensity].interval);

    return () => clearInterval(interval);
  }, [isActive, intensity]);

  if (!isActive || confettiPieces.length === 0) return null;

  return (
    <>
      <style>
        {`
          .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
          }
          
          .confetti-piece {
            position: absolute;
            top: -20px;
            animation: confetti-fall linear infinite;
            will-change: transform;
          }
          
          .confetti-circle {
            border-radius: 50%;
          }
          
          .confetti-square {
            border-radius: 0;
          }
          
          .confetti-triangle {
            width: 0 !important;
            height: 0 !important;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 10px solid;
          }
          
          @keyframes confetti-fall {
            0% {
              transform: translateY(-20px) rotate(0deg);
              opacity: 1;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 0.7;
            }
            100% {
              transform: translateY(calc(100vh + 50px)) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
      
      <div className="confetti-container">
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className={`confetti-piece confetti-${piece.shape}`}
            style={{
              left: `${piece.x}%`,
              width: piece.shape === 'triangle' ? '0' : `${piece.size}px`,
              height: piece.shape === 'triangle' ? '0' : `${piece.size}px`,
              backgroundColor: piece.shape === 'triangle' ? 'transparent' : piece.color,
              borderBottomColor: piece.shape === 'triangle' ? piece.color : 'transparent',
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`
            }}
          />
        ))}
      </div>
    </>
  );
};

export default ConfettiAnimation;