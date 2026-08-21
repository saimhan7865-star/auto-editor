lucide.createIcons();

const videoUpload = document.getElementById('video-upload');
const mainVideo = document.getElementById('main-video');
const placeholderText = document.getElementById('placeholder-text');
const playBtn = document.getElementById('play-btn');
const timeDisplay = document.getElementById('time-display');

const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const grayscaleSlider = document.getElementById('grayscale');
const resetFiltersBtn = document.getElementById('reset-filters-btn');

const addTextBtn = document.getElementById('add-text-btn');
const overlayText = document.getElementById('overlay-text');
const textInput = document.getElementById('text-input');
const textColor = document.getElementById('text-color');
const textTrack = document.getElementById('text-track');
const videoContainer = document.getElementById('video-container');

videoUpload.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    mainVideo.src = URL.createObjectURL(file);
    mainVideo.classList.remove('hidden');
    placeholderText.classList.add('hidden');
  }
});

playBtn.addEventListener('click', function () {
  if (!mainVideo.src) return;
  if (mainVideo.paused) {
    mainVideo.play();
    playBtn.innerHTML = `<i data-lucide="pause" class="w-5 h-5"></i>`;
  } else {
    mainVideo.pause();
    playBtn.innerHTML = `<i data-lucide="play" class="w-5 h-5"></i>`;
  }
  lucide.createIcons();
});

mainVideo.addEventListener('timeupdate', function () {
  const current = formatTime(mainVideo.currentTime);
  const duration = formatTime(mainVideo.duration || 0);
  timeDisplay.textContent = `${current} / ${duration}`;
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function applyFilters() {
  const brightness = brightnessSlider.value;
  const contrast = contrastSlider.value;
  const grayscale = grayscaleSlider.value;
  
  mainVideo.style.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`;
  
  document.getElementById('brightness-val').textContent = `${brightness}%`;
  document.getElementById('contrast-val').textContent = `${contrast}%`;
  document.getElementById('grayscale-val').textContent = `${grayscale}%`;
}

[brightnessSlider, contrastSlider, grayscaleSlider].forEach(slider => {
  slider.addEventListener('input', applyFilters);
});

resetFiltersBtn.addEventListener('click', () => {
  brightnessSlider.value = 100;
  contrastSlider.value = 100;
  grayscaleSlider.value = 0;
  applyFilters();
});

addTextBtn.addEventListener('click', () => {
  overlayText.classList.remove('hidden');
  textTrack.classList.remove('hidden');
  textInput.value = "Sample Text";
  overlayText.textContent = "Sample Text";
});

textInput.addEventListener('input', (e) => {
  overlayText.textContent = e.target.value || "Sample Text";
});

textColor.addEventListener('input', (e) => {
  overlayText.style.color = e.target.value;
});

let isDragging = false;
let offset = { x: 0, y: 0 };

overlayText.addEventListener('mousedown', (e) => {
  isDragging = true;
  offset.x = e.clientX - overlayText.offsetLeft;
  offset.y = e.clientY - overlayText.offsetTop;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = videoContainer.getBoundingClientRect();
  
  let x = e.clientX - rect.left - offset.x;
  let y = e.clientY - rect.top - offset.y;

  overlayText.style.left = `${x}px`;
  overlayText.style.top = `${y}px`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
