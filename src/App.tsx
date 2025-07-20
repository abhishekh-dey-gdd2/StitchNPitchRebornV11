import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import LoginPortal from './components/LoginPortal';
import RandomGuideSelector from './components/RandomGuideSelector';
import PasswordModal from './components/PasswordModal';
import WinnerDisplay from './components/WinnerDisplay';
import WinnerHistory from './components/WinnerHistory';
import EliteSpiralPanel from './components/EliteSpiralPanel';
import WinHistoryDashboard from './components/WinHistoryDashboard';
import EliteWinnersDashboard from './components/EliteWinnersDashboard';
import ExportData from './components/ExportData';
import BackupRestore from './components/BackupRestore';
import FailAnimation from './components/FailAnimation';
import DynamicOrbs from './components/DynamicOrbs';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ConfettiAnimation from './components/ConfettiAnimation';
import { Guide, Winner, Loser, EliteSpiral } from './config/data';

import './styles/responsive.css';

type AppTab = 'selection' | 'winners' | 'elite-spiral';

// Session management constants
const SESSION_KEY = 'stitchNPitchSession';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface SessionData {
  isLoggedIn: boolean;
  timestamp: number;
}

// Add responsive utility hook
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useCallback(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return { isMobile };
};

function App() {
  const { isMobile } = useResponsive();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState<AppTab>('selection');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [currentWinner, setCurrentWinner] = useState<Winner | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [losers, setLosers] = useState<Loser[]>([]);
  const [eliteWinners, setEliteWinners] = useState<EliteSpiral[]>([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showFailAnimation, setShowFailAnimation] = useState(false);
  const [failedGuideName, setFailedGuideName] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  
  // New modal states
  const [isWinHistoryDashboardOpen, setIsWinHistoryDashboardOpen] = useState(false);
  const [isExportDataOpen, setIsExportDataOpen] = useState(false);
  const [isBackupRestoreOpen, setIsBackupRestoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Load winners from Supabase on component mount
  useEffect(() => {
    if (isLoggedIn) {
      loadWinners();
      loadLosers();
      loadEliteWinners();
    }
  }, [isLoggedIn]);

  const checkExistingSession = () => {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const parsed: SessionData = JSON.parse(sessionData);
        const now = Date.now();
        
        // Check if session is still valid (within 24 hours)
        if (parsed.isLoggedIn && (now - parsed.timestamp) < SESSION_DURATION) {
          setIsLoggedIn(true);
          return;
        } else {
          // Session expired, clear it
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem(SESSION_KEY);
    }
    
    setLoading(false);
  };

  const saveSession = (loggedIn: boolean) => {
    const sessionData: SessionData = {
      isLoggedIn: loggedIn,
      timestamp: Date.now()
    };
    
    if (loggedIn) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  };

  // Handle login
  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      saveSession(true);
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    saveSession(false);
    setCurrentTab('selection');
    // Clear any cached data
    setWinners([]);
    setLosers([]);
    setEliteWinners([]);
  };

  const loadWinners = async () => {
    try {
      const { data, error } = await supabase
        .from('winners')
        .select('*')
        .order('created_at', { ascending: true }); // Changed to ascending order

      if (error) {
        console.error('Error loading winners:', error);
        // Fallback to localStorage if Supabase fails
        const savedWinners = localStorage.getItem('stitchAndPitchWinners');
        if (savedWinners) {
          const localWinners = JSON.parse(savedWinners);
          // Sort local winners by timestamp in ascending order
          localWinners.sort((a: Winner, b: Winner) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          setWinners(localWinners);
        }
      } else {
        setWinners(data || []);
        // Also sync to localStorage as backup
        localStorage.setItem('stitchAndPitchWinners', JSON.stringify(data || []));
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      // Fallback to localStorage
      const savedWinners = localStorage.getItem('stitchAndPitchWinners');
      if (savedWinners) {
        const localWinners = JSON.parse(savedWinners);
        // Sort local winners by timestamp in ascending order
        localWinners.sort((a: Winner, b: Winner) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setWinners(localWinners);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLosers = async () => {
    try {
      const { data, error } = await supabase
        .from('losers')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading losers:', error);
        // Fallback to localStorage if Supabase fails
        const savedLosers = localStorage.getItem('stitchAndPitchLosers');
        if (savedLosers) {
          const localLosers = JSON.parse(savedLosers);
          localLosers.sort((a: Loser, b: Loser) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          setLosers(localLosers);
        }
      } else {
        setLosers(data || []);
        localStorage.setItem('stitchAndPitchLosers', JSON.stringify(data || []));
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      const savedLosers = localStorage.getItem('stitchAndPitchLosers');
      if (savedLosers) {
        const localLosers = JSON.parse(savedLosers);
        localLosers.sort((a: Loser, b: Loser) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setLosers(localLosers);
      }
    }
  };

  const loadEliteWinners = async () => {
    try {
      const { data, error } = await supabase
        .from('elite_spiral')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading elite winners:', error);
        // Fallback to localStorage if Supabase fails
        const savedEliteWinners = localStorage.getItem('stitchAndPitchEliteWinners');
        if (savedEliteWinners) {
          const localEliteWinners = JSON.parse(savedEliteWinners);
          localEliteWinners.sort((a: EliteSpiral, b: EliteSpiral) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          setEliteWinners(localEliteWinners);
        }
      } else {
        setEliteWinners(data || []);
        localStorage.setItem('stitchAndPitchEliteWinners', JSON.stringify(data || []));
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      const savedEliteWinners = localStorage.getItem('stitchAndPitchEliteWinners');
      if (savedEliteWinners) {
        const localEliteWinners = JSON.parse(savedEliteWinners);
        localEliteWinners.sort((a: EliteSpiral, b: EliteSpiral) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setEliteWinners(localEliteWinners);
      }
    }
  };
  const saveWinnerToDatabase = async (winner: Winner) => {
    try {
      const { data, error } = await supabase
        .from('winners')
        .insert([{
          guide_id: winner.guide_id,
          name: winner.name,
          department: winner.department,
          supervisor: winner.supervisor,
          timestamp: winner.timestamp,
          chat_ids: winner.chat_ids || []
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving winner to database:', error);
        // Fallback to localStorage
        const updatedWinners = [...winners, winner].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setWinners(updatedWinners);
        localStorage.setItem('stitchAndPitchWinners', JSON.stringify(updatedWinners));
      } else {
        // Reload winners from database to get the latest data
        await loadWinners();
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      // Fallback to localStorage
      const updatedWinners = [...winners, winner].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setWinners(updatedWinners);
      localStorage.setItem('stitchAndPitchWinners', JSON.stringify(updatedWinners));
    }
  };

  const saveLoserToDatabase = async (loser: Loser) => {
    try {
      const { data, error } = await supabase
        .from('losers')
        .insert([{
          guide_id: loser.guide_id,
          name: loser.name,
          department: loser.department,
          supervisor: loser.supervisor,
          timestamp: loser.timestamp,
          chat_ids: loser.chat_ids || []
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving loser to database:', error);
        // Fallback to localStorage
        const updatedLosers = [...losers, loser].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setLosers(updatedLosers);
        localStorage.setItem('stitchAndPitchLosers', JSON.stringify(updatedLosers));
      } else {
        // Reload losers from database to get the latest data
        await loadLosers();
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      // Fallback to localStorage
      const updatedLosers = [...losers, loser].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setLosers(updatedLosers);
      localStorage.setItem('stitchAndPitchLosers', JSON.stringify(updatedLosers));
    }
  };

  const deleteWinnerFromDatabase = async (winnerId: string) => {
    try {
      const { error } = await supabase
        .from('winners')
        .delete()
        .eq('id', winnerId);

      if (error) {
        console.error('Error deleting winner from database:', error);
        // Fallback to localStorage
        const updatedWinners = winners.filter(winner => winner.id !== winnerId);
        setWinners(updatedWinners);
        localStorage.setItem('stitchAndPitchWinners', JSON.stringify(updatedWinners));
      } else {
        // Reload winners from database to get the latest data
        await loadWinners();
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      // Fallback to localStorage
      const updatedWinners = winners.filter(winner => winner.id !== winnerId);
      setWinners(updatedWinners);
      localStorage.setItem('stitchAndPitchWinners', JSON.stringify(updatedWinners));
    }
  };

  const handleRestoreWinners = async (restoredWinners: Winner[], restoredLosers?: Loser[], restoredEliteWinners?: EliteSpiral[]) => {
    try {
      // First, purge existing data in correct order (respecting foreign key constraints)
      if (restoredEliteWinners) {
        const { error: eliteError } = await supabase
          .from('elite_spiral')
          .delete()
          .gte('created_at', '1900-01-01');
      }
      
      if (restoredLosers) {
        const { error: losersError } = await supabase
          .from('losers')
          .delete()
          .gte('created_at', '1900-01-01');
      }
      
      const { error: winnersError } = await supabase
        .from('winners')
        .delete()
        .gte('created_at', '1900-01-01');

      // Insert winners first and create mapping of old IDs to new IDs
      const winnerIdMapping: { [oldId: string]: string } = {};
      
      for (const winner of restoredWinners) {
        const oldId = winner.id;
        try {
          const { data, error } = await supabase
            .from('winners')
            .insert([{
              guide_id: winner.guide_id,
              name: winner.name,
              department: winner.department,
              supervisor: winner.supervisor,
              timestamp: winner.timestamp,
              chat_ids: winner.chat_ids || []
            }])
            .select()
            .single();

          if (error) {
            console.error('Error saving winner to database:', error);
          } else if (data && oldId) {
            winnerIdMapping[oldId] = data.id;
          }
        } catch (error) {
          console.error('Error connecting to database:', error);
        }
      }
      
      if (restoredLosers) {
        for (const loser of restoredLosers) {
          await saveLoserToDatabase(loser);
        }
      }
      
      if (restoredEliteWinners) {
        for (const elite of restoredEliteWinners) {
          // Update winner_id with the new mapped ID
          const updatedElite = {
            ...elite,
            winner_id: elite.winner_id && winnerIdMapping[elite.winner_id] 
              ? winnerIdMapping[elite.winner_id] 
              : null
          };
          await saveEliteWinnerToDatabase(updatedElite);
        }
      }
      
      // Reload to get fresh data
      await loadWinners();
      await loadLosers();
      await loadEliteWinners();
    } catch (error) {
      console.error('Error restoring winners:', error);
      // Fallback to localStorage
      setWinners(restoredWinners);
      localStorage.setItem('stitchAndPitchWinners', JSON.stringify(restoredWinners));
      if (restoredLosers) {
        setLosers(restoredLosers);
        localStorage.setItem('stitchAndPitchLosers', JSON.stringify(restoredLosers));
      }
      if (restoredEliteWinners) {
        setEliteWinners(restoredEliteWinners);
        localStorage.setItem('stitchAndPitchEliteWinners', JSON.stringify(restoredEliteWinners));
      }
    }
  };

  // Auto-restore backup data on component mount
  useEffect(() => {
    const restoreBackupData = async () => {
      const backupData = {
        "version": "1.0",
        "timestamp": "2025-07-20T10:36:52.937Z",
        "totalWinners": 51,
        "totalLosers": 22,
        "totalEliteWinners": 0,
        "departments": [
          "Sales",
          "Productivity", 
          "Billing",
          "General",
          "Hosting",
          "Apac-All Support",
          "Apac-General"
        ],
        "winners": [
          {
            "id": "c81ec394-00ec-4a0d-a5e4-ea060aaa8bc5",
            "guide_id": 111,
            "name": "Chinthakunta Laxmi prasanna",
            "department": "Sales",
            "supervisor": "Sanjo Jose",
            "timestamp": "2025-07-02T17:45:51.849+00:00",
            "created_at": "2025-07-11T22:07:25.204678+00:00",
            "chat_ids": []
          },
          {
            "id": "ea46ac48-a6ca-4e84-accf-d9d7909eb7d3",
            "guide_id": 139,
            "name": "Sriram Manchikanti ",
            "department": "Productivity",
            "supervisor": "Shaik Shoaib",
            "timestamp": "2025-07-02T18:02:59.722+00:00",
            "created_at": "2025-07-11T22:07:25.699445+00:00",
            "chat_ids": []
          },
          {
            "id": "2559148c-1153-4b8a-9db2-ebe5dd34b676",
            "guide_id": 59,
            "name": "Navya Vanga",
            "department": "Billing",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-02T18:11:52.499+00:00",
            "created_at": "2025-07-11T22:07:26.292656+00:00",
            "chat_ids": []
          },
          {
            "id": "34c5f744-7e0d-4a10-a9a0-ada51694e035",
            "guide_id": 105,
            "name": "Boda Akhila",
            "department": "Sales",
            "supervisor": "Sanjo Jose",
            "timestamp": "2025-07-03T19:13:58.086+00:00",
            "created_at": "2025-07-11T22:07:26.82588+00:00",
            "chat_ids": []
          },
          {
            "id": "e7739640-dee1-4746-9ad6-7d11e6f2be9d",
            "guide_id": 42,
            "name": "Vennela Karjugutha",
            "department": "General",
            "supervisor": "Chandrasekhar Palem",
            "timestamp": "2025-07-03T19:41:25.953+00:00",
            "created_at": "2025-07-11T22:07:27.38573+00:00",
            "chat_ids": []
          },
          {
            "id": "9983b407-127a-422d-b7a8-0480044af71d",
            "guide_id": 118,
            "name": "sneha kotturi",
            "department": "Sales",
            "supervisor": "Sanjo Jose",
            "timestamp": "2025-07-04T17:40:50.756+00:00",
            "created_at": "2025-07-11T22:07:28.199844+00:00",
            "chat_ids": []
          },
          {
            "id": "2deb7adf-1f4e-43db-88f5-f4b91dbe61c4",
            "guide_id": 63,
            "name": "Venkatesh R",
            "department": "Billing",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-04T17:46:02.882+00:00",
            "created_at": "2025-07-11T22:07:28.774956+00:00",
            "chat_ids": []
          },
          {
            "id": "30a8695c-a9b8-4575-82b3-886609951d3c",
            "guide_id": 22,
            "name": "Shruthi Bairi",
            "department": "Hosting",
            "supervisor": "Abdul Rahman",
            "timestamp": "2025-07-04T17:53:24.591+00:00",
            "created_at": "2025-07-11T22:07:29.245552+00:00",
            "chat_ids": []
          },
          {
            "id": "ef303f1b-061d-4e9c-92aa-83e721345cea",
            "guide_id": 141,
            "name": "Rithika Sambatha",
            "department": "Productivity",
            "supervisor": "Shaik Shoaib",
            "timestamp": "2025-07-04T18:02:15.42+00:00",
            "created_at": "2025-07-11T22:07:29.796637+00:00",
            "chat_ids": []
          },
          {
            "id": "55687c39-266a-4ae1-aa16-f4ba1f8da80a",
            "guide_id": 99,
            "name": "Bandari Vinay Kumar",
            "department": "Sales",
            "supervisor": "Sangeeta Bhuyan",
            "timestamp": "2025-07-07T18:24:52.047+00:00",
            "created_at": "2025-07-11T22:07:30.364499+00:00",
            "chat_ids": []
          },
          {
            "id": "68e62062-2a62-4a15-a1f8-b3ad82cea208",
            "guide_id": 17,
            "name": "Rajkumar Dhude",
            "department": "Hosting",
            "supervisor": "Abdul Rahman",
            "timestamp": "2025-07-07T18:37:33.48+00:00",
            "created_at": "2025-07-11T22:07:30.837824+00:00",
            "chat_ids": []
          },
          {
            "id": "f4c0b47e-49cd-43cc-b1b9-3dec7d5b6b9b",
            "guide_id": 135,
            "name": "Mohammed Naseer",
            "department": "Productivity",
            "supervisor": "Shaik Shoaib",
            "timestamp": "2025-07-07T18:44:06.47+00:00",
            "created_at": "2025-07-11T22:07:31.2957+00:00",
            "chat_ids": []
          },
          {
            "id": "31bd0ecc-9c2d-46be-b182-ea0eb7767670",
            "guide_id": 146,
            "name": "Nithish Kumar Ellendhula ",
            "department": "Productivity",
            "supervisor": "Shaik Shoaib",
            "timestamp": "2025-07-09T17:48:29.435+00:00",
            "created_at": "2025-07-11T22:07:32.164147+00:00",
            "chat_ids": []
          },
          {
            "id": "9c0f866d-8d07-4739-ab5d-f76faded6988",
            "guide_id": 23,
            "name": "Murali krishna Bantu",
            "department": "Hosting",
            "supervisor": "Abdul Rahman",
            "timestamp": "2025-07-09T17:52:19.368+00:00",
            "created_at": "2025-07-11T22:07:32.692389+00:00",
            "chat_ids": []
          },
          {
            "id": "92ecbe01-12f8-448b-b762-0c9a5211a829",
            "guide_id": 66,
            "name": "Sai Shashank K",
            "department": "Billing",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-09T18:00:10.051+00:00",
            "created_at": "2025-07-11T22:07:33.121647+00:00",
            "chat_ids": []
          },
          {
            "id": "cbd1c64b-98ad-4fe3-af1d-13a98414225d",
            "guide_id": 86,
            "name": "Lokesh Beerukuri",
            "department": "Sales",
            "supervisor": "Sangeeta Bhuyan",
            "timestamp": "2025-07-09T18:20:25.851+00:00",
            "created_at": "2025-07-11T22:07:33.515202+00:00",
            "chat_ids": []
          },
          {
            "id": "e0459db2-1ac6-462d-8d29-d7e0cba0e120",
            "guide_id": 78,
            "name": "Gopina  Nikhil",
            "department": "General",
            "supervisor": "Prashanth G C",
            "timestamp": "2025-07-09T18:23:15.341+00:00",
            "created_at": "2025-07-11T22:07:33.949945+00:00",
            "chat_ids": []
          },
          {
            "id": "94040da1-ccd4-43c0-be99-5f7c61c49e37",
            "guide_id": 242,
            "name": "Reshma, Kannam",
            "department": "Apac-All Support",
            "supervisor": "Sunitha",
            "timestamp": "2025-07-10T13:24:03.248+00:00",
            "created_at": "2025-07-11T22:07:34.38278+00:00",
            "chat_ids": []
          },
          {
            "id": "7bad534c-41f3-45fb-bb3c-f605a6abc5d2",
            "guide_id": 123,
            "name": "Vallakati Kranthi kumar",
            "department": "Sales",
            "supervisor": "Sanjo Jose",
            "timestamp": "2025-07-10T16:45:51.597+00:00",
            "created_at": "2025-07-11T22:07:35.102127+00:00",
            "chat_ids": []
          },
          {
            "id": "23339828-4b1d-4ffb-adbc-7831068c046b",
            "guide_id": 149,
            "name": "Bhargavi Killada",
            "department": "Productivity",
            "supervisor": "Shaik Shoaib",
            "timestamp": "2025-07-10T17:51:01.407+00:00",
            "created_at": "2025-07-11T22:07:35.569325+00:00",
            "chat_ids": []
          },
          {
            "id": "4820ed11-477e-476e-b8f9-f8341aaa00c4",
            "guide_id": 158,
            "name": "Dhanraj  J S",
            "department": "Hosting",
            "supervisor": "Srikanth Janga",
            "timestamp": "2025-07-10T17:56:22.031+00:00",
            "created_at": "2025-07-11T22:07:36.036518+00:00",
            "chat_ids": []
          },
          {
            "id": "5ff4fc06-5901-4576-af68-d5d9981d6f03",
            "guide_id": 38,
            "name": "Bhargavi Macherla",
            "department": "General",
            "supervisor": "Chandrasekhar Palem",
            "timestamp": "2025-07-10T19:42:40.743+00:00",
            "created_at": "2025-07-11T22:07:36.515054+00:00",
            "chat_ids": []
          },
          {
            "id": "675de2f0-b4e1-410c-97b2-565f81692343",
            "guide_id": 56,
            "name": "Sri, Koppula Bhanu",
            "department": "Billing",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-10T22:43:10.812+00:00",
            "created_at": "2025-07-11T22:07:36.954392+00:00",
            "chat_ids": []
          },
          {
            "id": "e9905d1e-07d2-4af2-95d0-9fd2b64e9afb",
            "guide_id": 124,
            "name": "Javvaji Manikumar Reddy",
            "department": "Sales",
            "supervisor": "Sanjo Jose",
            "timestamp": "2025-07-11T16:46:07.681+00:00",
            "created_at": "2025-07-11T22:07:37.397346+00:00",
            "chat_ids": []
          },
          {
            "id": "f2041bd9-80ba-4185-a2de-f31a5ee92802",
            "guide_id": 150,
            "name": "Manasa,Pasunuti",
            "department": "Productivity",
            "supervisor": "Shaik Shoaib",
            "timestamp": "2025-07-11T17:45:16.082+00:00",
            "created_at": "2025-07-11T22:07:37.902211+00:00",
            "chat_ids": []
          },
          {
            "id": "fdc248db-5103-42c9-b493-9d8ebe462a9a",
            "guide_id": 49,
            "name": "Sayed Basha",
            "department": "Hosting",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-11T18:14:28.874+00:00",
            "created_at": "2025-07-11T22:07:38.439056+00:00",
            "chat_ids": []
          },
          {
            "id": "7e71cf68-e4b3-4399-8094-05d265491fb0",
            "guide_id": 8,
            "name": "Shravya Nerella",
            "department": "General",
            "supervisor": "Abdul Rahman",
            "timestamp": "2025-07-11T21:52:13.627+00:00",
            "created_at": "2025-07-11T22:07:38.953905+00:00",
            "chat_ids": []
          },
          {
            "id": "aa12fe18-3ae3-4a99-ae9c-9f9e87c92fb8",
            "guide_id": 65,
            "name": "Mohammad shahriyar Hussain",
            "department": "Billing",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-11T22:46:44.554+00:00",
            "created_at": "2025-07-11T22:46:45.848659+00:00",
            "chat_ids": []
          },
          {
            "id": "b75bb670-16d8-482f-aeec-ce6f51bfb95b",
            "guide_id": 48,
            "name": "Syed Ala Uddin",
            "department": "Hosting",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-14T17:44:37.726+00:00",
            "created_at": "2025-07-14T17:44:38.892522+00:00",
            "chat_ids": []
          },
          {
            "id": "be05ac79-f384-4852-86c8-9d4eef7fcc7d",
            "guide_id": 84,
            "name": "Vemula Bhanuja",
            "department": "General",
            "supervisor": "Prashanth G C",
            "timestamp": "2025-07-14T19:32:33.967+00:00",
            "created_at": "2025-07-14T19:32:35.999776+00:00",
            "chat_ids": [
              "b83315de-9519-4ed3-8ee9-9aa556e7e9ef",
              "68308387-dd8b-4af7-aab7-4ecbb3abeeb9",
              "7d2ae6ab-4aa3-46fc-8274-8ca47022d2db"
            ]
          },
          {
            "id": "1cbd73fe-4b44-4294-b8a4-8f92136703b0",
            "guide_id": 147,
            "name": "Vanka sugandham",
            "department": "Productivity",
            "supervisor": "Shaik Shoaib",
            "timestamp": "2025-07-14T20:47:23.723+00:00",
            "created_at": "2025-07-14T20:47:24.361591+00:00",
            "chat_ids": [
              " d6798fac-ab76-4fd5-a481-a20864b081e3",
              "f0fd99ed-e77e-47d1-9691-ada31e3e220a",
              " 26238e98-2c5c-4517-ba23-0e9a9cb18232"
            ]
          },
          {
            "id": "6ef8b770-3a58-4878-9456-5c6273afd360",
            "guide_id": 87,
            "name": "Zulkhar  Nain",
            "department": "Sales",
            "supervisor": "Sangeeta Bhuyan",
            "timestamp": "2025-07-15T16:49:46.687+00:00",
            "created_at": "2025-07-15T16:49:47.449693+00:00",
            "chat_ids": [
              "Chat ID: f53b4aca-3fed-4044-955d-723dd7f5ce50",
              "f221522a-707c-4203-a6c9-b14b02a18b3e"
            ]
          },
          {
            "id": "abe693fe-60b2-4d28-8721-a57fca9582cc",
            "guide_id": 155,
            "name": "Vangeti Divakar Reddy",
            "department": "Hosting",
            "supervisor": "Srikanth Janga",
            "timestamp": "2025-07-15T16:51:51.443+00:00",
            "created_at": "2025-07-15T16:51:51.944243+00:00",
            "chat_ids": [
              "Chat ID: 82d61e55-99de-4418-a5de-ce331ad0e22f",
              "Chat ID: 34d5b08f-bbfd-415e-9f0a-2ba3558ca060",
              "Chat ID: 633f1e02-3a7c-44fc-be38-d669f829f1ba",
              "Chat ID: 6cb1845b-adba-48ff-874a-0f837d76b09c"
            ]
          },
          {
            "id": "c00fd76f-48ea-49e5-be8b-5d581e4e097a",
            "guide_id": 73,
            "name": "Vyjayanthi Kothapally",
            "department": "General",
            "supervisor": "Prashanth G C",
            "timestamp": "2025-07-15T19:56:28.277+00:00",
            "created_at": "2025-07-15T19:56:29.306486+00:00",
            "chat_ids": [
              "ccbacce2-1bd3-4979-b867-a12db79b9d21",
              "2e5140a9-30e2-409c-bec9-af6aabaf8c8a",
              "6b076c06-e020-44ed-9a07-e5beb9246afd"
            ]
          },
          {
            "id": "a0b512ed-cb33-4555-a255-ed6c5486658e",
            "guide_id": 132,
            "name": "Aravindhan Elumalai",
            "department": "Productivity",
            "supervisor": "Shaik Shoaib",
            "timestamp": "2025-07-15T20:42:23.096+00:00",
            "created_at": "2025-07-15T20:42:23.868617+00:00",
            "chat_ids": [
              "37f7bb6d-bc30-484e-a3d8-752737e352a3",
              "2453f804-a623-4d79-bdec-488e401cdbfe",
              " 8ea77da0-341f-4d2e-9f2e-da5044b761c5"
            ]
          },
          {
            "id": "5dc7b4bd-f17b-4884-83e2-69f033478d61",
            "guide_id": 67,
            "name": "Pavankalyan Bajanthri ",
            "department": "Billing",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-15T23:00:51.22+00:00",
            "created_at": "2025-07-15T23:00:52.423128+00:00",
            "chat_ids": []
          },
          {
            "id": "db525ece-83c0-487e-b2dd-a2803a821564",
            "guide_id": 161,
            "name": "Sahaja  Katrimala",
            "department": "Hosting",
            "supervisor": "Srikanth Janga",
            "timestamp": "2025-07-16T16:52:58.477+00:00",
            "created_at": "2025-07-16T16:52:59.270118+00:00",
            "chat_ids": []
          },
          {
            "id": "d1bffcca-2bc9-4c61-9e14-61cc5d3e5f5e",
            "guide_id": 30,
            "name": "Satla Vinay",
            "department": "General",
            "supervisor": "Chandrasekhar Palem",
            "timestamp": "2025-07-16T19:33:08.389+00:00",
            "created_at": "2025-07-16T19:33:09.428309+00:00",
            "chat_ids": [
              "35b7192b-70a6-4b6c-81c0-7c1f23eb7896",
              "3df69a6a-b622-444f-affe-ee2f0ab672fe",
              " adca0070-b0b6-458d-b696-e39c4974a8d3"
            ]
          },
          {
            "id": "8880eae5-1dc7-4490-b96f-a22842b9515c",
            "guide_id": 144,
            "name": "Shiva G",
            "department": "Productivity",
            "supervisor": "Shaik Shoaib",
            "timestamp": "2025-07-16T20:39:32.277+00:00",
            "created_at": "2025-07-16T20:39:33.501835+00:00",
            "chat_ids": [
              "50bed4f3-9b8c-44ef-a335-e250826295af",
              "de1f7de1-48b8-4d7d-8390-d0a05e73949e",
              "583c3f9b-9d6a-410a-831e-b22667555194"
            ]
          },
          {
            "id": "aa1a38f5-f364-4639-ac3c-435f89c3d850",
            "guide_id": 70,
            "name": "Sharvani, Kodari",
            "department": "Billing",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-16T22:52:10.82+00:00",
            "created_at": "2025-07-16T22:52:12.464978+00:00",
            "chat_ids": [
              "38a3cfc9-a8f7-4e37-b1ef-80fe147bffbb",
              "72f4281b-356b-4f37-bad2-99f515729157",
              "c848c5ce-7d52-484e-a0aa-53190486fa5b"
            ]
          },
          {
            "id": "02c431a9-383c-46b2-91c3-53f131ceb656",
            "guide_id": 53,
            "name": "Rathod Suraj Naik",
            "department": "Hosting",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-17T16:48:11.493+00:00",
            "created_at": "2025-07-17T16:48:12.346608+00:00",
            "chat_ids": [
              "Chat ID: 15b7e067-16aa-45e0-9630-b64c0e47286a",
              "Chat ID: 3a8d2ab2-5046-4d3f-9f7a-6b2fe3502ac4",
              "Chat ID: da86a83b-8148-4e31-8d30-31c959c3cbb2"
            ]
          },
          {
            "id": "a4d93adf-19c2-4534-9943-5f99d1a2866a",
            "guide_id": 53,
            "name": "Rathod Suraj Naik",
            "department": "Hosting",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-17T16:50:49.183+00:00",
            "created_at": "2025-07-17T16:50:49.805183+00:00",
            "chat_ids": [
              "Chat ID: 15b7e067-16aa-45e0-9630-b64c0e47286a",
              "Chat ID: 3a8d2ab2-5046-4d3f-9f7a-6b2fe3502ac4",
              "Chat ID: da86a83b-8148-4e31-8d30-31c959c3cbb2"
            ]
          },
          {
            "id": "468181be-0eaa-4d03-9ed2-8ebb487850ed",
            "guide_id": 101,
            "name": "PEDARI SAI SANDEEP",
            "department": "Sales",
            "supervisor": "Sangeeta Bhuyan",
            "timestamp": "2025-07-17T17:17:19.268+00:00",
            "created_at": "2025-07-17T17:17:19.99872+00:00",
            "chat_ids": []
          },
          {
            "id": "1890c4ae-6495-476d-b086-073622636c5d",
            "guide_id": 107,
            "name": "Batthula Jhansi",
            "department": "Sales",
            "supervisor": "Sanjo Jose",
            "timestamp": "2025-07-17T17:21:23.801+00:00",
            "created_at": "2025-07-17T17:21:24.441575+00:00",
            "chat_ids": []
          },
          {
            "id": "53e3fb89-e5ab-4848-9cda-057dffbb7c20",
            "guide_id": 128,
            "name": "K AVINASH",
            "department": "Productivity",
            "supervisor": "Shaik Shoaib",
            "timestamp": "2025-07-17T21:05:09.497+00:00",
            "created_at": "2025-07-17T21:05:10.681186+00:00",
            "chat_ids": [
              "bd082a4e-cdd0-45e7-8757-2bc241aebc86",
              "7016509f-7e85-48d2-8c3f-46e8f84e6641"
            ]
          },
          {
            "id": "f5bd3e05-bc7b-4c88-8f1c-0a6819cdf55a",
            "guide_id": 57,
            "name": "Neerati Druvitha",
            "department": "Billing",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-17T22:52:57.289+00:00",
            "created_at": "2025-07-17T22:52:58.127252+00:00",
            "chat_ids": [
              " eb4bbcf1-a03b-4d94-9477-9a626508cf40"
            ]
          },
          {
            "id": "61c6caab-d96f-4dfe-bdca-2513d4034897",
            "guide_id": 121,
            "name": "Chandu Pruthvi Kumar",
            "department": "Sales",
            "supervisor": "Sanjo Jose",
            "timestamp": "2025-07-18T16:49:12.856+00:00",
            "created_at": "2025-07-18T16:49:13.725344+00:00",
            "chat_ids": []
          },
          {
            "id": "471dc98a-1f52-4927-af5c-fa72ed60c020",
            "guide_id": 167,
            "name": "Syed  Adeeb",
            "department": "Hosting",
            "supervisor": "Srikanth Janga",
            "timestamp": "2025-07-18T16:56:38.233+00:00",
            "created_at": "2025-07-18T16:56:39.792719+00:00",
            "chat_ids": [
              "Chat ID: f310111c-9080-4f26-9fac-73bc1f903239",
              "Chat ID: 70381c8e-90da-4ab6-b6ff-f9d650c4e85a",
              "Chat ID: cd753fe7-b571-4307-831b-31913cd97a06"
            ]
          },
          {
            "id": "ca8628bc-8fbc-4d26-a0bc-7011b999b7fe",
            "guide_id": 80,
            "name": "Nookala Naga Naveen",
            "department": "General",
            "supervisor": "Prashanth G C",
            "timestamp": "2025-07-18T19:23:54.545+00:00",
            "created_at": "2025-07-18T19:23:55.467666+00:00",
            "chat_ids": []
          },
          {
            "id": "7cf40b8c-4d6e-49ee-9eaa-a90aeb2fdb2c",
            "guide_id": 137,
            "name": "Sudama Prasad  Yadav",
            "department": "Productivity",
            "supervisor": "Shaik Shoaib",
            "timestamp": "2025-07-18T21:43:52.824+00:00",
            "created_at": "2025-07-18T21:43:53.841486+00:00",
            "chat_ids": [
              "45220b7a-e38a-4271-9908-8a1254e036a9",
              "03dfc7ed-5ce5-43c2-a82e-dd0c8b4c4e1e"
            ]
          },
          {
            "id": "25ec4ddb-96b0-4cfc-aec4-e6c2797ef002",
            "guide_id": 68,
            "name": "Yaswik Lebaka ",
            "department": "Billing",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-18T22:43:27.251+00:00",
            "created_at": "2025-07-18T22:43:27.691677+00:00",
            "chat_ids": [
              " 59536245-4d8e-44cd-9f74-50ced13e1ad4",
              "4b510fba-cfbe-4348-a66b-77c3a3a47df5",
              "4b510fba-cfbe-4348-a66b-77c3a3a47df5"
            ]
          }
        ],
        "losers": [
          {
            "id": "5d8f6533-45e4-42d2-bbce-dec9ed983b88",
            "guide_id": 101,
            "name": "PEDARI SAI SANDEEP",
            "department": "Sales",
            "supervisor": "Sangeeta Bhuyan",
            "timestamp": "2025-07-12T11:30:28.959+00:00",
            "chat_ids": [],
            "created_at": "2025-07-12T11:30:29.773182+00:00"
          },
          {
            "id": "4965d169-cbd0-46c7-b381-fa5ab428b5d1",
            "guide_id": 211,
            "name": "Dinesh, Kukunuru Sai",
            "department": "Apac-General",
            "supervisor": "Vincy",
            "timestamp": "2025-07-12T16:59:45.179+00:00",
            "chat_ids": [],
            "created_at": "2025-07-12T16:59:46.332172+00:00"
          },
          {
            "id": "c5d69ce2-2e47-44e4-aa67-b0df7212d0c8",
            "guide_id": 213,
            "name": "Ashfaaq, Mohammed",
            "department": "Apac-General",
            "supervisor": "Vincy",
            "timestamp": "2025-07-12T18:01:48.871+00:00",
            "chat_ids": [],
            "created_at": "2025-07-12T18:01:49.992229+00:00"
          },
          {
            "id": "749e310e-923f-4853-978e-6f14e38b0c58",
            "guide_id": 209,
            "name": "Bhavishya, Kore",
            "department": "Apac-General",
            "supervisor": "Kumar",
            "timestamp": "2025-07-14T11:21:09.843+00:00",
            "chat_ids": [],
            "created_at": "2025-07-14T11:21:10.704099+00:00"
          },
          {
            "id": "a0f799f8-d727-4f94-93e4-41735c8eef4a",
            "guide_id": 25,
            "name": "Veldi Vijay Kumar",
            "department": "Hosting",
            "supervisor": "Abdul Rahman",
            "timestamp": "2025-07-14T15:52:35.652+00:00",
            "chat_ids": [],
            "created_at": "2025-07-14T15:52:36.599467+00:00"
          },
          {
            "id": "b6800050-7f19-4188-ace5-7e00fd154411",
            "guide_id": 115,
            "name": "Manisha Sanigaram",
            "department": "Sales",
            "supervisor": "Sanjo Jose",
            "timestamp": "2025-07-14T17:15:34.332+00:00",
            "chat_ids": [
              "600112e0-ba38-4c3b-95ec-6bd3ab91ceea",
              "216b0b57-0717-4ee1-b7cc-c126d971401a",
              "28f0dc52-8489-4d2f-a4ea-19bc5ea68946"
            ],
            "created_at": "2025-07-14T17:15:35.291546+00:00"
          },
          {
            "id": "ccc34057-45d7-4283-a829-2f9573bda7f7",
            "guide_id": 34,
            "name": "Varsha sree Narra",
            "department": "General",
            "supervisor": "Chandrasekhar Palem",
            "timestamp": "2025-07-14T19:25:57.898+00:00",
            "chat_ids": [
              "88338a7d-71ff-479c-8cf0-e573c08b2be2",
              "c046f6cd-4fcc-4936-9acf-7252a82577a6",
              "4d4fa9db-d354-4f01-a784-6fb3baa5733b",
              "715107f2-6aa6-4f02-b268-8409747a45f8",
              "0750f90b-64fc-47f3-9b7b-28c564de02f6"
            ],
            "created_at": "2025-07-14T19:25:59.74947+00:00"
          },
          {
            "id": "60307e84-58a6-405c-b3bd-df82bc0bf621",
            "guide_id": 67,
            "name": "Pavankalyan Bajanthri ",
            "department": "Billing",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-14T22:43:53.534+00:00",
            "chat_ids": [],
            "created_at": "2025-07-14T22:43:55.079585+00:00"
          },
          {
            "id": "d45e7fb2-7e02-4b6b-85ef-35d9b3ec86af",
            "guide_id": 55,
            "name": "Christy Golkonda",
            "department": "Billing",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-14T22:52:58.962+00:00",
            "chat_ids": [],
            "created_at": "2025-07-14T22:53:00.397471+00:00"
          },
          {
            "id": "bc0d79e5-7522-4ed4-a2e9-cd9c0543bac8",
            "guide_id": 19,
            "name": "Shalini Lingala",
            "department": "Hosting",
            "supervisor": "Abdul Rahman",
            "timestamp": "2025-07-15T16:44:12.879+00:00",
            "chat_ids": [],
            "created_at": "2025-07-15T16:44:13.532466+00:00"
          },
          {
            "id": "17973df7-f914-4d6f-8005-bc76c784d825",
            "guide_id": 182,
            "name": "Srihari, Kadamanchi",
            "department": "Apac-All Support",
            "supervisor": "Sangeetha",
            "timestamp": "2025-07-16T07:58:47.16+00:00",
            "chat_ids": [],
            "created_at": "2025-07-16T07:58:48.971893+00:00"
          },
          {
            "id": "af6b9383-4ddd-41f6-9cf2-0648be1d5eae",
            "guide_id": 232,
            "name": "Chandana, Thallapelli",
            "department": "Apac-All Support",
            "supervisor": "Sangeetha",
            "timestamp": "2025-07-16T08:03:51.253+00:00",
            "chat_ids": [],
            "created_at": "2025-07-16T08:03:52.984507+00:00"
          },
          {
            "id": "fe7a14e2-179c-464d-8310-31e00ea8f895",
            "guide_id": 54,
            "name": "Konduri  Gayathri",
            "department": "Hosting",
            "supervisor": "Kalyan Chetty",
            "timestamp": "2025-07-16T16:44:09.894+00:00",
            "chat_ids": [],
            "created_at": "2025-07-16T16:44:11.495588+00:00"
          },
          {
            "id": "892f8df7-fa04-41e0-92e5-9e18f9f0df6d",
            "guide_id": 159,
            "name": "Kasireddy Rohith  Reddy",
            "department": "Hosting",
            "supervisor": "Srikanth Janga",
            "timestamp": "2025-07-16T16:49:45.682+00:00",
            "chat_ids": [],
            "created_at": "2025-07-16T16:49:46.400837+00:00"
          },
          {
            "id": "343c1258-5f44-4fac-adcd-2a6a5b7f5cd7",
            "guide_id": 29,
            "name": "Mitra, Somnath",
            "department": "General",
            "supervisor": "Chandrasekhar Palem",
            "timestamp": "2025-07-16T19:42:42.419+00:00",
            "chat_ids": [
              "79575547-ff24-4637-8815-de5d772aba1d",
              " 53a69e4f-796a-4aab-9a2e-c2183e088246",
              "16f646d5-b016-4b8c-8030-42fb80af376d"
            ],
            "created_at": "2025-07-16T19:42:43.507964+00:00"
          },
          {
            "id": "700603c4-3443-40d4-b838-47ae3a892e84",
            "guide_id": 183,
            "name": "Chandana, Boddu",
            "department": "Apac-All Support",
            "supervisor": "Sangeetha",
            "timestamp": "2025-07-17T11:56:37.701+00:00",
            "chat_ids": [],
            "created_at": "2025-07-17T11:56:39.022241+00:00"
          },
          {
            "id": "3e6590bc-c496-4098-8cd4-c5909af9e524",
            "guide_id": 193,
            "name": "Fatima, Kaneez",
            "department": "Apac-All Support",
            "supervisor": "Sunitha",
            "timestamp": "2025-07-17T12:03:03.26+00:00",
            "chat_ids": [],
            "created_at": "2025-07-17T12:03:04.414984+00:00"
          },
          {
            "id": "2adb89f8-94cd-46d7-9d09-3825db6fc19a",
            "guide_id": 250,
            "name": "Dasari lalitha",
            "department": "Apac-All Support",
            "supervisor": "Sunitha",
            "timestamp": "2025-07-17T12:06:56.712+00:00",
            "chat_ids": [],
            "created_at": "2025-07-17T12:06:57.654208+00:00"
          },
          {
            "id": "2dcce277-d705-4d1e-a095-4a3cacd43832",
            "guide_id": 180,
            "name": "Anupriya, Bingi",
            "department": "Apac-All Support",
            "supervisor": "Sangeetha",
            "timestamp": "2025-07-17T12:16:04.116+00:00",
            "chat_ids": [
              "51c9917d-d9e8-452f-ab65-b562d902170a",
              "0c52d215-98bc-4575-a04d-bcffd17a72e8"
            ],
            "created_at": "2025-07-17T12:16:05.298765+00:00"
          },
          {
            "id": "3c35885d-dd8a-4ba3-9f01-4adf7250a808",
            "guide_id": 208,
            "name": "Samyuktha, Kodakandla",
            "department": "Apac-All Support",
            "supervisor": "Kumar",
            "timestamp": "2025-07-17T12:21:53.937+00:00",
            "chat_ids": [],
            "created_at": "2025-07-17T12:21:55.134454+00:00"
          },
          {
            "id": "7cb36c50-a296-4e8d-bf71-8e069215b59e",
            "guide_id": 164,
            "name": "Mir Ahmed  Ali",
            "department": "Hosting",
            "supervisor": "Srikanth Janga",
            "timestamp": "2025-07-18T16:49:36.639+00:00",
            "chat_ids": [],
            "created_at": "2025-07-18T16:49:37.654461+00:00"
          },
          {
            "id": "369a2c50-19b0-42a2-951e-44749c4aab61",
            "guide_id": 165,
            "name": "N sridar",
            "department": "Hosting",
            "supervisor": "Srikanth Janga",
            "timestamp": "2025-07-18T16:49:56.008+00:00",
            "chat_ids": [],
            "created_at": "2025-07-18T16:49:56.412162+00:00"
          }
        ],
        "eliteWinners": [],
        "metadata": {
          "exportedBy": "Stitch n Pitch Contest System",
          "applicationVersion": "1.0.0",
          "databaseSchema": "winners_losers_v2"
        }
      };

      // Check if we need to restore data (only restore once)
      const hasRestoredData = localStorage.getItem('hasRestoredBackupData');
      if (!hasRestoredData && isLoggedIn) {
        console.log('Restoring backup data...');
        await handleRestoreWinners(
          backupData.winners,
          backupData.losers,
          backupData.eliteWinners || []
        );
        localStorage.setItem('hasRestoredBackupData', 'true');
      }
    };

    if (isLoggedIn) {
      restoreBackupData();
    }
  }, [isLoggedIn]);

  const saveEliteWinnerToDatabase = async (elite: EliteSpiral) => {
    try {
      const { data, error } = await supabase
        .from('elite_spiral')
        .insert([{
          winner_id: elite.winner_id,
          guide_id: elite.guide_id,
          name: elite.name,
          department: elite.department,
          supervisor: elite.supervisor,
          timestamp: elite.timestamp,
          chat_ids: elite.chat_ids || []
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving elite winner to database:', error);
        // Fallback to localStorage
        const updatedEliteWinners = [...eliteWinners, elite].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setEliteWinners(updatedEliteWinners);
        localStorage.setItem('stitchAndPitchEliteWinners', JSON.stringify(updatedEliteWinners));
      } else {
        // Reload elite winners from database to get the latest data
        await loadEliteWinners();
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      // Fallback to localStorage
      const updatedEliteWinners = [...eliteWinners, elite].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setEliteWinners(updatedEliteWinners);
      localStorage.setItem('stitchAndPitchEliteWinners', JSON.stringify(updatedEliteWinners));
    }
  };

  const deleteEliteWinnerFromDatabase = async (eliteWinnerId: string) => {
    try {
      const { error } = await supabase
        .from('elite_spiral')
        .delete()
        .eq('id', eliteWinnerId);

      if (error) {
        console.error('Error deleting elite winner from database:', error);
        // Fallback to localStorage
        const updatedEliteWinners = eliteWinners.filter(elite => elite.id !== eliteWinnerId);
        setEliteWinners(updatedEliteWinners);
        localStorage.setItem('stitchAndPitchEliteWinners', JSON.stringify(updatedEliteWinners));
      } else {
        // Reload elite winners from database to get the latest data
        await loadEliteWinners();
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      // Fallback to localStorage
      const updatedEliteWinners = eliteWinners.filter(elite => elite.id !== eliteWinnerId);
      setEliteWinners(updatedEliteWinners);
      localStorage.setItem('stitchAndPitchEliteWinners', JSON.stringify(updatedEliteWinners));
    }
  };
  
  const handleGuideSelected = (guide: Guide) => {
    // Extract chat IDs from the guide object if they exist
    const { chatIds, ...guideData } = guide as Guide & { chatIds?: string[] };
    setSelectedGuide(guideData);
    setSelectedChatIds(chatIds || []);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordConfirm = async (action: 'pass' | 'fail') => {
    setIsPasswordModalOpen(false);
    
    if (action === 'pass' && selectedGuide) {
      // Create winner object
      const winner: Winner = {
        guide_id: selectedGuide.id,
        name: selectedGuide.name,
        department: selectedGuide.department,
        supervisor: selectedGuide.supervisor,
        timestamp: new Date().toISOString(),
        chat_ids: selectedChatIds
      };
      
      // Save to database
      await saveWinnerToDatabase(winner);
      setCurrentWinner(winner);
      
      // Winner display and confetti will stay until manually closed
    } else if (action === 'fail' && selectedGuide) {
      // Create loser object
      const loser: Loser = {
        guide_id: selectedGuide.id,
        name: selectedGuide.name,
        department: selectedGuide.department,
        supervisor: selectedGuide.supervisor,
        timestamp: new Date().toISOString(),
        chat_ids: selectedChatIds
      };
      
      // Save loser to database
      await saveLoserToDatabase(loser);
      
      // Show fail animation
      setFailedGuideName(selectedGuide.name);
      setShowFailAnimation(true);
      
      // Fail animation will stay until manually closed
    }
    
    // Reset selected guide
    setSelectedGuide(null);
    setSelectedChatIds([]);
  };

  const handleCloseWinner = () => {
    setCurrentWinner(null);
  };

  const handleCloseFail = () => {
    setShowFailAnimation(false);
    setFailedGuideName('');
  };

  // Show login portal if not logged in
  if (!isLoggedIn) {
    return <LoginPortal onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/stitch-n-pitch-logo.png" 
              alt="Stitch n Pitch Logo" 
              className="h-20 w-auto animate-pulse"
            />
          </div>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Stitch n Pitch contest data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden ${isMobile ? 'mobile-layout' : ''}`}>
      {/* Dynamic Orbs Background */}
      <DynamicOrbs />
      
      {/* Global Confetti - Active when there are any winners */}
      <ConfettiAnimation 
        isActive={winners.length > 0 || eliteWinners.length > 0} 
        intensity="light" 
      />

      {/* Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        winnerCount={winners.length}
        eliteWinnerCount={eliteWinners.length}
        onOpenWinHistoryDashboard={() => setIsWinHistoryDashboardOpen(true)}
        onOpenExportData={() => setIsExportDataOpen(true)}
        onOpenBackupRestore={() => setIsBackupRestoreOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className={`relative z-10 ${isMobile ? 'mobile-content' : ''}`}>
        {currentTab === 'selection' && (
          <RandomGuideSelector 
            onGuideSelected={handleGuideSelected} 
            winners={winners}
          />
        )}

        {currentTab === 'elite-spiral' && (
          <EliteSpiralPanel 
            winners={winners} 
            eliteWinners={eliteWinners}
            onEliteWinnerAdded={saveEliteWinnerToDatabase}
          />
        )}
        {currentTab === 'winners' && (
          <WinnerHistory 
            winners={winners} 
            eliteWinners={eliteWinners}
            onDeleteWinner={deleteWinnerFromDatabase}
            onDeleteEliteWinner={deleteEliteWinnerFromDatabase}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>

      {/* Winner Display Overlay */}
      {currentWinner && (
        <WinnerDisplay
          winner={currentWinner}
          onBack={handleCloseWinner}
        />
      )}

      {/* Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setSelectedGuide(null);
          setSelectedChatIds([]);
        }}
        onConfirm={(action) => {
          handlePasswordConfirm(action);
        }}
        guideName={selectedGuide?.name || ''}
        chatIds={selectedChatIds}
        isLoggedIn={true}
      />

      {/* New Feature Modals */}
      <WinHistoryDashboard
        isOpen={isWinHistoryDashboardOpen}
        onClose={() => setIsWinHistoryDashboardOpen(false)}
        winners={winners}
        eliteWinners={eliteWinners}
      />

      <ExportData
        isOpen={isExportDataOpen}
        onClose={() => setIsExportDataOpen(false)}
        winners={winners}
        losers={losers}
        eliteWinners={eliteWinners}
        isLoggedIn={isLoggedIn}
      />

      <BackupRestore
        isOpen={isBackupRestoreOpen}
        onClose={() => setIsBackupRestoreOpen(false)}
        winners={winners}
        losers={losers}
        eliteWinners={eliteWinners}
        onRestoreWinners={handleRestoreWinners}
        isLoggedIn={isLoggedIn}
      />

      {/* Fail Animation */}
      <FailAnimation 
        isActive={showFailAnimation} 
        guideName={failedGuideName}
        onClose={handleCloseFail}
        isElite={false}
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;