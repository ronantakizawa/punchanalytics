import { JsonData, Statistics, AggregateStatistics, Punch, ScrapedData, ComboItem } from "./types";

  export const calculateMode = (array: number[] | string[]): number | string => {
    const frequencyMap: { [key: string]: number } = {};
    let maxFreq = 0;
    let mode: number | string = array[0];

    array.forEach(item => {
      const frequency = (frequencyMap[item.toString()] || 0) + 1;
      frequencyMap[item.toString()] = frequency;

      if (frequency > maxFreq) {
        maxFreq = frequency;
        mode = item;
      }
    });

    return mode;
  };
  
  export const calculateStatistics = (jsonData: JsonData): Statistics | undefined => {
    if (validateJson(jsonData)){
    const total = jsonData.punches.reduce<ScrapedData>(
      (acc, punch) => {
        acc.starRating += punch.starRating;
        acc.acceleration += punch.acceleration;
        acc.speed += punch.speed;
        acc.force += punch.acceleration * 3;
        acc.hands.push(punch.hand);
        acc.fistTypes.push(punch.fistType === '1' ? 'Straightpunch' : (punch.fistType === '2' ? 'Uppercut' : 'Hook'));
        return acc;
      },
      { starRating: 0, acceleration: 0, speed: 0, force: 0, hands: [], fistTypes: [] }
    );

    const length = jsonData.punches.length;
    return {
      avgStarRating: total.starRating / length,
      avgAcceleration: total.acceleration / length,
      avgSpeed: total.speed / length,
      avgForce: total.force / length,
      modeHand: calculateMode(total.hands) as number,
      modePunchType: calculateMode(total.fistTypes) as string,
    };
  }
  else{
    return undefined;
  }
  };

  export const calculateAggregateStatistics = (jsonDataArray: JsonData[]): AggregateStatistics => {
    const starArray = [];
    const speedArray = [];
    const accelerationArray = [];
    const forceArray = [];
    const handArray = [];
    const fistTypeArray = [];
  
    for (const jsonData of jsonDataArray) {
      if (validateJson(jsonData)) {
        const statistics = calculateStatistics(jsonData);
        if (statistics){
          starArray.push(statistics.avgStarRating);
          speedArray.push(statistics.avgSpeed);
          accelerationArray.push(statistics.avgAcceleration);
          forceArray.push(statistics.avgForce);
          handArray.push(statistics.modeHand);
          fistTypeArray.push(statistics.modePunchType === '1' ? 'Straightpunch' : (statistics.modePunchType === '2' ? 'Uppercut' : 'Hook'));
        }
      }
    }
  
    // Calculate averages and modes
    const starAverage = starArray.reduce((a, b) => a + b, 0) / starArray.length;
    const speedAverage = speedArray.reduce((a, b) => a + b, 0) / speedArray.length;
    const accelerationAverage = accelerationArray.reduce((a, b) => a + b, 0) / accelerationArray.length;
    const forceAverage = forceArray.reduce((a, b) => a + b, 0) / forceArray.length;
    const handMode = calculateMode(handArray);
    const punchMode = calculateMode(fistTypeArray);
  
    return {
      aggregatedStats: {
        avgStarRating: starAverage,
        avgAcceleration: accelerationAverage,
        avgSpeed: speedAverage,
        avgForce: forceAverage,
        modeHand: handMode as number,
        modePunchType: punchMode as string,
      },
      starArray,
      speedArray,
      accelerationArray,
      forceArray,
      handArray,
      fistTypeArray
    };
  };
  
  export const validateJson = (json: JsonData): json is JsonData => {
    // Check if the JSON structure matches the specified format
    const isValid = typeof json === 'object' &&
      json !== null &&
      'version' in json &&
      'punches' in json &&
      Array.isArray(json.punches) &&
      json.punches.every((punch: Punch) => (
        typeof punch === 'object' &&
        punch !== null &&
        'id' in punch &&
        'timestamp' in punch &&
        'starRating' in punch &&
        'acceleration' in punch &&
        'speed' in punch &&
        'inTime' in punch &&
        'outTime' in punch &&
        'distance' in punch &&
        'hand' in punch &&
        'fistType' in punch
      ));
  
    return isValid;
  };

  export const formatTime = (milliseconds:number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    let hours : string | number = Math.floor(totalSeconds / 3600);
    let minutes : string | number = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds : string | number = totalSeconds - (hours * 3600) - (minutes * 60);
  
    // Padding each value with leading zero if needed
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
  
    return `${hours}:${minutes}:${seconds}`;
  }

  export const getPunchData = (json:JsonData) =>{
    const firstTimestamp = json.punches[0]?.timestamp || 0;
    const graphData = json.punches.map((punch: Punch) => ({
      speed: punch.speed,
      force: punch.acceleration * 3,
      acceleration:punch.acceleration,
      timestamp: formatTime(punch.timestamp - firstTimestamp),
      fistType: punch.fistType === '1' ? 'Straightpunch' : (punch.fistType === '2' ? 'Uppercut' : 'Hook'),
      hand: punch.hand
  }));
  return graphData
  }
  export const getCombos = (json: JsonData): ComboItem[][] => {
    const combos: ComboItem[][] = [];
    const punches = json.punches;
    const firstTimestamp = json.punches[0]?.timestamp || 0;
  
    for (let i = 0; i < punches.length; i++) {
      const combo: ComboItem[] = [{
        fistType: punches[i].fistType === '1' ? 'Straightpunch' : (punches[i].fistType === '2' ? 'Uppercut' : 'Hook'),
        timestamp: formatTime(punches[i].timestamp - firstTimestamp),
        hand:punches[i].hand
      }];
  
      for (let j = i + 1; j < punches.length; j++) {
        if (Math.abs(punches[j].timestamp - punches[j - 1].timestamp) <= 500) {
          combo.push({
            fistType: punches[i].fistType === '1' ? 'Straightpunch' : (punches[i].fistType === '2' ? 'Uppercut' : 'Hook'),
            timestamp: formatTime(punches[j].timestamp - firstTimestamp),
            hand: punches[j].hand
          });
        } else {
          break; // Break the inner loop if the time difference is more than 500 ms
        }
      }
  
      if (combo.length > 1) {
        combos.push(combo);
        i += combo.length - 1; // Skip the punches already added to a combo
      }
    }
  
    return combos;
  };