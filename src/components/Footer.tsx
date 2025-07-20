import React, { useState } from 'react';
import { Heart, Code, Coffee, Sparkles, Zap, Star, Rocket } from 'lucide-react';

const Footer: React.FC = () => {
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showSecretMessage, setShowSecretMessage] = useState(false);

  const handleNameClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount + 1 === 5) {
      setEasterEggActive(true);
      setShowSecretMessage(true);
      
      // Reset after 5 seconds
      setTimeout(() => {
        setEasterEggActive(false);
        setShowSecretMessage(false);
        setClickCount(0);
      }, 5000);
    } else if (clickCount >= 5) {
      setClickCount(0);
    }
  };

  const secretMessages = [
    "🎉 You found the secret! Abhishekh loves building amazing things!",
    "✨ Easter egg activated! This footer was crafted with extra love!",
    "🚀 Secret unlocked! Thanks for exploring every corner!",
    "💫 Hidden feature discovered! You're awesome!",
    "🎯 Congratulations! You found the developer's secret!"
  ];

  const randomMessage = secretMessages[Math.floor(Math.random() * secretMessages.length)];

  return (
    <>
      <style>
        {`
          .footer-glow {
            animation: footer-glow 3s ease-in-out infinite;
          }
          
          @keyframes footer-glow {
            0%, 100% { box-shadow: 0 -2px 10px rgba(139, 92, 246, 0.3); }
            50% { box-shadow: 0 -2px 20px rgba(139, 92, 246, 0.6); }
          }
          
          .easter-egg-bounce {
            animation: easter-egg-bounce 0.6s ease-out;
          }
          
          @keyframes easter-egg-bounce {
            0% { transform: scale(0) rotate(-180deg); }
            50% { transform: scale(1.2) rotate(-90deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          
          .rainbow-text {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: rainbow-flow 2s ease-in-out infinite;
          }
          
          @keyframes rainbow-flow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .sparkle-dance {
            animation: sparkle-dance 1s ease-in-out infinite;
          }
          
          @keyframes sparkle-dance {
            0%, 100% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(90deg) scale(1.2); }
            50% { transform: rotate(180deg) scale(0.8); }
            75% { transform: rotate(270deg) scale(1.1); }
          }
          
          .secret-message-slide {
            animation: secret-message-slide 0.5s ease-out;
          }
          
          @keyframes secret-message-slide {
            0% { 
              opacity: 0; 
              transform: translateY(20px) scale(0.9);
            }
            100% { 
              opacity: 1; 
              transform: translateY(0) scale(1);
            }
          }
          
          .floating-icons {
            animation: floating-icons 3s ease-in-out infinite;
          }
          
          @keyframes floating-icons {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
        `}
      </style>

      {/* Secret Message Overlay */}
      {showSecretMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl easter-egg-bounce">
            <div className="mb-4">
              <Rocket className="w-16 h-16 text-white mx-auto sparkle-dance" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">🎉 Easter Egg Found! 🎉</h2>
            <p className="text-white text-lg mb-6">{randomMessage}</p>
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-300 fill-current sparkle-dance" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <footer className={`relative bg-black bg-opacity-30 backdrop-blur-md border-t border-white border-opacity-20 py-4 px-4 ${easterEggActive ? 'footer-glow' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            {/* Floating Icons */}
            <div className="flex items-center gap-2">
              <Code className={`w-4 h-4 text-purple-300 floating-icons ${easterEggActive ? 'sparkle-dance' : ''}`} style={{ animationDelay: '0s' }} />
              <Coffee className={`w-4 h-4 text-amber-300 floating-icons ${easterEggActive ? 'sparkle-dance' : ''}`} style={{ animationDelay: '0.5s' }} />
              <Heart className={`w-4 h-4 text-red-300 floating-icons ${easterEggActive ? 'sparkle-dance' : ''}`} style={{ animationDelay: '1s' }} />
            </div>

            {/* Main Text */}
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center">
              <span className="text-white text-sm sm:text-base">
                Imagined, Designed and Developed with
              </span>
              <Heart className={`w-4 h-4 text-red-400 ${easterEggActive ? 'sparkle-dance' : 'animate-pulse'}`} />
              <span className="text-white text-sm sm:text-base">by</span>
              
              {/* Developer Name - Clickable Easter Egg */}
              <button
                onClick={handleNameClick}
                className={`font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 focus:outline-none ${
                  easterEggActive 
                    ? 'rainbow-text text-lg sm:text-xl' 
                    : 'text-purple-300 hover:text-purple-200'
                }`}
              >
                Abhishekh Dey
              </button>

              {/* Sparkles for Easter Egg */}
              {easterEggActive && (
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-yellow-400 sparkle-dance" />
                  <Zap className="w-4 h-4 text-blue-400 sparkle-dance" style={{ animationDelay: '0.3s' }} />
                  <Sparkles className="w-4 h-4 text-pink-400 sparkle-dance" style={{ animationDelay: '0.6s' }} />
                </div>
              )}
            </div>

            {/* More Floating Icons */}
            <div className="flex items-center gap-2">
              <Rocket className={`w-4 h-4 text-blue-300 floating-icons ${easterEggActive ? 'sparkle-dance' : ''}`} style={{ animationDelay: '1.5s' }} />
              <Star className={`w-4 h-4 text-yellow-300 floating-icons ${easterEggActive ? 'sparkle-dance' : ''}`} style={{ animationDelay: '2s' }} />
              <Sparkles className={`w-4 h-4 text-purple-300 floating-icons ${easterEggActive ? 'sparkle-dance' : ''}`} style={{ animationDelay: '2.5s' }} />
            </div>
          </div>

          {/* Click Counter Hint */}
          {clickCount > 0 && clickCount < 5 && !easterEggActive && (
            <div className="text-center mt-2">
              <p className="text-purple-200 text-xs secret-message-slide">
                🤔 Keep clicking... {5 - clickCount} more to go!
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="text-center mt-2">
            <p className="text-white text-opacity-60 text-xs">
              © 2025 Stitch n Pitch $ Elite Spiral •
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;