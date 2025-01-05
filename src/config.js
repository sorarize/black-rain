import { random, pick, randomSign } from "./utils";

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
  Shower: 2000,
  Torrential: 5000,
};

const angleMap = {
  Drizzle: 0,
  Shower: random(5, 10) * randomSign(),
  Torrential: 20,
};

export const SKY_HEIGHT = 2000;
export const PLANE_SIZE = 600;
export const RAIN_COUNT = rainCountMap[level];
export const RAIN_LENGTH = lengthMap[level];
export const RAIN_SPEED = speedMap[level];
export const RAIN_ANGLE = angleMap[level];

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