import React from 'react';
import { Trophy, Home, BarChart3, Download, Database, Crown, LogOut, Menu, X } from 'lucide-react';

interface NavigationProps {
  currentTab: 'selection' | 'winners' | 'elite-spiral';
  onTabChange: (tab: 'selection' | 'winners' | 'elite-spiral') => void;
  winnerCount: number;
  eliteWinnerCount: number;
  onOpenWinHistoryDashboard: () => void;
  onOpenExportData: () => void;
  onOpenBackupRestore: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  winnerCount,
  eliteWinnerCount,
  onOpenWinHistoryDashboard,
  onOpenExportData,
  onOpenBackupRestore,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogoClick = () => {
    onTabChange('selection');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black bg-opacity-20 backdrop-blur-md border-b border-white border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
          {/* Logo - Clickable */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <img 
                src="/stitch-n-pitch-logo.png" 
                alt="Stitch n Pitch Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-lg sm:rounded-xl object-cover drop-shadow-lg border-2 border-white border-opacity-30"
              />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-white">
                <span className="hidden sm:inline">Stitch n Pitch Portal</span>
                <span className="sm:hidden">Stitch n Pitch</span>
              </h1>
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white hover:text-gray-200 transition-colors bg-white bg-opacity-10 rounded-lg p-2 sm:p-3 hover:bg-opacity-20 backdrop-blur-sm"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => onTabChange('selection')}
              className={`flex items-center gap-1 xl:gap-2 px-2 xl:px-4 py-2 rounded-lg font-medium transition-all text-sm xl:text-base ${
                currentTab === 'selection'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Home className="w-4 h-4 xl:w-5 xl:h-5" />
              <span>Selection</span>
            </button>

            <button
              onClick={() => onTabChange('winners')}
              className={`flex items-center gap-1 xl:gap-2 px-2 xl:px-4 py-2 rounded-lg font-medium transition-all relative text-sm xl:text-base ${
                currentTab === 'winners'
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Trophy className="w-4 h-4 xl:w-5 xl:h-5" />
              <span>Winners</span>
              {winnerCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 xl:w-6 xl:h-6 flex items-center justify-center text-xs">
                  {winnerCount}
                </span>
              )}
            </button>

            {winnerCount > 0 && (
              <button
                onClick={() => onTabChange('elite-spiral')}
                className={`flex items-center gap-1 xl:gap-2 px-2 xl:px-4 py-2 rounded-lg font-medium transition-all text-sm xl:text-base ${
                  currentTab === 'elite-spiral'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                    : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Crown className="w-4 h-4 xl:w-5 xl:h-5" />
                <span className="hidden xl:inline">Elite's Spiral</span>
                <span className="xl:hidden">Elite</span>
              </button>
            )}

            {/* New Feature Buttons */}
            {winnerCount > 0 && (
              <>
                <button
                  onClick={onOpenWinHistoryDashboard}
                  className="flex items-center gap-1 xl:gap-2 px-2 xl:px-4 py-2 rounded-lg font-medium text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all text-sm xl:text-base"
                  title="Win History Dashboard"
                >
                  <BarChart3 className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="hidden xl:inline">Analytics</span>
                  {eliteWinnerCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-4 h-4 xl:w-5 xl:h-5 flex items-center justify-center text-xs">
                      E
                    </span>
                  )}
                </button>

                <button
                  onClick={onOpenExportData}
                  className="flex items-center gap-1 xl:gap-2 px-2 xl:px-4 py-2 rounded-lg font-medium text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all text-sm xl:text-base"
                  title="Export Data"
                >
                  <Download className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="hidden xl:inline">Export</span>
                </button>

                <button
                  onClick={onOpenBackupRestore}
                  className="flex items-center gap-1 xl:gap-2 px-2 xl:px-4 py-2 rounded-lg font-medium text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all text-sm xl:text-base"
                  title="Backup & Restore"
                >
                  <Database className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="hidden xl:inline">Backup</span>
                </button>
              </>
            )}

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1 xl:gap-2 px-2 xl:px-4 py-2 rounded-lg font-medium text-red-200 hover:text-white hover:bg-red-500 hover:bg-opacity-20 transition-all text-sm xl:text-base"
              title="Logout"
            >
              <LogOut className="w-4 h-4 xl:w-5 xl:h-5" />
              <span className="hidden xl:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-black bg-opacity-90 backdrop-blur-xl border-b border-white border-opacity-20 max-h-screen overflow-y-auto">
            <div className="px-4 py-4 space-y-2 max-w-sm mx-auto">
              <button
                onClick={() => {
                  onTabChange('selection');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-base ${
                  currentTab === 'selection'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Home className="w-6 h-6" />
                <span>Selection</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('winners');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all relative text-base ${
                  currentTab === 'winners'
                    ? 'bg-yellow-600 text-white shadow-lg'
                    : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Trophy className="w-6 h-6" />
                <span>Winners</span>
                {winnerCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-sm rounded-full w-7 h-7 flex items-center justify-center font-bold">
                    {winnerCount}
                  </span>
                )}
              </button>

              {winnerCount > 0 && (
                <button
                  onClick={() => {
                    onTabChange('elite-spiral');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-base ${
                    currentTab === 'elite-spiral'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Crown className="w-6 h-6" />
                  <span>Elite's Spiral</span>
                </button>
              )}

              {winnerCount > 0 && (
                <>
                  <button
                    onClick={() => {
                      onOpenWinHistoryDashboard();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all text-base"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>Analytics</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenExportData();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all text-base"
                  >
                    <Download className="w-6 h-6" />
                    <span>Export Data</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenBackupRestore();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-purple-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all text-base"
                  >
                    <Database className="w-6 h-6" />
                    <span>Backup & Restore</span>
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-200 hover:text-white hover:bg-red-500 hover:bg-opacity-20 transition-all text-base"
              >
                <LogOut className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;