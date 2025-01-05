precision mediump float;
varying float vProgress;  // 接收來自 vertex shader 的 progress

void main() {
  gl_FragColor = vec4(1., 1., 1., .5 * vProgress);  // 使用 progress 控制透明度
}
