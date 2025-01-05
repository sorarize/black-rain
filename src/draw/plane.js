import planeVert from '../shaders/plane.vert?raw';
import planeFrag from '../shaders/plane.frag?raw';

import { regl } from '../renderer';
import { PLANE_SIZE } from '../config';

const planSize = PLANE_SIZE * 5;
const planeVertices = [
  -planSize, 0, -planSize,
  planSize, 0, -planSize,
  planSize, 0, planSize,
  -planSize, 0, -planSize,
  planSize, 0, planSize,
  -planSize, 0, planSize
];

export const drawPlane = regl({
  vert: planeVert,
  frag: planeFrag,
  attributes: {
    position: planeVertices
  },
  uniforms: {
    projection: regl.prop('projection'),
    view: regl.prop('view'),
  },
  depth: {
    enable: true,
    mask: true,
  },
  count: 6
});