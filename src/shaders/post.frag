precision mediump float;
varying vec2 vUv;
uniform sampler2D texture;
uniform float invert;

void main() {
  vec4 color = texture2D(texture, vUv);

  float gradient = 1. - (vUv.x + vUv.y * 2.0) * 0.33;

  if (invert == 1.) {
    color.rgb = (1. - color.rgb) * .5;
  } else {
    color.rgb = clamp(color.rgb, .05, .9);
  }

  color.rgb *= gradient;

  color.rgb = pow(color.rgb, vec3(0.8));

  gl_FragColor = color;
}
