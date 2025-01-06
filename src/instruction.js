import { level } from "./config";

const template = `
  <div class="instruction">
    <div>
      <h1>Black Rain</h1>
      <p>Level: ${level}</p>
      <p class="hold">press and hold to slow time</p>
    </div>
  </div>
`;

// if (!hasSeenInstruction) {
  const instruction = document.createElement('div');
  instruction.innerHTML = template;
  document.body.appendChild(instruction.firstElementChild);

  const hideInstruction = () => {
    document.querySelector('.instruction').classList.add('hide');
    localStorage.setItem('hasSeenInstruction', 'true');
  };

  document.body.addEventListener('mousedown', hideInstruction);
  document.body.addEventListener('touchstart', hideInstruction);

  setTimeout(hideInstruction, 5000);