import createCamera from 'orbit-camera';
import { mat4 } from 'gl-matrix';
import { INITIAL_CAMERA, CAMERA_DISTANCE_LIMITS, CAMERA_ROTATION_LIMITS } from './config';

export const camera = createCamera(
  INITIAL_CAMERA.position,
  INITIAL_CAMERA.target,
  INITIAL_CAMERA.up
);

camera.distance = INITIAL_CAMERA.distance;

let currentPhi = 0;
let currentTheta = Math.PI * 0.1;

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
      const dx = event.movementX / canvas.width;
      const dy = event.movementY / canvas.height;

      const newPhi = currentPhi + dx * Math.PI;
      const newTheta = currentTheta + dy * Math.PI;

      if (newPhi >= CAMERA_ROTATION_LIMITS.PHI.MIN &&
          newPhi <= CAMERA_ROTATION_LIMITS.PHI.MAX &&
          newTheta >= CAMERA_ROTATION_LIMITS.THETA.MIN &&
          newTheta <= CAMERA_ROTATION_LIMITS.THETA.MAX) {

        currentPhi = newPhi;
        currentTheta = newTheta;

        camera.rotate([dx, dy], [0, 0]);
      }
    }
  });

  canvas.addEventListener('wheel', function (event) {
    const zoomSpeed = 0.1;
    const newDistance = camera.distance + (event.deltaY * zoomSpeed);

    // 限制相機距離在最小和最大值之間
    if (newDistance >= CAMERA_DISTANCE_LIMITS.MIN && newDistance <= CAMERA_DISTANCE_LIMITS.MAX) {
      camera.zoom(event.deltaY * zoomSpeed);
    }

    event.preventDefault();
  });
}