import React from 'react';
import { ComboItem, ComboProps} from '../utils/types';

const Combo: React.FC<{ combo: ComboItem[] }> = ({ combo }) => {
  return (
    <div className="flex gap-2 p-1 md:p-2 rounded bg-gray-700 flex-wrap text-sm" >
      {combo.map((punch, index) => (
        <span key={index} className="text-white font-mono">
          {punch.fistType + (punch.hand === 0 ? '(L)' : '(R)')} {index < combo.length - 1 ? ',' : ''}
        </span>
      ))}
      <p className="text-orange-400">{combo[0].timestamp + "-"+combo[combo.length-1].timestamp}</p>
    </div>
  );
};

const Combos: React.FC<ComboProps> = ({ combos }) => {
  if (!combos) {
    return null;
  }

  return (
    <div className="p-3 md:p-6 bg-gray-800 shadow rounded-lg mb-10 h-80 overflow-y-scroll">
      <div className="font-bold text-2xl mb-4 text-white">Combos</div>
      <div className="flex flex-col space-y-3">
        {combos.map((combo: ComboItem[], index: number) => (
          <Combo key={index} combo={combo} />
        ))}
      </div>
    </div>
  );
};

export default Combos;

