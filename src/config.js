import { random, pick, randomSign, chance } from "./utils";

export const level = pick({
  Drizzle: 1,
  Shower: 1,
  Torrential: 1,
});

const lengthMap = {
  Drizzle: 20,
  Shower: 100,
  Torrential: 100,
}

const speedMap = {
  Drizzle: 2,
  Shower: 1,
  Torrential: 1,
}

const rainCountMap = {
  Drizzle: 200,
  Shower: 3000,
  Torrential: 8000,
};

const angleMap = {
  Drizzle: 0,
  Shower: random(5, 10) * randomSign(),
  Torrential: 20,
};

const rippleDurationMap = {
  Drizzle: 4,
  Shower: 1,
  Torrential: 1,
};

const rippleRadiusRangeMap = {
  Drizzle: [50, 220],
  Shower: [100, 170],
  Torrential: [100, 300],
};

const rainIndensityMap = {
  Drizzle: t => {
    t = t * .2;
    return .2 + (Math.sin(t) + 1) * .5 * .8;
  },
  Shower: t => {
    t = t * .1;
    return .1 + (Math.sin(t) + 1) * .5 * .9;
  },
  Torrential: t => {
    return .5 + (Math.sin(t) + 1) * .5 * .5;
  },
};

export const INVERT = chance(.01) ? 0 : 1;
export const SKY_HEIGHT = 2000;
export const PLANE_SIZE = 600;
export const RAIN_COUNT = rainCountMap[level];
export const RAIN_LENGTH = lengthMap[level];
export const RAIN_SPEED = speedMap[level];
export const RAIN_ANGLE = angleMap[level];
export const RAIN_RIPPLE_DURATION = rippleDurationMap[level];
export const RAIN_RIPPLE_RADIUS_RANGE = rippleRadiusRangeMap[level];
export const RAIN_OPACITY = chance(.5) ? .2 : .8;
export const rainIntensityFn = rainIndensityMap[level];

const distance = 800;
export const INITIAL_CAMERA = {
  distance,
  height: 400,
  position: [0, -200, distance],
  target: [0, SKY_HEIGHT * .15, 0],
  up: [0, 1, 0],
};

export const CAMERA_DISTANCE_LIMITS = {
  MIN: 600,
  MAX: 1000
};

export const CAMERA_ROTATION_LIMITS = {
  // Horizontal rotation limits (radians)
  PHI: {
    MIN: -Math.PI * 0.2,  // Left
    MAX: Math.PI * 0.2    // Right
  },
  // Vertical rotation limits (radians)
  THETA: {
    MIN: 0,   // Bottom
    MAX: Math.PI * 0.5   // Top
  }
};