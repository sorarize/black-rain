import EaseNumber from './EaseNumber.ts';

let timeScale = new EaseNumber(1, 0.02);
let startTime = performance.now();
let currentTime = 0;

export function getTime() {
  return currentTime;
}

export function updateTime() {
  const now = performance.now();
  const deltaTime = (now - startTime) / 1000;
  currentTime += deltaTime * timeScale.value;
  startTime = now;
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    timeScale.value = timeScale.value > .5 ? .03 : 1;
  }
});

export { timeScale };
