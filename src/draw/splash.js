import splashVert from '../shaders/splash.vert?raw';
import splashFrag from '../shaders/splash.frag?raw';
import { regl } from '../renderer';
import { timeScale, getTime } from '../time';
import { random } from '../utils';

export let splashes = [];

const splashBuffer = regl.buffer({
  usage: 'dynamic',
  data: [[0, 0, 0, 1]]
});

const splashStartTimeBuffer = regl.buffer({
  usage: 'dynamic',
  data: [0]
});

const splashAngleBuffer = regl.buffer({
  usage: 'dynamic',
  data: [0]
});

export function addSplash(x, z) {
  const length = random(1, 2);
  const count = ~~random(5, 8);
  const wholeAngle = Math.PI / 2;
  const unitAngle = wholeAngle / (count - 1);
  const startAngle = -wholeAngle / 2;

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
  const oldLength = splashes.length;

  splashes = splashes.filter(splash => {
    const timeDiff = now - splash.startTime;
    return timeDiff <= .1 / timeScale.value;
  });

  // 只有當有 splashes 或者 splashes 數量改變時才更新 buffer
  if (splashes.length > 0 || oldLength !== splashes.length) {
    splashBuffer({
      data: splashes.length > 0 ? splashes.map(s => [s.x, s.y, s.z, s.length]) : [[0, 0, 0, 1]]
    });

    splashStartTimeBuffer({
      data: splashes.length > 0 ? splashes.map(s => s.startTime) : [0]
    });

    splashAngleBuffer({
      data: splashes.length > 0 ? splashes.map(s => s.angle) : [0]
    });
  }
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
      divisor: 1
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