import React from 'react';
import powaLogo from '../assets/powaboxing.svg';
import { TitleProps } from '../utils/types';

const Title: React.FC<TitleProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div className="flex items-center justify-start w-full">
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <p className='text-4xl mb-3 ml-14'>&#9776;</p>
      </button>

      <div className="flex-grow"></div>

      <div className="flex items-center justify-center mr-10">
        <h1 className="text-2xl font-bold text-center">Punch Analytics</h1>
        <img src={powaLogo} alt="POWA logo" className="w-16 h-16 ml-2" />
      </div>

      <div className="flex-grow"></div>
    </div>
  );
};

export default Title;
