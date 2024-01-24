
import React from 'react';
import Statistic from "./Statistic";
import { StatisticBoxProps } from '../utils/types';

const StatisticBox: React.FC<StatisticBoxProps> = ({ stats,avg}) => {

  const higher = "Higher than your average";
  const lower = "Lower than your average";
  const same = "Same as your average";
  const different = "Different to your average";
  return (
    <div className="p-4 bg-gray-800 shadow rounded-lg mb-10 mx-auto max-w-[300px] md:max-w-[1200px]">
      <div className="text-center font-bold text-xl mb-4 text-white">Performance from Workouts</div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-y-5 gap-x-5">
        <Statistic title="Average Star Rating ⭐️" value={stats.avgStarRating.toFixed(2)} comparison={avg?.avgStarRating ? (stats.avgStarRating > avg.avgStarRating ? higher : lower) : undefined }/>
        <Statistic title="Average Speed" value={stats.avgSpeed.toFixed(2) + " km/h"} comparison={avg?.avgSpeed ? (stats.avgSpeed > avg.avgSpeed ? higher : lower) : undefined }/>
        <Statistic title="Average Acceleration" value={stats.avgAcceleration.toFixed(2) +" Gs"} comparison={avg?.avgAcceleration ? (stats.avgAcceleration > avg.avgAcceleration ? higher: lower) : undefined } />
        <Statistic title="Average Force" value={stats.avgForce.toFixed(2) + " Newtons" } comparison={avg?.avgForce ? (stats.avgForce > avg.avgForce ? higher : lower) : undefined }/>
        <Statistic title="Most Common Hand" value={stats.modeHand === 0 ? "Left" : "Right"} comparison={avg?.modeHand ? (stats.modeHand === avg.modeHand ? same : different) : undefined }/>
        <Statistic title="Most Common Punch" value={stats.modePunchType} comparison={avg?.modePunchType ? (stats.modePunchType > avg.modePunchType ? same : different) : undefined }/>
      </div>
    </div>
  );
};

export default StatisticBox;
