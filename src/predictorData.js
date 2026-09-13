// Static tables for the race time predictor page.
//
// The predictor itself is interactive, so a crawler sees nothing of it. These
// tables put the same answers in plain HTML, for the people searching "half
// marathon to marathon predictor" and for the crawlers indexing that query.
//
// Every figure is derived from paceMath, so the page and the tool can never
// disagree.

import { POPULAR_DISTANCES_KM, RIEGEL_STANDARD, predictTime } from './paceMath';

export const PREDICTOR_SLUG = 'predictor';

// Common finishing times per distance, spanning club runner to first timer.
const SOURCE_TIMES = {
  '5K': [20, 22, 25, 28, 30, 35].map((m) => m * 60),
  '10K': [40, 45, 50, 55, 60, 70].map((m) => m * 60),
  // 105 is here deliberately: 1:45 is the worked example in the goal time guide.
  'Half Marathon': [90, 100, 105, 110, 120, 135, 150].map((m) => m * 60),
  Marathon: [180, 210, 240, 270, 300].map((m) => m * 60),
};

// One table per distance someone might have raced, predicting the other three.
export const predictorTables = (exponent = RIEGEL_STANDARD) =>
  Object.keys(POPULAR_DISTANCES_KM).map((source) => {
    const targets = Object.keys(POPULAR_DISTANCES_KM).filter((name) => name !== source);
    return {
      source,
      targets,
      rows: SOURCE_TIMES[source].map((seconds) => ({
        seconds,
        predictions: targets.map((target) =>
          predictTime(seconds, POPULAR_DISTANCES_KM[source], POPULAR_DISTANCES_KM[target], exponent)
        ),
      })),
    };
  });

export const PREDICTOR_PAGE = {
  slug: PREDICTOR_SLUG,
  title: 'Race Time Predictor: 5K, 10K, Half Marathon and Marathon',
  description:
    'Predict your finish time at any distance from a recent race result. Riegel formula tables for 5K, 10K, half marathon and marathon, with the pace each one needs.',
  heading: 'Race time predictor',
};
