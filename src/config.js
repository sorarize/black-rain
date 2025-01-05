export const SKY_HEIGHT = 2000;
export const PLANE_SIZE = 600;
export const RAIN_COUNT = 2000;
export const RAIN_LENGTH = 100;
export const RAIN_SPEED = .7;
export const RAIN_ANGLE = 0;  // degree

const distance = 800;
export const INITIAL_CAMERA = {
  distance,
  height: 400,
  position: [0, -200, distance],
  target: [0, SKY_HEIGHT * .15, 0],
  up: [0, 1, 0],
};


// export const SKY_HEIGHT = 2000;
// export const PLANE_SIZE = 1000;
// export const RAIN_COUNT = 2000;
// export const RAIN_LENGTH = 100;
// export const RAIN_SPEED = .4;
// export const RAIN_ANGLE = 0;  // degree

// const distance = 800;
// export const INITIAL_CAMERA = {
//   distance,
//   height: 400,
//   position: [0, -200, distance],
//   target: [0, SKY_HEIGHT * .15, 0],
//   up: [0, 1, 0],
// };
