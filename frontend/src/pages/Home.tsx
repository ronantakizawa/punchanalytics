import React, { useState, useEffect } from 'react';
import {  calculateAggregateStatistics } from '../utils/datahandler';
import { JsonData, Statistics} from '../utils/types';
import StatisticBox from '../components/StatisticBox';
import Graph from '../components/Graph';
import {HomeProps } from '../utils/types';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { handleSignOut } from '../utils/handlesignout';
import Title from '../components/Title';
import Sidebar from '../components/Sidebar';

const Home: React.FC<HomeProps> = ({ workouts }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [graph, setGraph] = useState<Array<{ speed: number, force: number, acceleration: number, timestamp: string, hand:number | undefined, fistType:string }>>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navigateHome = () => navigate('/home');
  const navigateSingleWorkout = () => navigate('/singleworkout', { state: { avgstats: stats } });
  const navigateVideoAnalysis = () => navigate('/videoanalysis');
  const handleLogout = () => handleSignOut(navigate); 

  useEffect(() => {
    const body = document.body;
    if (isSidebarOpen) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }
    if (workouts && workouts.length > 0) {
      setIsLoading(true);
      processJsonDataMultiple(workouts);
      setIsLoading(false);
    }
    return () => {
      body.classList.remove('overflow-hidden');
    };
  }, [isSidebarOpen, workouts]);


  
  const processJsonDataMultiple = (jsonDataArray: JsonData[]) => {
    const statistics = calculateAggregateStatistics(jsonDataArray);
    if (statistics) {
      setStats(statistics.aggregatedStats);
      const transformedData = statistics.speedArray.map((speed, index) => ({
        speed: speed,
        force: statistics.forceArray[index],
        acceleration: statistics.accelerationArray[index],
        timestamp: `File# ${index+1}`,
        hand:undefined,
        fistType: statistics.fistTypeArray[index]
      }));
      
      setGraph(transformedData);
    }
  };

  

  return (
    <div className="bg-black">
      <div className="pt-10">
        {isLoading ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black">
            <Loading />
          </div>
        ) : (
          <div className="animate-fade-in">
            <Title isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            navigateHome={navigateHome}
            navigateSingleWorkout={navigateSingleWorkout}
            navigateVideoAnalysis={navigateVideoAnalysis}
            handleLogout={handleLogout}
             />
            {stats && (
              <>
                <StatisticBox stats={{
                    avgStarRating: stats.avgStarRating,
                    avgAcceleration: stats.avgAcceleration,
                    avgSpeed: stats.avgSpeed,
                    avgForce: stats.avgForce,
                    modeHand: stats.modeHand,
                    modePunchType: stats.modePunchType
                  }} 
                />
                <div className="flex justify-center my-5">
                  <button
                    onClick={() => navigate('/singleworkout', { state: { avgstats: stats } })}
                    className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 font-bold"
                  >
                    See my Workouts
                  </button>
                </div>
                <div>
                  <Graph data={graph.map(item => ({
                    timestamp: item.timestamp,
                    hand:item.hand,
                    speed: item.speed,
                    acceleration: item.acceleration,
                    force:item.force,
                    fistType:item.fistType

                    }))} 
                   singleWorkout={false}/>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
