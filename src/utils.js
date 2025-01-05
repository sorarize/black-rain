export const random = (min = 0, max = null) => {
  if (max === null) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

export const randomSign = () => {
  return Math.random() < 0.5 ? -1 : 1;
}

export const xx = (...args) => {
  console.log(...args);
}

