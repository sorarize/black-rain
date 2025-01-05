import createCamera from 'orbit-camera';
import { mat4 } from 'gl-matrix';
import { INITIAL_CAMERA } from './config';

export const camera = createCamera(
  INITIAL_CAMERA.position,
  INITIAL_CAMERA.target,
  INITIAL_CAMERA.up
);

camera.distance = INITIAL_CAMERA.distance;

export function computeProjectionMatrix(viewportWidth, viewportHeight) {
  const aspectRatio = viewportWidth / viewportHeight;
  const distance = camera.distance;
  const size = distance * 0.5;
  return mat4.ortho(
    mat4.create(),
    -size * aspectRatio,
    size * aspectRatio,
    -size,
    size,
    -4000,
    4000
  );
}

export function setupCameraControls(canvas) {
  canvas.addEventListener('mousemove', function (event) {
    if (event.buttons & 1) {
      camera.rotate(
        [event.movementX / canvas.width,
         event.movementY / canvas.height],
        [0, 0]
      );
    }
  });

  canvas.addEventListener('wheel', function (event) {
    const zoomSpeed = 0.1;
    camera.zoom(event.deltaY * zoomSpeed);
    event.preventDefault();
  });
}