import rainVert from '../shaders/rain.vert';
import rainFrag from '../shaders/rain.frag';
import {
  SKY_HEIGHT,
  RAIN_COUNT,
  PLANE_SIZE,
  RAIN_SPEED,
  RAIN_LENGTH,
  RAIN_ANGLE,
  RAIN_OPACITY,
  rainIntensityFn
} from '../config';
import { easeInCubic, random } from '../utils';
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
  hasRipple: false,
  intensity: Math.random()  // Add intensity for each raindrop
}));

function resetRain(drop) {
  // Calculate horizontal displacement based on angle
  const angleRad = RAIN_ANGLE * Math.PI / 180;
  const horizontalDisplacement = SKY_HEIGHT * Math.tan(angleRad);

  // Calculate spawn range based on angle
  // We want the rain to be visible in the viewing area when it hits the ground
  const viewRange = PLANE_SIZE * 2;  // Total visible range
  const spawnOffset = horizontalDisplacement;  // Offset due to angle

  // Adjust spawn position to ensure rain falls within view
  const minX = -viewRange - spawnOffset;
  const maxX = viewRange - spawnOffset;

  drop.x = random(minX, maxX);
  drop.y = SKY_HEIGHT;
  drop.z = random(-2, .5) * PLANE_SIZE;
  drop.hasRipple = false;
  drop.intensity = Math.random();  // Reset intensity when recycling
}

function getRainIntensity() {
  const waitDuration = 0.1;
  const fadeInDuration = 6;
  const startTime = getTime();

  if (startTime < waitDuration) {
    return 0;
  }

  const fadeProgress = Math.min((startTime - waitDuration) / fadeInDuration, 1.0);

  if (fadeProgress < 1.0) {
    return easeInCubic(fadeProgress);
  }

  return rainIntensityFn(getTime());
}

// Update rain positions
export function updateRain() {
  const time = getTime();
  const deltaTime = time - lastTime;
  lastTime = time;

  const moveDistance = RAIN_SPEED * deltaTime * 60;
  const intensity = getRainIntensity();

  rainPositions.forEach(drop => {
    // Calculate x and y movement based on angle
    drop.x += drop.length * moveDistance * rainDirectionVec[0] * .99;
    drop.y += drop.length * moveDistance * rainDirectionVec[1];

    if (drop.y < drop.length && !drop.hasRipple && drop.intensity < intensity) {
      addCircle(drop.x, drop.z);
      addSplash(drop.x, drop.z);
      drop.hasRipple = true;
    }

    if (drop.y < -drop.length) {
      resetRain(drop);
    }
  });

  rainBuffer({
    data: rainPositions.map(p => [p.x, p.y, p.z, p.length])
  });
  rainIntensityBuffer({
    data: rainPositions.map(p => p.intensity)
  });
}

const rainWidth = .8;
const rainDrop = [
  [-rainWidth, -1, 0], [rainWidth, -1, 0], [0, 1, 0],
  [-rainWidth, -1, 0], [0, 1, 0], [0, 1, 0],
];

// Create dynamic buffer with extra component for seed
export const rainBuffer = regl.buffer({
  usage: 'dynamic',
  data: rainPositions.map(p => [p.x, p.y, p.z, p.length])
});

// Create intensity buffer
export const rainIntensityBuffer = regl.buffer({
  usage: 'dynamic',
  data: rainPositions.map(p => p.intensity)
});

export const drawRain = regl({
  vert: rainVert,
  frag: rainFrag,
  attributes: {
    position: rainDrop,
    instancePosition: {
      buffer: rainBuffer,
      divisor: 1
    },
    instanceIntensity: {
      buffer: rainIntensityBuffer,
      divisor: 1
    }
  },
  uniforms: {
    projection: regl.prop('projection'),
    view: regl.prop('view'),
    currentTime: regl.context('time'),
    timeScale: () => timeScale.value,
    rainDirection: () => rainDirectionVec,
    rainIntensity: () => getRainIntensity(),
    rainOpacity: () => RAIN_OPACITY,
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