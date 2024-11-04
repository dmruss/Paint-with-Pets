const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const downloadBtn = document.getElementById('downloadBtn');
const stampSelector = document.getElementById('stampSelector');
const uploadPet = document.getElementById('uploadPet');

let painting = false;
let currentStamp = null;
let uploadedStamp = null;

// Preload default stamp images
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
  if (currentStamp && (stamps[currentStamp] || uploadedStamp)) {
    const stampImage = currentStamp === 'uploadedPet' ? uploadedStamp : stamps[currentStamp];
    const x = e.clientX - canvas.offsetLeft - stampImage.width / 2;
    const y = e.clientY - canvas.offsetTop - stampImage.height / 2;
    ctx.drawImage(stampImage, x, y, 200, 200); // Draw at fixed 200x200 size
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

// Upload and resize user-uploaded pet image
uploadPet.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const img = new Image();
    img.onload = () => {
      // Create an off-screen canvas to resize the image to 200x200
      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d');
      offCanvas.width = 200;
      offCanvas.height = 200;
      offCtx.drawImage(img, 0, 0, 200, 200);
      
      // Create a new image for the resized stamp
      uploadedStamp = new Image();
      uploadedStamp.src = offCanvas.toDataURL(); // Convert the canvas to data URL
    };
    img.src = URL.createObjectURL(file); // Load the uploaded image
  }
});
