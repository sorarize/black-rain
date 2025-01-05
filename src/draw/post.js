import { regl, fbo } from '../renderer.js';
import postVert from '../shaders/post.vert?raw';
import postFrag from '../shaders/post.frag?raw';

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
  },
  depth: { enable: false },
  count: 6
});