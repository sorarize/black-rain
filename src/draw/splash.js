import splashVert from '../shaders/splash.vert?raw';
import splashFrag from '../shaders/splash.frag?raw';
import { regl } from '../renderer';
import { timeScale, getTime } from '../time';
import { random } from '../utils';
import { RAIN_COUNT } from '../config';

const MAX_SPLASHES = RAIN_COUNT * 7; // 限制最大數量

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
  const length = random(1, 2);
  const count = ~~random(5, 8);
  const wholeAngle = Math.PI / 2;
  const unitAngle = wholeAngle / (count - 1);
  const startAngle = -wholeAngle / 2;

  // 檢查是否超過最大限制
  if (splashes.length + count > MAX_SPLASHES) {
    // 如果超過限制，移除最舊的
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

  // 更新所有 buffer
  const positionData = new Float32Array(MAX_SPLASHES * 4);
  const timeData = new Float32Array(MAX_SPLASHES);
  const angleData = new Float32Array(MAX_SPLASHES);

  // 填充實際數據
  splashes.forEach((s, i) => {
    const baseIndex = i * 4;
    positionData[baseIndex] = s.x;
    positionData[baseIndex + 1] = s.y;
    positionData[baseIndex + 2] = s.z;
    positionData[baseIndex + 3] = s.length;
    timeData[i] = s.startTime;
    angleData[i] = s.angle;
  });

  // 使用 subdata 更新 buffer
  splashBuffer.subdata(positionData);
  splashStartTimeBuffer.subdata(timeData);
  splashAngleBuffer.subdata(angleData);
}

const splashVertices = [
  [0, -1, 0],
  [-0.1, -1, 0],
  [0, 1, 0],
  [0.1, -1, 0],
  [0, 1, 0],
  [-0.1, -1, 0]
];

export const drawSplashes = regl({
  vert: splashVert,
  frag: splashFrag,
  attributes: {
    position: splashVertices,
    instancePosition: {
      buffer: splashBuffer,
      divisor: 1,
      stride: 16,  // 4 個 float * 4 bytes
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
    currentTime: () => getTime()
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