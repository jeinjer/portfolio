let audioContext = null;
let sourceNode = null;
let gainNode = null;
let lowpassFilter = null;
let highpassFilter = null;
let audioElement = null;
let isPlaying = false;
let isInitialized = false;
let currentTrackIndex = 0;
let isSeeking = false;
const DEFAULT_VOLUME = 10;

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateProgressUI() {
  if (!audioElement || isSeeking) return;
  const current = audioElement.currentTime;
  const total = audioElement.duration || 0;

  const elCurrent = document.getElementById('player-time-current');
  const elTotal = document.getElementById('player-time-total');
  const slider = document.getElementById('track-slider');

  if (elCurrent) elCurrent.textContent = formatTime(current);
  if (elTotal) elTotal.textContent = formatTime(total);
  if (slider && total > 0) {
    slider.value = (current / total) * 100;
  }
}

const PLAYLIST = [
  { title: 'Still Alive', file: '/assets/audio/still_alive.mp3' },
  { title: 'Lumière', file: '/assets/audio/lumiere.m4a' },
  { title: 'Secunda', file: '/assets/audio/secunda.m4a' },
];

async function initAudioContext() {
  if (isInitialized) return;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    gainNode = audioContext.createGain();
    gainNode.gain.value = DEFAULT_VOLUME / 100;

    lowpassFilter = audioContext.createBiquadFilter();
    lowpassFilter.type = 'lowpass';
    lowpassFilter.frequency.value = 20000;
    lowpassFilter.Q.value = 0.7;

    highpassFilter = audioContext.createBiquadFilter();
    highpassFilter.type = 'highpass';
    highpassFilter.frequency.value = 20;
    highpassFilter.Q.value = 0.7;

    audioElement = new Audio();
    audioElement.crossOrigin = 'anonymous';
    audioElement.loop = false;

    audioElement.addEventListener('ended', () => {
      nextTrack();
    });

    audioElement.addEventListener('timeupdate', updateProgressUI);
    audioElement.addEventListener('loadedmetadata', updateProgressUI);

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(highpassFilter);
    highpassFilter.connect(lowpassFilter);
    lowpassFilter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    isInitialized = true;
  } catch (e) {
    console.log('Web Audio API not supported or audio init failed');
  }
}

function loadTrack(index) {
  if (!audioElement) return;
  currentTrackIndex = index;
  audioElement.src = PLAYLIST[index].file;
  updatePlaylistUI();
  updateTrackDisplay();
}

export async function toggleAudio() {
  if (!isInitialized) {
    await initAudioContext();
    loadTrack(0);
  }

  if (audioContext?.state === 'suspended') {
    await audioContext.resume();
  }

  if (isPlaying) {
    audioElement?.pause();
    isPlaying = false;
  } else {
    try {
      await audioElement?.play();
      isPlaying = true;
    } catch (e) {
      console.log('Audio playback failed:', e.message);
    }
  }

  updatePlayButton();
  return isPlaying;
}

export async function nextTrack() {
  const next = (currentTrackIndex + 1) % PLAYLIST.length;
  loadTrack(next);
  if (isPlaying) {
    try { await audioElement?.play(); } catch (e) {}
  }
}

export async function prevTrack() {
  const prev = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
  loadTrack(prev);
  if (isPlaying) {
    try { await audioElement?.play(); } catch (e) {}
  }
}

export async function selectTrack(index) {
  if (!isInitialized) {
    await initAudioContext();
  }
  if (audioContext?.state === 'suspended') {
    await audioContext.resume();
  }
  loadTrack(index);
  try {
    await audioElement?.play();
    isPlaying = true;
    updatePlayButton();
  } catch (e) {}
}

export function setVolume(value) {
  if (gainNode) {
    gainNode.gain.value = value / 100;
  }
}

export function getDefaultVolume() {
  return DEFAULT_VOLUME;
}

export function handleSeekStart() {
  isSeeking = true;
}

export function handleSeekMove(percent) {
  if (isSeeking && audioElement && audioElement.duration) {
    const elCurrent = document.getElementById('player-time-current');
    if (elCurrent) elCurrent.textContent = formatTime((percent / 100) * audioElement.duration);
  }
}

export function handleSeekEnd(percent) {
  if (audioElement && audioElement.duration) {
    audioElement.currentTime = (percent / 100) * audioElement.duration;
  }
  isSeeking = false;
}

export function setModeFilter(isDark) {
  if (!lowpassFilter || !highpassFilter || !audioContext) return;
  const now = audioContext.currentTime;
  if (isDark) {
    lowpassFilter.frequency.linearRampToValueAtTime(3500, now + 0.5);
    highpassFilter.frequency.linearRampToValueAtTime(40, now + 0.5);
  } else {
    lowpassFilter.frequency.linearRampToValueAtTime(18000, now + 0.5);
    highpassFilter.frequency.linearRampToValueAtTime(80, now + 0.5);
  }
}

export function getIsPlaying() { return isPlaying; }
export function getPlaylist() { return PLAYLIST; }
export function getCurrentTrackIndex() { return currentTrackIndex; }

function updatePlayButton() {
  const btn = document.getElementById('btn-play');
  if (btn) btn.textContent = isPlaying ? '⏸' : '▶';
  const status = document.getElementById('player-status');
  if (status) status.textContent = isPlaying ? 'LOFI RADIO' : 'LOFI RADIO';
}

function updateTrackDisplay() {
  const el = document.getElementById('player-track');
  if (el) {
    el.removeAttribute('data-i18n');
    el.textContent = PLAYLIST[currentTrackIndex]?.title || '';
  }
}

function updatePlaylistUI() {
  const tracks = document.querySelectorAll('.playlist-track');
  tracks.forEach((t, i) => {
    t.classList.toggle('active', i === currentTrackIndex);
  });
}

export function renderPlaylist() {
  const container = document.getElementById('playlist-tracks');
  if (!container) return;
  container.innerHTML = PLAYLIST.map((track, i) => `
    <div class="playlist-track ${i === currentTrackIndex ? 'active' : ''}" data-track-index="${i}">
      ${track.title}
    </div>
  `).join('');

  container.querySelectorAll('.playlist-track').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-track-index'));
      selectTrack(idx);
    });
  });
}

export default { toggleAudio, nextTrack, prevTrack, selectTrack, setVolume, setModeFilter, getIsPlaying, getPlaylist, getCurrentTrackIndex, renderPlaylist, handleSeekStart, handleSeekMove, handleSeekEnd };
