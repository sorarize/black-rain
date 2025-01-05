precision mediump float;
attribute vec3 position;
attribute vec4 instancePosition;  // x, y, z, length
uniform mat4 projection, view;
uniform vec2 rainDirection;
uniform float timeScale;

void main() {
  vec3 pos = position;

  // 1. 計算目標點位置（在雨滴長度上的某個比例點）
  float targetY = mix(-1.0, 1.0, timeScale * 3.);  // 在 [-1, 1] 範圍內插值
  pos.y = (position.y > 0.0) ? targetY : position.y;  // 只改變頂點
  pos.y *= instancePosition.w;

  // 2. 計算對應的 x 偏移
  float yNormalized = (pos.y / instancePosition.w) + 1.0;
  pos.x = position.x - (yNormalized * rainDirection.x * instancePosition.w);

  pos += instancePosition.xyz;
  gl_Position = projection * view * vec4(pos, 1);
}