import React from 'react';
import { TooltipProps } from 'recharts';

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-gray-700 p-2 rounded text-white">
          <p className="intro">{`Fist Type: ${payload[0].payload.fistType}`}</p>
          <p className="intro">{payload[0].payload.hand === 0 ? "Hand: Left" : "Hand: Right"}</p>
          <p className="intro">{`Speed: ${payload[0].payload.speed.toFixed(2)}`} km/h</p>
          <p className="intro">{`Acceleration: ${payload[0].payload.acceleration.toFixed(2)}`} Gs</p>
          <p className="intro">{`Force: ${payload[0].payload.force.toFixed(2)}`} Netwons</p>
          {payload[0].payload.timestamp ? <p className="intro">{`Timestamp: ${payload[0].payload.timestamp}`}</p> : null}
        </div>
      );
    }
    return null;
  };

export default CustomTooltip;