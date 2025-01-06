precision mediump float;

varying float vDiscard;

void main() {
  if (vDiscard > 0.5) {
    discard;
  }
  gl_FragColor = vec4(1., 1., 1., .8);
}
