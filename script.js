const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const downloadBtn = document.getElementById('downloadBtn');
const stampSelector = document.getElementById('stampSelector');

let painting = false;
let currentStamp = null;

// Preload stamp images
const stamps = {
  cat: new Image(),
  dog: new Image(),
  parrot: new Image()
};

stamps.cat.src = 'cat.png';
stamps.dog.src = 'dog.png';
stamps.parrot.src = 'parrot.png';

function startPosition(e) {
  if (currentStamp) {
    addStamp(e);
  } else {
    painting = true;
    draw(e);
  }
}

function endPosition() {
  painting = false;
  ctx.beginPath(); // Prevents continuous line between strokes
}

function draw(e) {
  if (!painting || currentStamp) return;

  ctx.lineWidth = brushSize.value;
  ctx.lineCap = 'round';
  ctx.strokeStyle = colorPicker.value;

  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function addStamp(e) {
  if (currentStamp && stamps[currentStamp]) {
    const x = e.clientX - canvas.offsetLeft - stamps[currentStamp].width / 2;
    const y = e.clientY - canvas.offsetTop - stamps[currentStamp].height / 2;
    ctx.drawImage(stamps[currentStamp], x, y);
  }
}

// Event Listeners for drawing and stamps
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

// Download as JPEG
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'drawing.jpg';
  link.href = canvas.toDataURL('image/jpeg');
  link.click();
});

// Stamp selection
stampSelector.addEventListener('change', (e) => {
  currentStamp = e.target.value !== 'none' ? e.target.value : null;
});
