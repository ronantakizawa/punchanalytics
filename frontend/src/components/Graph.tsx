import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import CustomTooltip from './CustomToolTip';
import { GraphProps } from "../utils/types";

const Graph: React.FC<GraphProps> = ({ data, singleWorkout }) => {
  const [graphResizeIndexes, setGraphResizeIndexes] = useState({ speed: 2, acceleration: 2, force: 2 });
  const [chartWidthMultiplier, setChartWidthMultiplier] = useState(150);

  useEffect(() => {
    const handleResize = () => {
      setChartWidthMultiplier(window.innerWidth >= 768 ? 400 : 150);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateSize = (data: GraphProps['data']) => {
    if (!Array.isArray(data)) throw new Error('Input must be an array');
    return Math.ceil(data.length / 2) + 1;
  };

  const handleSliderChange = (type: keyof typeof graphResizeIndexes) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGraphResizeIndexes({ ...graphResizeIndexes, [type]: Number(event.target.value) });
  };

  const renderChart = (type: 'speed' | 'acceleration' | 'force', label: string, dataKey: string, unit: string) => (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-lg font-bold text-white mb-2 text-center">{singleWorkout ? `${label} Performance` : `Average ${label} from Workouts`}</h2>
      <div className="flex items-center space-x-4 mb-5">
        <h3 className="text-lg font-bold text-white">Zoom</h3>
        <input 
          type="range" 
          min="2" 
          max={calculateSize(data) * 2}  
          value={graphResizeIndexes[type]}
          onChange={handleSliderChange(type)}
          className="slider" 
        />
      </div>
      <div className="w-[150%] md:w-[75%] overflow-x-auto max-w-xs mx-auto md:max-w-3xl">
        <LineChart width={chartWidthMultiplier * graphResizeIndexes[type]} height={300} data={data}>
          <XAxis dataKey="timestamp" interval="preserveStartEnd" />
          <YAxis label={{ value: `${label} (${unit})`, angle: -90, position: 'insideLeft' }} dataKey={dataKey} />
          <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
          <Line type="monotone" dataKey={dataKey} stroke="#FFA500" />
        </LineChart>
      </div>
      <div className="text-center mt-2">
          <span className="text-orange-400">Scroll to see data →</span>
      </div>
    </div>
  );

  return (
    <div className="chart-container space-y-4 mb-5 bg-black">
      {renderChart('speed', 'Speed', 'speed', 'km/h')}
      {renderChart('acceleration', 'Acceleration', 'acceleration', 'Gs')}
      {renderChart('force', 'Force', 'force', 'Newtons')}
    </div>
  );
};

export default Graph;
