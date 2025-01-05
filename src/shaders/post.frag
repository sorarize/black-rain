precision mediump float;
varying vec2 vUv;
uniform sampler2D texture;  // 主要場景的紋理
uniform sampler2D planeTexture;  // 平面的紋理

void main() {
  vec4 color = texture2D(texture, vUv);
  vec4 planeColor = texture2D(planeTexture, vUv);

  float gradient = 1. - vUv.y;

  color.rgb = (1. - color.rgb) * .3;
  color.rgb *= gradient;

  gl_FragColor = color;
}
