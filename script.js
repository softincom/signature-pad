const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// Прозрачный фон при загрузке
window.onload = () => {
  clearCanvas();
};

canvas.addEventListener('touchstart', startDraw);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDraw);

function getTouchPos(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  };
}

function startDraw(e) {
  drawing = true;
  const pos = getTouchPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const pos = getTouchPos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function stopDraw() {
  drawing = false;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

document.getElementById('clear').onclick = () => {
  clearCanvas();
};

document.getElementById('save').onclick = () => {
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'signature.png';
  link.click();
};

document.getElementById('send').onclick = async () => {
  canvas.toBlob(async (blob) => {
    const zip = new JSZip();
    zip.file("signature.png", blob);

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const file = new File([zipBlob], "signature.zip", { type: "application/zip" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: "Моя подпись",
        text: "Отправляю архив с подписью"
      });
    } else {
      alert("Ваш браузер не поддерживает отправку ZIP через Share API.");
    }
  });
};
