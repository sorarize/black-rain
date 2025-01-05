precision mediump float;
varying vec2 vUv;
uniform sampler2D texture;

void main() {
  vec4 color = texture2D(texture, vUv);

  float gradient = 1. - (vUv.x + vUv.y * 2.0) * 0.33;

  color.rgb = (1. - color.rgb) * .3;
  color.rgb *= gradient;

  color.rgb = pow(color.rgb, vec3(0.8));

  gl_FragColor = color;
}
