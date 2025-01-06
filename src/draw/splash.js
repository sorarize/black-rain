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

const splashDirectionBuffer = regl.buffer({
  usage: 'dynamic',
  type: 'float',
  data: new Float32Array(MAX_SPLASHES * 3).fill(0)
});

export function addSplash(x, z) {
  const length = random(1, 3);
  const count = ~~random(6, 18);

  // 控制水花散射的角度範圍（0 表示垂直向上，PI/2 表示水平）
  const maxTheta = Math.PI / 4;

  // Check if exceeding maximum limit
  if (splashes.length + count > MAX_SPLASHES) {
    splashes.splice(0, count);
  }

  for (let i = 0; i < count; i++) {
    // 生成均勻分布的球面坐標
    const phi = (i / count) * Math.PI * 2;    // 水平角度均勻分布
    const theta = maxTheta;                    // 固定垂直角度

    // 將球面坐標轉換為方向向量
    const dirX = Math.sin(theta) * Math.cos(phi);
    const dirY = Math.cos(theta);
    const dirZ = Math.sin(theta) * Math.sin(phi);

    splashes.push({
      x,
      y: 0,
      z,
      length,
      dirX,
      dirY,
      dirZ,
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
  const directionData = new Float32Array(MAX_SPLASHES * 3);

  // Fill actual data
  splashes.forEach((s, i) => {
    const baseIndex = i * 4;
    positionData[baseIndex] = s.x;
    positionData[baseIndex + 1] = s.y;
    positionData[baseIndex + 2] = s.z;
    positionData[baseIndex + 3] = s.length;
    timeData[i] = s.startTime;

    const dirBaseIndex = i * 3;
    directionData[dirBaseIndex] = s.dirX;
    directionData[dirBaseIndex + 1] = s.dirY;
    directionData[dirBaseIndex + 2] = s.dirZ;
  });

  // Update buffers using subdata
  splashBuffer.subdata(positionData);
  splashStartTimeBuffer.subdata(timeData);
  splashDirectionBuffer.subdata(directionData);
}

const splashWidth = 1;
const splash = [
  [-splashWidth/2, -1, 0], [-splashWidth/2, -1, 0], [0, 1, 0],
  [-splashWidth/2, -1, 0], [splashWidth/2, -1, 0], [0, 1, 0],
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
    instanceStartTime: {
      buffer: splashStartTimeBuffer,
      divisor: 1
    },
    instanceDirection: {
      buffer: splashDirectionBuffer,
      divisor: 1,
      stride: 12,  // 3 floats * 4 bytes
      offset: 0
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