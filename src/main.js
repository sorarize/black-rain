import './style.scss';

import './instruction.js';
import { camera, computeProjectionMatrix, setupCameraControls } from './camera';

import { updateTime } from './time.js';
import { regl, canvas, fbo } from './renderer.js';
import { drawCircles, updateCircles } from './draw/circle.js';
import { drawSplashes, updateSplashes } from './draw/splash.js';
import { drawRain, updateRain } from './draw/rain.js';
import { drawPost } from './draw/post.js';
import { drawPlane } from './draw/plane.js';
import resl from 'resl';

const assets = {
  lookup: './lut/lookup.png'
};

resl({
  manifest: {
    lookup: {
      type: 'image',
      src: assets.lookup,
      parser: (data) => regl.texture({ data }),
    }
  },
  onDone: ({ lookup }) => {
    setupCameraControls(canvas);

    // Update scene
    function updateScene() {
      updateTime();
      updateRain();
      updateCircles();
      updateSplashes();
    }

    // Render loop
    regl.frame(() => {
      updateScene();

      const props = {
        view: camera.view(),
        projection: computeProjectionMatrix(canvas.width, canvas.height),
      };

      fbo.use(() => {
        regl.clear({
          color: [0, 0, 0, 1],
          depth: 1
        });

        drawPlane(props);
        drawRain(props);
        drawCircles(props);
      });

      drawPost({
        uLookup: lookup
      });
      drawSplashes(props);
    });
  }
});