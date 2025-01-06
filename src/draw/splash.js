import splashVert from '../shaders/splash.vert';
import splashFrag from '../shaders/splash.frag';
import { regl } from '../renderer';
import { timeScale, getTime } from '../time';
import { random } from '../utils';
import { RAIN_COUNT, PLANE_SIZE } from '../config';

const MAX_SPLASHES = RAIN_COUNT * 7; // Maximum number of splash effects

export let splashes = [];

const splashBuffer = regl.buffer({
  usage: 'dynamic',
  type: 'float',
  data: new Float32Array(MAX_SPLASHES * 4).fill(0)
});

const splashStartTimeBuffer = regl.buffer({
  usage: 'dynamic',
  type: 'float',
  data: new Float32Array(MAX_SPLASHES).fill(0)
});

const splashAngleBuffer = regl.buffer({
  usage: 'dynamic',
  type: 'float',
  data: new Float32Array(MAX_SPLASHES).fill(0)
});

export function addSplash(x, z) {
  const length = random(1, 4);
  const count = ~~random(3, 8);
  const unitAngle = 15 * Math.PI / 180;
  const wholeAngle = unitAngle * (count - 1);
  const startAngle = -wholeAngle / 2;

  // Check if exceeding maximum limit
  if (splashes.length + count > MAX_SPLASHES) {
    // Remove oldest splashes if limit exceeded
    splashes.splice(0, count);
  }

  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * unitAngle;
    splashes.push({
      x,
      y: 0,
      z,
      length,
      angle,
      startTime: getTime()
    });
  }
}

export function updateSplashes() {
  const now = getTime();

  splashes = splashes.filter(splash => {
    const timeDiff = now - splash.startTime;
    return timeDiff <= .1 / timeScale.value;
  });

  // Update all buffers
  const positionData = new Float32Array(MAX_SPLASHES * 4);
  const timeData = new Float32Array(MAX_SPLASHES);
  const angleData = new Float32Array(MAX_SPLASHES);

  // Fill actual data
  splashes.forEach((s, i) => {
    const baseIndex = i * 4;
    positionData[baseIndex] = s.x;
    positionData[baseIndex + 1] = s.y;
    positionData[baseIndex + 2] = s.z;
    positionData[baseIndex + 3] = s.length;
    timeData[i] = s.startTime;
    angleData[i] = s.angle;
  });

  // Update buffers using subdata
  splashBuffer.subdata(positionData);
  splashStartTimeBuffer.subdata(timeData);
  splashAngleBuffer.subdata(angleData);
}

const splashWidth = .8;
const splash = [
  [0, -1, 0], [0, -1, 0], [splashWidth, 1, 0],
  [0, -1, 0], [0, 1, 0], [splashWidth, 1, 0],
];

export const drawSplashes = regl({
  vert: splashVert,
  frag: splashFrag,
  attributes: {
    position: splash,
    instancePosition: {
      buffer: splashBuffer,
      divisor: 1,
      stride: 16,  // 4 floats * 4 bytes
      offset: 0
    },
    instanceAngle: {
      buffer: splashAngleBuffer,
      divisor: 1
    },
    instanceStartTime: {
      buffer: splashStartTimeBuffer,
      divisor: 1
    }
  },
  uniforms: {
    view: regl.prop('view'),
    projection: regl.prop('projection'),
    timeScale: () => timeScale.value,
    currentTime: () => getTime(),
    planeSize: PLANE_SIZE
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
    mask: true
  },
  count: 6,
  instances: () => Math.max(1, splashes.length),
  primitive: 'triangles'
});