import React from 'react';

const DynamicOrbs: React.FC = () => {
  // Generate multiple orbs with different sizes, colors, and animation delays
  const orbs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 40, // 40-120px
    color: [
      'from-purple-400 to-indigo-600',
      'from-pink-400 to-purple-600',
      'from-indigo-400 to-purple-600',
      'from-violet-400 to-purple-600',
      'from-fuchsia-400 to-pink-600',
      'from-purple-500 to-indigo-600',
      'from-pink-500 to-purple-600',
      'from-indigo-500 to-purple-600'
    ][i % 8],
    duration: Math.random() * 10 + 15, // 15-25s
    delay: Math.random() * 5, // 0-5s delay
    startX: Math.random() * 80 + 10, // 10-90% to keep on screen
    startY: Math.random() * 80 + 10, // 10-90% to keep on screen
    direction: Math.random() > 0.5 ? 1 : -1 // Random direction
  }));

  return (
    <>
      <style>
        {`
          @keyframes float-gentle {
            0% { 
              transform: translate(0px, 0px) rotate(0deg) scale(1); 
              opacity: 0.4;
            }
            25% { 
              transform: translate(100px, -80px) rotate(90deg) scale(1.1); 
              opacity: 0.6;
            }
            50% { 
              transform: translate(-60px, -120px) rotate(180deg) scale(0.9); 
              opacity: 0.5;
            }
            75% { 
              transform: translate(-120px, -40px) rotate(270deg) scale(1.05); 
              opacity: 0.7;
            }
            100% { 
              transform: translate(0px, 0px) rotate(360deg) scale(1); 
              opacity: 0.4;
            }
          }
          
          @keyframes float-gentle-reverse {
            0% { 
              transform: translate(0px, 0px) rotate(0deg) scale(1); 
              opacity: 0.4;
            }
            25% { 
              transform: translate(-100px, -80px) rotate(-90deg) scale(1.1); 
              opacity: 0.6;
            }
            50% { 
              transform: translate(60px, -120px) rotate(-180deg) scale(0.9); 
              opacity: 0.5;
            }
            75% { 
              transform: translate(120px, -40px) rotate(-270deg) scale(1.05); 
              opacity: 0.7;
            }
            100% { 
              transform: translate(0px, 0px) rotate(-360deg) scale(1); 
              opacity: 0.4;
            }
          }
          
          @keyframes pulse-soft {
            0%, 100% { 
              filter: blur(15px) brightness(1); 
            }
            50% { 
              filter: blur(25px) brightness(1.3); 
            }
          }
          
          .dynamic-orb {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            will-change: transform, opacity;
            animation-fill-mode: both;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
          }
          
          .orb-normal {
            animation: float-gentle var(--duration) infinite ease-in-out, pulse-soft var(--pulse-duration) infinite ease-in-out;
          }
          
          .orb-reverse {
            animation: float-gentle-reverse var(--duration) infinite ease-in-out, pulse-soft var(--pulse-duration) infinite ease-in-out;
          }
        `}
      </style>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className={`dynamic-orb ${orb.direction === 1 ? 'orb-normal' : 'orb-reverse'} bg-gradient-to-br ${orb.color}`}
            style={{
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              left: `${orb.startX}%`,
              top: `${orb.startY}%`,
              '--duration': `${orb.duration}s`,
              '--pulse-duration': `${orb.duration * 0.6}s`,
              animationDelay: `${orb.delay}s, ${orb.delay * 0.3}s`
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
};

export default DynamicOrbs;