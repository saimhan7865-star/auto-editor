lucide.createIcons();

// Selectors
const videoUpload = document.getElementById('video-upload');
const mainVideo = document.getElementById('main-video');
const placeholderText = document.getElementById('placeholder-text');
const playBtn = document.getElementById('play-btn');
const timeDisplay = document.getElementById('time-display');

// Volume Controls
const muteBtn = document.getElementById('mute-btn');
const volumeSlider = document.getElementById('volume-slider');

// Filter Sliders
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const saturateSlider = document.getElementById('saturate');
const resetFiltersBtn = document.getElementById('reset-filters-btn');

// Text Elements
const addTextBtn = document.getElementById('add-text-btn');
const overlayText = document.getElementById('overlay-text');
const textInput = document.getElementById('text-input');
const textColor = document.getElementById('text-color');
const textSize = document.getElementById('text-size');
const textTrack = document.getElementById('text-track');
const videoContainer = document.getElementById('video-container');

// Timeline Elements
const timelineContainer = document.getElementById('timeline-container');
const playhead = document.getElementById('playhead');

// 1. Upload & Playback
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
    playBtn.innerHTML = `<i data-lucide="pause" class="w-5 h-5 fill-current"></i>`;
  } else {
    mainVideo.pause();
    playBtn.innerHTML = `<i data-lucide="play" class="w-5 h-5 fill-current"></i>`;
  }
  lucide.createIcons();
});

// 2. Volume Logic
volumeSlider.addEventListener('input', (e) => {
  mainVideo.volume = e.target.value;
  mainVideo.muted = e.target.value == 0;
});

muteBtn.addEventListener('click', () => {
  mainVideo.muted = !mainVideo.muted;
  volumeSlider.value = mainVideo.muted ? 0 : mainVideo.volume;
});

// 3. Time & Playhead Animation
mainVideo.addEventListener('timeupdate', function () {
  const current = formatTime(mainVideo.currentTime);
  const duration = formatTime(mainVideo.duration || 0);
  timeDisplay.textContent = `${current} / ${duration}`;

  // Sync Red Playhead on Timeline
  if (mainVideo.duration) {
    const progress = (mainVideo.currentTime / mainVideo.duration) * 100;
    playhead.style.left = `${progress}%`;
  }
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 4. Interactive Timeline Click (Seek)
timelineContainer.addEventListener('click', (e) => {
  if (!mainVideo.duration) return;
  const rect = timelineContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percentage = clickX / rect.width;
  mainVideo.currentTime = percentage * mainVideo.duration;
});

// 5. Adjustments & Preset Filters
function applyFilters() {
  const brightness = brightnessSlider.value;
  const contrast = contrastSlider.value;
  const saturate = saturateSlider.value;
  
  mainVideo.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
  
  document.getElementById('brightness-val').textContent = `${brightness}%`;
  document.getElementById('contrast-val').textContent = `${contrast}%`;
  document.getElementById('saturate-val').textContent = `${saturate}%`;
}

[brightnessSlider, contrastSlider, saturateSlider].forEach(slider => {
  slider.addEventListener('input', applyFilters);
});

resetFiltersBtn.addEventListener('click', () => {
  brightnessSlider.value = 100;
  contrastSlider.value = 100;
  saturateSlider.value = 100;
  applyFilters();
});

window.applyPreset = function(type) {
  if (type === 'normal') {
    brightnessSlider.value = 100; contrastSlider.value = 100; saturateSlider.value = 100;
  } else if (type === 'cinematic') {
    brightnessSlider.value = 90; contrastSlider.value = 130; saturateSlider.value = 120;
  } else if (type === 'vintage') {
    brightnessSlider.value = 110; contrastSlider.value = 85; saturateSlider.value = 70;
  } else if (type === 'bw') {
    brightnessSlider.value = 100; contrastSlider.value = 120; saturateSlider.value = 0;
  }
  applyFilters();
};

// 6. Text Editing & Customization
addTextBtn.addEventListener('click', () => {
  overlayText.classList.remove('hidden');
  textTrack.classList.remove('hidden');
  textInput.value = "Sample Subtitle";
  overlayText.textContent = "Sample Subtitle";
});

textInput.addEventListener('input', (e) => {
  overlayText.textContent = e.target.value || "Sample Subtitle";
});

textColor.addEventListener('input', (e) => {
  overlayText.style.color = e.target.value;
});

textSize.addEventListener('input', (e) => {
  overlayText.style.fontSize = `${e.target.value}px`;
});

// Text Dragging Logic
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
