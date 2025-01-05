import { getTime } from './time';
import REGL from 'regl';

export const regl = REGL({
  extensions: ['angle_instanced_arrays']
});

export const canvas = regl._gl.canvas;
export let fbo;

export function handleResize() {
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;

  fbo = regl.framebuffer({
    color: regl.texture({
      width: canvas.width,
      height: canvas.height,
    }),
    depth: true
  });
}

handleResize();
window.addEventListener('resize', handleResize);

regl.now = getTime;
