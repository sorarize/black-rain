import { regl, fbo } from '../renderer.js';
import postVert from '../shaders/post.vert';
import postFrag from '../shaders/post.frag';
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
    uLookup: regl.prop('uLookup'),
    invert: INVERT
  },
  depth: { enable: false },
  count: 6
});