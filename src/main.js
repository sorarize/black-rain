import './style.scss';

import { camera, computeProjectionMatrix, setupCameraControls } from './camera';

import { updateTime } from './time.js';
import { regl, canvas, fbo } from './renderer.js';
import { circles, drawCircles, updateCircles } from './draw/circle.js';
import { splashes, drawSplashes, updateSplashes } from './draw/splash.js';
import { drawRain, updateRain } from './draw/rain.js';
import { drawPost } from './draw/post.js';
import { drawPlane } from './draw/plane.js';

setupCameraControls(canvas);

// 更新場景
function updateScene() {
  updateTime();
  updateRain();
  updateCircles();
  updateSplashes();
}

// 渲染循環
regl.frame(() => {
  const viewMatrix = camera.view();
  const projectionMatrix = computeProjectionMatrix(canvas.width, canvas.height);

  updateScene();

  fbo.use(() => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1
    });

    drawPlane({
      view: viewMatrix,
      projection: projectionMatrix,
    });

    drawRain({
      view: viewMatrix,
      projection: projectionMatrix
    });

    if (circles.length > 0) {
      drawCircles({
        view: viewMatrix,
        projection: projectionMatrix
      });
    }
  });

  drawPost();

  if (splashes.length > 0) {
    drawSplashes({
      view: viewMatrix,
      projection: projectionMatrix
    });
  }
});