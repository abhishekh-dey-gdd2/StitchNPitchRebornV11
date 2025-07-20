import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface FailAnimationProps {
  isActive: boolean;
  guideName: string;
  onClose: () => void;
  isElite?: boolean;
}

const FailAnimation: React.FC<FailAnimationProps> = ({ isActive, guideName, onClose, isElite = false }) => {
  if (!isActive) return null;

  const funnyMessages = [
    "Oops! Better luck next time! 😅",
    "Not today, champion! 🎭",
    "The universe has other plans! 🌟",
    "Plot twist! Try again! 🎬",
    "Almost there! Keep trying! 💪",
    "The stars weren't aligned! ⭐",
    "Mission failed successfully! 🎯",
    "Error 404: Winner not found! 🤖"
  ];

  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <style>
        {`
          .red-glass-morphism {
            background: linear-gradient(135deg, 
              rgba(239, 68, 68, 0.15) 0%,
              rgba(220, 38, 38, 0.1) 25%,
              rgba(248, 113, 113, 0.08) 50%,
              rgba(220, 38, 38, 0.1) 75%,
              rgba(239, 68, 68, 0.15) 100%
            );
            backdrop-filter: blur(20px);
            border: 2px solid rgba(239, 68, 68, 0.3);
            box-shadow: 
              0 8px 32px rgba(239, 68, 68, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          
          .red-pulse {
            animation: red-pulse 1.5s ease-in-out infinite;
            will-change: transform, opacity;
          }
          
          @keyframes red-pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          
          .fail-bounce {
            animation: fail-bounce 0.8s ease-out;
            will-change: transform, opacity;
          }
          
          @keyframes fail-bounce {
            0% { transform: scale(0) rotate(-180deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(-90deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          
          .fail-shake {
            animation: fail-shake 0.5s ease-in-out infinite;
            will-change: transform;
          }
          
          @keyframes fail-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          
          .fail-float {
            animation: fail-float 2s ease-in-out infinite;
            will-change: transform;
          }
          
          @keyframes fail-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .fail-emoji {
            animation: fail-emoji-spin 1s linear infinite;
            will-change: transform;
          }
          
          @keyframes fail-emoji-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-70 backdrop-blur-sm overflow-y-auto"
        onClick={handleClose}
      >
        <div 
          className="red-glass-morphism rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-md md:max-w-lg w-full max-h-[75vh] overflow-y-auto shadow-2xl text-center fail-bounce relative my-auto mt-24"
          onClick={handleModalClick}
        >
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-red-200 hover:text-white transition-colors bg-black bg-opacity-30 rounded-full p-1.5 sm:p-2 hover:bg-opacity-50 z-10 backdrop-blur-sm border border-red-400 border-opacity-30"
            type="button"
          >
            <X className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          {/* Red Alert Icons */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="absolute red-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1.5}s`
                }}
              >
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
              </div>
            ))}
          </div>

          {/* Animated Emojis */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            {isElite ? (
              <>
                <span className="text-3xl sm:text-4xl md:text-6xl fail-emoji">👑</span>
                <span className="text-3xl sm:text-4xl md:text-6xl fail-float">🎭</span>
                <span className="text-3xl sm:text-4xl md:text-6xl fail-shake">⚔️</span>
              </>
            ) : (
              <>
                <span className="text-3xl sm:text-4xl md:text-6xl fail-emoji">😅</span>
                <span className="text-3xl sm:text-4xl md:text-6xl fail-float">🎭</span>
                <span className="text-3xl sm:text-4xl md:text-6xl fail-shake">😂</span>
              </>
            )}
          </div>
          
          {/* Main Message */}
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4 fail-shake ${
            isElite ? 'text-yellow-300' : 'text-red-200'
          }`}>
            {isElite ? 'NOT ELITE!' : 'OOPS!'}
          </h1>
          
          <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 backdrop-blur-sm border ${
            isElite 
              ? 'bg-black bg-opacity-30 border-yellow-400 border-opacity-50' 
              : 'bg-black bg-opacity-30 border-red-400 border-opacity-50'
          }`}>
            <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 break-words ${
              isElite ? 'text-yellow-200' : 'text-red-200'
            }`}>
              {guideName}
            </h2>
            <p className={`text-sm sm:text-base md:text-xl opacity-90 break-words ${
              isElite ? 'text-yellow-100' : 'text-red-100'
            }`}>
              {randomMessage}
            </p>
          </div>
          
          {/* Funny Animation Elements */}
          <div className="flex justify-center gap-2 sm:gap-4 md:gap-8 mb-4 sm:mb-6">
            {isElite ? (
              <>
                <div className="text-2xl sm:text-3xl md:text-4xl fail-float" style={{ animationDelay: '0.2s' }}>🏰</div>
                <div className="text-2xl sm:text-3xl md:text-4xl fail-float" style={{ animationDelay: '0.4s' }}>⚡</div>
                <div className="text-2xl sm:text-3xl md:text-4xl fail-float" style={{ animationDelay: '0.6s' }}>🌟</div>
                <div className="text-2xl sm:text-3xl md:text-4xl fail-float" style={{ animationDelay: '0.8s' }}>🎯</div>
              </>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl md:text-4xl fail-float" style={{ animationDelay: '0.2s' }}>🎪</div>
                <div className="text-2xl sm:text-3xl md:text-4xl fail-float" style={{ animationDelay: '0.4s' }}>🎨</div>
                <div className="text-2xl sm:text-3xl md:text-4xl fail-float" style={{ animationDelay: '0.6s' }}>🎵</div>
                <div className="text-2xl sm:text-3xl md:text-4xl fail-float" style={{ animationDelay: '0.8s' }}>🎲</div>
              </>
            )}
          </div>
          
          <div className={`text-sm sm:text-base md:text-lg opacity-80 mb-4 sm:mb-6 px-2 ${
            isElite ? 'text-yellow-200' : 'text-red-200'
          }`}>
            {isElite ? "The royal quest continues! Keep striving for greatness! 👑✨" : "Don't worry, every great story has plot twists! 📚✨"}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all transform hover:scale-105 font-semibold text-sm sm:text-base backdrop-blur-sm z-10 relative ${
              isElite 
                ? 'bg-yellow-600 bg-opacity-80 text-white hover:bg-opacity-90 border border-yellow-400 shadow-lg' 
                : 'bg-red-600 bg-opacity-80 text-white hover:bg-opacity-90 border border-red-400 shadow-lg'
            }`}
            type="button"
          >
            {isElite ? 'Continue Elite Quest' : 'Try Again'}
          </button>
        </div>
      </div>
    </>
  );
};

export default FailAnimation;