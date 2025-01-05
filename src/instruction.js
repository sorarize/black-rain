const hasSeenInstruction = localStorage.getItem('hasSeenInstruction');

if (!hasSeenInstruction) {
  const instruction = document.createElement('div');
  instruction.classList.add('instruction');
  instruction.innerHTML = 'hold to slow down';
  document.body.appendChild(instruction);

  const hideInstruction = () => {
    instruction.classList.add('hide');
    localStorage.setItem('hasSeenInstruction', 'true');
  };

  document.body.addEventListener('mousedown', hideInstruction);
  document.body.addEventListener('touchstart', hideInstruction);

  setTimeout(hideInstruction, 3000);
}