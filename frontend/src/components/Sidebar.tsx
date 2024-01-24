// Sidebar.tsx
import React from 'react';
import powaLogo from '../assets/powaboxing.svg';
import { SidebarProps } from '../utils/types';

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  navigateHome,
  navigateSingleWorkout,
  navigateVideoAnalysis,
  handleLogout,
}) => {
  return (
    <div className={`w-60 absolute top-0 left-0 z-50 min-h-screen bg-orange-500 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col items-start justify-between h-full p-4">
        <div className="flex w-full">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white text-xl font-bold mb-10">
            &#10005;
          </button>
          <div className="flex items-center justify-center mb-10 ml-5">
            <h1 className="text-l font-bold text-center">Punch Analytics</h1>
            <img src={powaLogo} alt="POWA logo" className="w-8 h-8 ml-2" />
          </div>
        </div>
        <nav className="flex flex-col w-full font-bold h-full -mt-8">
          <button onClick={navigateHome} className="ml-5 text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Home</button>
          <button onClick={navigateSingleWorkout} className="ml-5 text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Single Workouts</button>
          <button onClick={navigateVideoAnalysis} className="ml-5 text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Video Analysis</button>
          <button onClick={handleLogout} className="ml-5 text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Sign Out</button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
