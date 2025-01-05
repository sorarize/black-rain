export const random = (min = 0, max = null) => {
  if (max === null) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

export const pick = (options) => {
  const total = Object.values(options).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * total;

  for (const [key, weight] of Object.entries(options)) {
    random -= weight;
    if (random <= 0) {
      return key;
    }
  }
  return Object.keys(options)[Object.keys(options).length - 1];
}

export const randomSign = () => {
  return Math.random() < 0.5 ? -1 : 1;
}

export const xx = (...args) => {
  console.log(...args);
}
