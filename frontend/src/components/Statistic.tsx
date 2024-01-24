import { StatisticProps } from '../utils/types';

const Statistic: React.FC<StatisticProps> = ({ title, value, comparison }) => {

    return (
        <div className="text-left bg-gray-700 p-3 rounded-lg">
            <div className="text-gray-400 text-sm font-medium">{title}</div>
            <div className="text-lg font-bold text-white">{value}</div>
            {comparison && <p className="text-xs text-gray-400">{comparison}</p>}
        </div>
    );
};

export default Statistic;
