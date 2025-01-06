import { regl, fbo } from '../renderer.js';
import postVert from '../shaders/post.vert?raw';
import postFrag from '../shaders/post.frag?raw';
import { INVERT } from '../config.js';

// Create post-processing quad
const quadVertices = [
  -1, -1,
  1, -1,
  1, 1,
  -1, -1,
  1, 1,
  -1, 1
];

export const drawPost = regl({
  vert: postVert,
  frag: postFrag,
  attributes: {
    position: quadVertices
  },
  uniforms: {
    texture: () => fbo,
    invert: INVERT
  },
  depth: { enable: false },
  count: 6
});