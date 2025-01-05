precision mediump float;

varying float vProgress;
varying vec3 vPosition;
varying float vDiscard;

uniform float planeSize;  // 從 JavaScript 傳入平面大小
uniform float timeScale;  // 時間縮放因子

void main() {
  if (vDiscard == 1.) {
    discard;
  }
  // 使用 smoothstep 讓透明度在接近 1.0 時才快速衰減
  float threshold = 0.;  // 開始衰減的閾值
  float alpha = 1.0 - smoothstep(threshold, .7, vProgress);
  float fadeSpeed = mix(2., 1., timeScale);  // timeScale 小時衰減更快
  alpha = pow(alpha, fadeSpeed);

  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
