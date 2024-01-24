import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { handleSignOut } from '../utils/handlesignout';
import Title from '../components/Title';
import Sidebar from '../components/Sidebar';
import { HomeProps, JsonData, Statistics } from '../utils/types';
import { calculateAggregateStatistics } from '../utils/datahandler';
import { ClipLoader } from 'react-spinners';
import { handleAnalyzeClick, handleFileChange } from '../utils/videoprocessing';
import FaceDetection from '../components/FaceDetection';

const VideoAnalysis: React.FC<HomeProps> = ({ workouts }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching,setIsFetching] = useState(false);
  const [file, setFile] = useState<FileList | null>(null);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detections, setDetections] = useState<string[]>([]);
  const [video, setVideo] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const navigateHome = () => navigate('/home');
  const navigateSingleWorkout = () => navigate('/singleworkout', { state: { avgstats: stats } });
  const navigateVideoAnalysis = () => navigate('/videoanalysis');
  const handleLogout = () => handleSignOut(navigate); 

  useEffect(() => {
    console.log(detections)
    console.log(video)
    const body = document.body;
  
    // Handling sidebar state
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

    // Cleanup function for sidebar state
    return () => {
      body.classList.remove('overflow-hidden');
    };
  }, [isSidebarOpen]); 

  const processJsonDataMultiple = (jsonDataArray: JsonData[]) => {
    const statistics = calculateAggregateStatistics(jsonDataArray);
    if (statistics) {
      setStats(statistics.aggregatedStats);
    }
  };

  const onAnalyzeClick = (file: FileList) => handleAnalyzeClick(file, setIsFetching,setDetections,setVideo);
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => handleFileChange(event, setFile);

  
  
  
  
  return (
    <div className="bg-black min-h-screen flex flex-col animate-fade-in">
      {!isLoading ? (
        <div className="text-center p-6">
          <Title isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          navigateHome={navigateHome}
          navigateSingleWorkout={navigateSingleWorkout}
          navigateVideoAnalysis={navigateVideoAnalysis}
          handleLogout={handleLogout}
          />
          <h2 className="text-xl font-semibold mb-4 text-white">Upload a workout video to get defensive feedback</h2>
          <p className="text-white">
            When uploading a video, you will get a new video showing every time your guard is down with the timestamps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center my-4">
            <input
              type="file"
              accept="video/*"
              className="file:mb-2 sm:mb-0 sm:file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-700 file:text-white file:bg-gray-800 hover:file:bg-gray-700"
              onChange={onFileChange}
            />
            <button
              onClick={() => window.open("https://github.com/ronantakizawa/punchanalytics", "_blank")}
              className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600">
              See Example
            </button>
          </div>
          <div className="flex flex-col items-center">
            { file ? 
            <button
            onClick={()=> onAnalyzeClick(file)}
            className="bg-red-500 text-white py-2 px-8 rounded-md hover:bg-red-600 mb-4">
                Analyze
            </button>
            : null
            }
            {isFetching ? (
              <ClipLoader size={250} color={"orange"} />
            ) : (
              video && (
                <>
                <FaceDetection detections={detections} video={video} />  
                </>
            )
)}
        </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default VideoAnalysis;
