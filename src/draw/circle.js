import circleVert from "../shaders/circle.vert?raw";
import circleFrag from "../shaders/circle.frag?raw";
import { PLANE_SIZE, RAIN_COUNT, RAIN_SPEED } from "../config";
import { random, xx } from "../utils";
import { regl } from "../renderer";
import { timeScale, getTime } from "../time";

const MAX_CIRCLES = RAIN_COUNT * 40; // Maximum number of circles

export let circles = [];

const circleData = createCircleVertices();

const circleBuffer = regl.buffer({
  usage: 'dynamic',
  length: MAX_CIRCLES * 12, // Pre-allocate buffer size (3 float32 * 4 bytes * MAX_CIRCLES)
  data: new Float32Array(MAX_CIRCLES * 3).fill(0)
});

const startTimeBuffer = regl.buffer({
  usage: 'dynamic',
  length: MAX_CIRCLES * 4, // Pre-allocate buffer size (1 float32 * 4 bytes * MAX_CIRCLES)
  data: new Float32Array(MAX_CIRCLES).fill(0)
});

const maxRadiusBuffer = regl.buffer({
  usage: 'dynamic',
  length: MAX_CIRCLES * 4, // Pre-allocate buffer size (1 float32 * 4 bytes * MAX_CIRCLES)
  data: new Float32Array(MAX_CIRCLES).fill(0)
});

const isOuterBuffer = regl.buffer({
  usage: 'static',
  data: circleData.isOuter
});

export function addCircle(x, z) {
  const zFactor = Math.max(0.5, (z + PLANE_SIZE) / (PLANE_SIZE * 2));
  const maxRadius = random(30, 60) * zFactor * 3;
  const desiredCircleCount = ~~(maxRadius / 10);

  const remainingSpace = MAX_CIRCLES - circles.length;
  const circleCount = Math.min(desiredCircleCount, remainingSpace);

  if (circleCount <= 0) return;

  for (let i = 0; i < circleCount; i++) {
    circles.push({
      x,
      y: .1,
      z,
      maxRadius,
      startTime: getTime() + i * zFactor * .3
    });
  }
}

export function updateCircles() {
  const now = getTime();
  const oldLength = circles.length;

  circles = circles.filter(circle => {
    return now - circle.startTime <= 1.5;
  });

  if (circles.length !== oldLength || circles.length > 0) {
    const positionData = new Float32Array(MAX_CIRCLES * 3);
    const timeData = new Float32Array(MAX_CIRCLES);
    const radiusData = new Float32Array(MAX_CIRCLES);

    circles.forEach((c, i) => {
      positionData[i * 3] = c.x;
      positionData[i * 3 + 1] = c.y;
      positionData[i * 3 + 2] = c.z;
      timeData[i] = c.startTime;
      radiusData[i] = c.maxRadius;
    });

    circleBuffer.subdata(positionData);
    startTimeBuffer.subdata(timeData);
    maxRadiusBuffer.subdata(radiusData);
  }
}

function createCircleVertices(segments = 32) {
  const vertices = [];
  const isOuter = [];  // Flag for outer vertices
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    // Inner vertex
    vertices.push(cos, sin);
    isOuter.push(0);
    // Outer vertex
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
    isOuter: isOuterBuffer,  // Flag for outer vertices
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