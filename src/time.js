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

let isPaused = false;

function pause() {
  timeScale.value = .0;
  isPaused = true;
}

function slow() {
  timeScale.value = .03;
}

function reset() {
  timeScale.value = 1;
  isPaused = false;
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    timeScale.value > .5 ? pause() : reset();
  }
});

export function handleStart(e) {
  e.preventDefault();
  if (isPaused) {
    return;
  }
  slow();
}

export function handleEnd(e) {
  e.preventDefault();
  if (isPaused) {
    return;
  }
  reset();
}

export { timeScale };
