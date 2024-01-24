import React from 'react';
import { FaceDetectionProps } from '../utils/types';

const FaceDetection: React.FC<FaceDetectionProps> = ({ detections,video }) => {

  return (
    <><p className="text-white text-2xl font-bold mt-3">
      Your analyzed video is ready!
    </p><a href={video} download>
        <button className="bg-orange-500  mt-4 text-2xl  font-bold text-white py-2 px-4 rounded-md hover:bg-orange-600">
          Download Video</button>
      </a><div className="max-w-md mt-5 p-3 md:p-6 bg-gray-800 shadow rounded-lg mb-10 overflow-y-scroll">
        <div className="font-bold text-2xl mb-4 text-white">Face Detected at</div>
        <div className="flex flex-col space-y-3">
          <div className="flex flex-wrap gap-2 p-1 md:p-2 rounded bg-gray-700 text-sm">
            {detections.map((number: string, index: number) => (
              <span key={index} className="text-white font-mono">
                {number}{index < detections.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
      </div></>
  );
};

export default FaceDetection;
