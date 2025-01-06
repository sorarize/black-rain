precision highp float;
#pragma glslify: transform = require('glsl-lut')

varying vec2 vUv;
uniform sampler2D texture;
uniform sampler2D uLookup;
uniform float invert;

// Simple dithering function
float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec4 original = texture2D(texture, vUv);

  float gradient = 1. - (vUv.x + vUv.y * 2.0) * 0.33;

  // Add subtle noise to break up the banding
  float noise = (rand(vUv) - 0.5) * 0.1;
  gradient += noise;

  if (invert == 1.) {
    original.rgb = (1. - original.rgb) * .5;
  } else {
    original.rgb = clamp(original.rgb, .05, .9);
  }

  original.rgb *= gradient;

  gl_FragColor = transform(original, uLookup);
}
