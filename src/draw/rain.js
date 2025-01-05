import rainVert from '../shaders/rain.vert?raw';
import rainFrag from '../shaders/rain.frag?raw';
import { SKY_HEIGHT, RAIN_COUNT, PLANE_SIZE, RAIN_SPEED, RAIN_LENGTH, RAIN_ANGLE } from '../config';
import { random } from '../utils';
import { regl } from '../renderer';
import { timeScale, getTime } from '../time';
import { addCircle } from './circle';
import { addSplash } from './splash';

let lastTime = 0;

// Calculate rain direction vector
const angleRad = RAIN_ANGLE * Math.PI / 180;  // Convert to radians
const rainDirectionVec = [Math.sin(angleRad), -Math.cos(angleRad)];  // As array

// Initialize rain drop positions
export const rainPositions = Array(RAIN_COUNT).fill().map(() => ({
  x: random(-1, 1) * PLANE_SIZE,
  y: random(SKY_HEIGHT),
  z: random(-2, .5) * PLANE_SIZE,
  length: random(.3, 1) * RAIN_LENGTH,
  hasRipple: false
}));

// Update rain positions
export function updateRain() {
  const time = getTime();
  const deltaTime = time - lastTime;
  lastTime = time;

  const moveDistance = RAIN_SPEED * deltaTime * 60;

  rainPositions.forEach((drop, i) => {
    // Calculate x and y movement based on angle
    drop.x += drop.length * moveDistance * rainDirectionVec[0] * .99;
    drop.y += drop.length * moveDistance * rainDirectionVec[1];

    if (drop.y < drop.length && !drop.hasRipple) {
      addCircle(drop.x, drop.z);
      addSplash(drop.x, drop.z);
      drop.hasRipple = true;
    }

    if (drop.y < -drop.length) {
      // reset
      drop.y = SKY_HEIGHT;
      drop.x = (RAIN_ANGLE == 0 ? random(-2, 2) : random(-1.5, .5)) * PLANE_SIZE;
      drop.z = random(-2, .5) * PLANE_SIZE;
      drop.hasRipple = false;
    }
  });

  rainBuffer({
    data: rainPositions.map(p => [p.x, p.y, p.z, p.length])
  });
}

const rainWidth = .8;
const rainDrop = [
  [-rainWidth, -1, 0], [rainWidth, -1, 0], [0, 1, 0],
  [-rainWidth, -1, 0], [0, 1, 0], [0, 1, 0],
];

// Create dynamic buffer
export const rainBuffer = regl.buffer({
  usage: 'dynamic',
  data: rainPositions.map(p => [p.x, p.y, p.z, p.length])
});

export const drawRain = regl({
  vert: rainVert,
  frag: rainFrag,
  attributes: {
    position: rainDrop,
    instancePosition: {
      buffer: rainBuffer,
      divisor: 1
    }
  },
  uniforms: {
    view: regl.prop('view'),
    projection: regl.prop('projection'),
    rainDirection: rainDirectionVec,
    timeScale: () => timeScale.value
  },
  blend: {
    enable: true,
    func: {
      srcRGB: 'src alpha',
      srcAlpha: 1,
      dstRGB: 'one minus src alpha',
      dstAlpha: 1
    }
  },
  depth: {
    enable: true,
    mask: true,
  },
  count: 6,
  instances: RAIN_COUNT
});