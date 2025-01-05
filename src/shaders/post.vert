precision mediump float;
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;  // 轉換到 0-1 範圍
  gl_Position = vec4(position, 0, 1);
}
