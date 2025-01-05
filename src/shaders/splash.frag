precision mediump float;
varying float vProgress;  // 接收來自 vertex shader 的 progress
varying float vPosZ;

void main() {
  gl_FragColor = vec4(1., 1., 1., 1. * vProgress * vPosZ);  // 使用 progress 控制透明度
}
