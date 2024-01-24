import { User } from "@firebase/auth";

export interface Punch {
    id: string;
    timestamp: number;
    starRating: number;
    acceleration: number;
    speed: number;
    inTime: number;
    outTime: number;
    force: number;
    hand: number;
    fistType: string;
  }
  
export interface JsonData {
    punches: Punch[];
  }

export interface HomeProps {
    workouts: JsonData[];
}

export interface SingleWorkoutProps {
  workouts: JsonData[];
  avgstats: Statistics;
}
  
  export interface Statistics {
    avgStarRating: number;
    avgAcceleration: number;
    avgSpeed: number;
    avgForce: number;
    modeHand: number;
    modePunchType: string;
  }
  export interface StatisticProps {
    title: string;
    value: number | string;
    comparison: string | undefined;
  }
  
  export interface ScrapedData {
    starRating: number;
    acceleration: number;
    speed: number;
    force: number;
    hands: number[];
    fistTypes: string[];
  }

  export interface AggregateStatistics {
    aggregatedStats: Statistics;
    starArray: number[];
    speedArray: number[];
    accelerationArray: number[];
    forceArray: number[];
    handArray: number[];
    fistTypeArray: string[];
  }

  export type GraphProps = {
    data: Array<{
      timestamp: string | undefined;
      hand:number | undefined;
      speed: number;
      acceleration: number;
      force: number;
    }>;
    singleWorkout : boolean;
  };

  export type StatisticBoxProps = {
    stats: {
      avgStarRating: number;
      avgAcceleration: number;
      avgSpeed: number;
      avgForce: number;
      modeHand: number;
      modePunchType: string;
    };
    avg?: {
      avgStarRating: number;
      avgAcceleration: number;
      avgSpeed: number;
      avgForce: number;
      modeHand: number;
      modePunchType: string;
    };
  };

  export type ComboItem = {
  fistType: string;
  hand: number;
  timestamp: string;
};

export interface LoginProps {
  onUserLogin: (user: User) => void;
}

export interface TitleProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
  navigateHome: () => void; 
  navigateSingleWorkout: () => void;
  navigateVideoAnalysis: () => void;

}
export interface ComboProps {
  combos: ComboItem[][] | null;
}

export interface FaceProps {
  times: number
}

export interface FaceDetectionProps {
  detections: string[],
  video:string,

}
