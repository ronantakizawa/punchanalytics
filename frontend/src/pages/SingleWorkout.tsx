import React, { useState, useEffect } from 'react';
import { calculateStatistics, getCombos, getPunchData } from '../utils/datahandler';
import { ComboItem, JsonData, HomeProps, Statistics} from '../utils/types';
import StatisticBox from '../components/StatisticBox';
import Graph from '../components/Graph';
import { useNavigate } from 'react-router-dom';
import Combos from '../components/Combos';
import Loading from '../components/Loading';
import { useLocation } from 'react-router-dom';
import { handleSignOut } from '../utils/handlesignout';
import Title from '../components/Title';
import Sidebar from '../components/Sidebar';


const SingleWorkouts: React.FC<HomeProps> = ({ workouts}) => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [graph, setGraph] = useState<Array<{ speed: number, force: number, acceleration: number, timestamp: string, hand:number | undefined, fistType:string }>>([]);
  const [combos,setCombos] = useState<ComboItem[][] | null>(null);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { avgstats } = location.state;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigateHome = () => navigate('/home');
  const navigateSingleWorkout = () => navigate('/singleworkout', { state: { avgstats: avgstats } });
  const navigateVideoAnalysis = () => navigate('/videoanalysis');
  const handleLogout = () => handleSignOut(navigate); 

  useEffect(() => {
    const body = document.body;
  
    // Handling sidebar state
    if (isSidebarOpen) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }
  
    // Handling workouts and currentWorkoutIndex state
    if (workouts && workouts.length > 0 && currentWorkoutIndex < workouts.length) {
      setIsLoading(true);
      processJsonData(workouts[currentWorkoutIndex]);
      setIsLoading(false);
    }
  
    // Cleanup function for sidebar state
    return () => {
      body.classList.remove('overflow-hidden');
    };
  }, [isSidebarOpen, workouts, currentWorkoutIndex]); 



  const handleNextWorkout = () => {
    if (currentWorkoutIndex < workouts.length - 1) {
      setCurrentWorkoutIndex(currentWorkoutIndex + 1);
    } 
  };

  const handlePreviousWorkout = () => {
    if (currentWorkoutIndex > 0) {
      setCurrentWorkoutIndex(currentWorkoutIndex - 1);
    } 
  };


  const processJsonData = (json: JsonData) => {
    const statistics = calculateStatistics(json);
    if (statistics){
      setStats(statistics);
      setGraph(getPunchData(json))
      const combos = getCombos(json);
      setCombos(combos);

    }
};
  


  return (
    <div className="bg-black animate-fade-in">
      <div className="pt-10">
  {isLoading ? (
    <div className="fixed inset-0 bg-black z-40 flex justify-center items-center">
      <Loading />
    </div>
  ) : (
    <>
    <Title isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`w-60 absolute top-0 left-0 z-50 h-full bg-orange-500 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            navigateHome={navigateHome}
            navigateSingleWorkout={navigateSingleWorkout}
            navigateVideoAnalysis={navigateVideoAnalysis}
            handleLogout={handleLogout}
      />
</div>
<div>
    <div className='flex justify-center mb-3'>
    <button
                onClick={handlePreviousWorkout}
                className={`bg-orange-500 text-white px-4 rounded-md hover:bg-orange-600 font-bold ${currentWorkoutIndex === 0 ? 'invisible pointer-events-none' : ''}`}
              >
                ←
              </button>

              <span className="mx-5 text-xl text-white">{"File #" + (currentWorkoutIndex + 1)}</span>

              <button
                onClick={handleNextWorkout}
                className={`bg-orange-500 text-white px-4 rounded-md hover:bg-orange-600 font-bold ${currentWorkoutIndex === workouts.length - 1 ? 'invisible pointer-events-none' : ''}`}
              >
                →
              </button>
              </div>

              <div className='mb-5 flex text-sm justify-center -my-1'>
                <p>You have {workouts.length} workouts</p>
              </div>
              </div>
            <div className='bg-black'>
                {stats && (
                  <>
                    <StatisticBox stats={{
                      avgStarRating: stats.avgStarRating,
                      avgAcceleration: stats.avgAcceleration,
                      avgSpeed: stats.avgSpeed,
                      avgForce: stats.avgForce,
                      modeHand: stats.modeHand,
                      modePunchType: stats.modePunchType
                    }} avg={avgstats} />
                    <div className="max-w-xs mx-auto md:max-w-3xl">
                      <Graph data={graph.map(item => ({
                        timestamp: item.timestamp,
                        hand:item.hand,
                        speed: item.speed,
                        acceleration: item.acceleration,
                        force:item.force,
                        fistType:item.fistType
                        }))} 
                        singleWorkout={true} />
                      <Combos combos={combos} />
                    </div>
                  </>
                )}
              </div></>
  )}
</div>
</div>

  );
};

export default SingleWorkouts;
