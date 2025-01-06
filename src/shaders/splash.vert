precision mediump float;
#pragma glslify: rotate = require('glsl-rotate/rotate')

// Vertex attributes
attribute vec3 position;
attribute vec4 instancePosition;  // (x, y, z, length)
attribute float instanceStartTime;
attribute vec3 instanceDirection; // Normalized direction vector for 3D splash movement

// Uniforms for transformation and animation
uniform mat4 projection, view;
uniform float timeScale;
uniform float currentTime;
uniform float planeSize;

// Varyings for fragment shader
varying float vProgress;  // Animation progress (1.0 to 0.0)
varying float vPosZ;     // Depth value for alpha blending

void main() {
  vec3 pos = position;

  // 1. Calculate animation progress
  float timePassed = currentTime - instanceStartTime;
  float moveProgress = timePassed / 0.1; // Complete animation in 0.1 seconds
  moveProgress = clamp(moveProgress * mix(2.0, 1.0, timeScale), 0.0, 1.0);
  vProgress = 1.0 - moveProgress;

  // 2. Apply length scaling
  pos.y *= instancePosition.w;

  // 3. Calculate rotation to align splash with movement direction
  vec3 dir = normalize(instanceDirection);
  vec3 forward = vec3(0.0, 1.0, 0.0);  // Initial forward direction
  vec3 rotAxis = normalize(cross(dir, forward));  // Rotation axis
  float angle = acos(dot(forward, dir));         // Rotation angle

  // Apply rotation using glsl-rotate
  if (length(rotAxis) > 0.001) {
    // Normal case: rotate around the calculated axis
    pos = rotate(pos, rotAxis, angle);
  } else if (dot(forward, dir) < 0.0) {
    // Edge case: direction is opposite to forward
    // Rotate 180 degrees around X axis
    pos = rotate(pos, vec3(1.0, 0.0, 0.0), 3.14159);
  }

  // 4. Move along direction vector
  float moveDistance = instancePosition.w * 5.0 * (moveProgress + 0.1);
  pos += dir * moveDistance;

  // 5. Add instance position offset
  pos += instancePosition.xyz;

  // 6. Calculate depth value for alpha blending
  vPosZ = mix(.3, 1., (pos.z + planeSize) / 2. / planeSize);

  // Transform to clip space
  gl_Position = projection * view * vec4(pos, 1);
}