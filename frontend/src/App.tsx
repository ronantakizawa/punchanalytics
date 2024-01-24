// App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { User } from 'firebase/auth';
import { getStorage, ref, getBlob, listAll } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebase';
import { JsonData } from './utils/types';
import SingleWorkout from './pages/SingleWorkout';
import VideoAnalysis from './pages/VideoAnalysis';

function App() {
  const app = initializeApp(firebaseConfig);
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<JsonData[]>([]);

  useEffect(() => {
    if (user) {
      fetchWorkoutData();
    }
  }, [user]);

  const fetchWorkoutData = async () => {
    if (!user) return;

    const storage = getStorage(app);
    const filesRef = ref(storage, `punches/${user.uid}`);
    try {
      const fileList = await listAll(filesRef);
      const filePromises = fileList.items.map(async (fileRef) => {
        const blob = await getBlob(fileRef);
        return new Response(blob).json();
      });

      const filesData = await Promise.all(filePromises);
      setWorkouts(filesData);
    } catch (error) {
      console.error("Failed to fetch workout data", error);
    }
  };

  return (
    <Router>
      <div className=" bg-black  flex flex-col items-center pt-8 text-white">
        <Routes>
        <Route path="/" element={  <Login onUserLogin={setUser} />} />
        <Route path="/home" element={ user ? <Home workouts={workouts}  />  :<Navigate to="/" /> } />
        <Route path="/singleworkout" element={ user ? <div className="animate-fade-in"><SingleWorkout workouts={workouts}  /> </div> :<Navigate to="/" /> } />
        <Route path="/singleworkout" element={ user ? <div className="animate-fade-in"><SingleWorkout workouts={workouts}  /> </div> :<Navigate to="/" /> } />
        <Route path="/videoanalysis" element={user ? <div className="animate-fade-in"><VideoAnalysis workouts={workouts} /> </div> :<Navigate to="/" /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
