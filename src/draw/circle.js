import circleVert from "../shaders/circle.vert?raw";
import circleFrag from "../shaders/circle.frag?raw";
import { PLANE_SIZE, RAIN_SPEED } from "../config";
import { random } from "../utils";
import { regl } from "../renderer";
import { timeScale, getTime } from "../time";

export let circles = [];

const circleData = createCircleVertices();

const circleBuffer = regl.buffer({
  usage: 'dynamic',
  data: [[0, 0, 0]]
});

const startTimeBuffer = regl.buffer({
  usage: 'dynamic',
  data: [0]
});

const maxRadiusBuffer = regl.buffer({
  usage: 'dynamic',
  data: [0]
});

const isOuterBuffer = regl.buffer({
  usage: 'static',
  data: circleData.isOuter
});

export function addCircle(x, z) {
  const zFactor = Math.max(0.5, (z + PLANE_SIZE) / (PLANE_SIZE * 2));
  const circleCount = random(2, 10) * zFactor;
  const maxRadius = random(50, 60) * zFactor * 3;

  for (let i = 0; i < circleCount; i++) {
    circles.push({
      x,
      y: .1,
      z,
      maxRadius,
      startTime: getTime() + i * zFactor * .4
    });
  }
}

export function updateCircles() {
  const now = getTime();
  const oldLength = circles.length;

  // 更新每個圓形的狀態，移除超過 2 秒的圓形
  circles = circles.filter(circle => {
    return now - circle.startTime <= 2.0;
  });

  // 只在 circles 數組有變化時才更新 buffer
  if (circles.length !== oldLength || circles.length > 0) {
    circleBuffer({
      data: circles.length > 0 ? circles.map(c => [c.x, c.y, c.z]) : [[0, 0, 0]]
    });

    startTimeBuffer({
      data: circles.length > 0 ? circles.map(c => c.startTime) : [0]
    });

    maxRadiusBuffer({
      data: circles.length > 0 ? circles.map(c => c.maxRadius) : [0]
    });
  }
}

function createCircleVertices(segments = 32) {
  const vertices = [];
  const isOuter = [];  // 新增：用於標識外圈頂點
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    // 內圈頂點
    vertices.push(cos, sin);
    isOuter.push(0);
    // 外圈頂點
    vertices.push(cos, sin);
    isOuter.push(1);
  }
  return { vertices, isOuter };
}

export const drawCircles = regl({
  vert: circleVert,
  frag: circleFrag,
  attributes: {
    position: circleData.vertices,
    isOuter: isOuterBuffer,  // 新增 isOuter attribute
    instancePosition: {
      buffer: circleBuffer,
      divisor: 1
    },
    instanceStartTime: {
      buffer: startTimeBuffer,
      divisor: 1
    },
    instanceMaxRadius: {
      buffer: maxRadiusBuffer,
      divisor: 1
    }
  },
  uniforms: {
    currentTime: () => regl.now(),
    view: regl.prop('view'),
    projection: regl.prop('projection'),
    planeSize: PLANE_SIZE,
    rainSpeed: RAIN_SPEED,
    timeScale: () => timeScale.value,
    thickness: 1
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
  count: circleData.vertices.length / 2,
  instances: () => Math.max(1, circles.length),
  primitive: 'triangle strip'
});