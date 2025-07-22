import React from 'react';

interface ConfettiAnimationProps {
  isActive: boolean;
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ isActive }) => {
  if (!isActive) return null;

  // Generate 50 confetti pieces with random properties
  const confettiPieces = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className={`confetti-piece confetti-piece-${i % 6}`}
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 2}s`
      }}
    />
  ));

  return (
    <>
      <style>
        {`
          .confetti-piece {
            position: fixed;
            width: 10px;
            height: 10px;
            top: -10px;
            z-index: 1000;
            animation: confetti-fall linear infinite;
          }
          
          .confetti-piece-0 { background-color: #ff6b6b; }
          .confetti-piece-1 { background-color: #4ecdc4; }
          .confetti-piece-2 { background-color: #45b7d1; }
          .confetti-piece-3 { background-color: #96ceb4; }
          .confetti-piece-4 { background-color: #ffeaa7; }
          .confetti-piece-5 { background-color: #dda0dd; }
          
          @keyframes confetti-fall {
            to {
              transform: translateY(100vh) rotate(720deg);
            }
          }
        `}
      </style>
      <div className="fixed inset-0 pointer-events-none z-50">
        {confettiPieces}
      </div>
    </>
  );
};

export default ConfettiAnimation;