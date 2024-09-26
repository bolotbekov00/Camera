const video = document.querySelector("#video");
const captureBtn = document.querySelector("#capture");
const canvas = document.querySelector("#canvas");
const photo = document.querySelector("#photo");
const saveButton = document.querySelector("#savePhoto");
const toggleCameraBtn = document.querySelector("#toggleCamera");
const toggleFlashBtn = document.querySelector("#toggleFlash");
const context = canvas.getContext("2d");

let currentStream;
let currentCamera = "environment";
let videoTrack;
async function startCamera() {
  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: currentCamera },
    });
    video.srcObject = currentStream;
    videoTrack = currentStream.getVideoTracks()[0];
  } catch (err) {
    console.log("Ошибка доступа камеры", err);
  }
}

async function toggleCamera() {
  currentCamera = currentCamera === "environment" ? "user" : "environment"; // Меняем на переднюю или заднюю камеру
  if (currentStream) {
    videoTrack.stop(); // Останавливаем текущий видеотрек
  }
  await startCamera(); // Запускаем новую камеру
}

// Функция для переключения фонарика
async function toggleFlashlight() {
  if (!videoTrack) return; // Проверяем наличие видеотрека

  try {
    const capabilities = videoTrack.getCapabilities();
    if (!capabilities.torch) {
      alert("Фонарик не поддерживается на этом устройстве");
      return;
    }
    const flashStatus = !videoTrack.getSettings().torch; // Получаем текущее состояние фонарика
    await videoTrack.applyConstraints({
      advanced: [{ torch: flashStatus }],
    });
    toggleFlashBtn.textContent = flashStatus
      ? "Выключить фонарик"
      : "Включить фонарик"; // Обновляем текст кнопки
  } catch (error) {
    console.error("Ошибка управления фонариком:", error);
  }
}

// Снимок с камеры
captureBtn.addEventListener("click", () => {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL("image/png");
  photo.src = imageData;
  canvas.style.display = "none";
});

// Сохранение фото
saveButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = photo.src;
  link.download = "photo.png";
  link.click();
});

// События кнопок
toggleCameraBtn.addEventListener("click", toggleCamera);
toggleFlashBtn.addEventListener("click", toggleFlashlight);

// Запускаем камеру при загрузке страницы
startCamera();
