import './style.css';
import { toggleLanguage, getCurrentLang, updateAllI18n } from './i18n.js';
import { toggleAudio, nextTrack, prevTrack, setVolume, setModeFilter, renderPlaylist, handleSeekStart, handleSeekMove, handleSeekEnd, getDefaultVolume, getIsPlaying } from './audio.js';
import { renderProjects } from './sections/projects.js';
import { renderTechnologies } from './sections/technologies.js';
import { renderExperience } from './sections/experience.js';

let currentSection = 'home';
let isDarkMode = true;
const playedTechRevealModes = new Set();

document.addEventListener('DOMContentLoaded', () => {
  const lang = getCurrentLang();
  document.getElementById('lang-label').textContent = lang === 'es' ? 'English' : 'Español';

  const savedMode = localStorage.getItem('portfolio-mode');
  if (savedMode === 'light') {
    isDarkMode = false;
    applyMode();
  }

  updateAllI18n();
  renderProjects();
  renderTechnologies();
  renderExperience();
  renderPlaylist();
  setupGlitchText();
  setupNavigation();
  setupModeToggle();
  setupLanguageToggle();
  setupMusicPlayer();
  setupAutoStartAudio();
  setupCvDownload();
  setupMobileNav();
  setupResponsiveMusicPlayerPlacement();
});

function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href').replace('#', '');
      navigateTo(target);
      document.querySelector('.nav-links')?.classList.remove('open');
    });
  });

  document.getElementById('btn-contact-hero')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('contact');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
        currentSection = id;
        if (id === 'tech') maybePlayTechReveal();
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.section').forEach(sec => observer.observe(sec));
}

function navigateTo(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });

    if (sectionId === 'about') {
      target.querySelectorAll('.terminal-line').forEach(el => {
        el.style.animation = 'none';
        void el.offsetHeight;
        el.style.animation = '';
      });
    }
    const titleEl = target.querySelector('.glitch-text');
    if (titleEl) triggerGlitch(titleEl, 800);
  }
}

function setupModeToggle() {
  document.getElementById('btn-mode')?.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    applyMode();
    localStorage.setItem('portfolio-mode', isDarkMode ? 'dark' : 'light');
  });
}

function applyMode() {
  const body = document.body;
  body.classList.toggle('mode-dark', isDarkMode);
  body.classList.toggle('mode-light', !isDarkMode);

  document.getElementById('room-bg-dark')?.classList.toggle('active', isDarkMode);
  document.getElementById('room-bg-light')?.classList.toggle('active', !isDarkMode);

  document.getElementById('mode-icon-sun')?.classList.toggle('hidden', !isDarkMode);
  document.getElementById('mode-icon-moon')?.classList.toggle('hidden', isDarkMode);

  setModeFilter(isDarkMode);

  if (currentSection === 'tech') {
    maybePlayTechReveal();
  }
}

function setupLanguageToggle() {
  document.getElementById('btn-lang')?.addEventListener('click', () => {
    const newLang = toggleLanguage();
    document.getElementById('lang-label').textContent = newLang === 'es' ? 'English' : 'Español';
    renderProjects();
    renderTechnologies();
    renderExperience();
    document.querySelectorAll('.glitch-text').forEach(el => triggerGlitch(el, 500));
  });
}

function setupMusicPlayer() {
  const player = document.getElementById('music-player');
  const volumeSlider = document.getElementById('volume-slider');
  const mobileAudioToggle = document.getElementById('mobile-audio-toggle');
  const mobileAudioIconOn = mobileAudioToggle?.querySelector('.mobile-audio-icon-on');
  const mobileAudioIconOff = mobileAudioToggle?.querySelector('.mobile-audio-icon-off');
  const playerCollapseBtn = document.getElementById('btn-player-collapse');
  const playerCollapseIconMin = playerCollapseBtn?.querySelector('.player-collapse-icon-min');
  const playerCollapseIconExpand = playerCollapseBtn?.querySelector('.player-collapse-icon-expand');
  let lastVolumeBeforeMute = getDefaultVolume();

  const syncPlayerCollapsedState = () => {
    if (!player || !playerCollapseBtn) return;
    const isDesktop = window.innerWidth > 1280;
    const isCollapsed = player.classList.contains('is-collapsed');
    playerCollapseBtn.classList.toggle('hidden', !isDesktop);
    playerCollapseBtn.setAttribute('aria-label', isCollapsed ? 'Expandir reproductor' : 'Minimizar reproductor');
    playerCollapseBtn.setAttribute('title', isCollapsed ? 'Expandir reproductor' : 'Minimizar reproductor');
    playerCollapseIconMin?.classList.toggle('hidden', isCollapsed);
    playerCollapseIconExpand?.classList.toggle('hidden', !isCollapsed);
    if (!isDesktop && isCollapsed) {
      player.classList.remove('is-collapsed');
    }
  };

  const updateMobileAudioToggle = (volumeValue) => {
    if (!mobileAudioToggle) return;
    const isMuted = volumeValue <= 0;
    mobileAudioToggle.classList.toggle('is-muted', isMuted);
    mobileAudioToggle.setAttribute('aria-label', isMuted ? 'Activar musica' : 'Mutear musica');
    mobileAudioToggle.setAttribute('title', isMuted ? 'Activar musica' : 'Mutear musica');
    mobileAudioIconOn?.classList.toggle('hidden', isMuted);
    mobileAudioIconOff?.classList.toggle('hidden', !isMuted);
  };

  if (volumeSlider) {
    volumeSlider.value = String(getDefaultVolume());
  }
  setVolume(getDefaultVolume());
  updateMobileAudioToggle(getDefaultVolume());
  if (player && localStorage.getItem('player-collapsed') === 'true') {
    player.classList.add('is-collapsed');
  }
  syncPlayerCollapsedState();

  document.getElementById('btn-play')?.addEventListener('click', () => toggleAudio());
  document.getElementById('btn-next')?.addEventListener('click', () => nextTrack());
  document.getElementById('btn-prev')?.addEventListener('click', () => prevTrack());
  volumeSlider?.addEventListener('input', (e) => {
    const nextVolume = parseInt(e.target.value);
    if (nextVolume > 0) {
      lastVolumeBeforeMute = nextVolume;
    }
    setVolume(nextVolume);
    updateMobileAudioToggle(nextVolume);
  });

  mobileAudioToggle?.addEventListener('click', () => {
    if (!volumeSlider) return;
    const currentVolume = parseInt(volumeSlider.value || '0');
    const nextVolume = currentVolume > 0 ? 0 : Math.max(lastVolumeBeforeMute, getDefaultVolume());
    if (currentVolume > 0) {
      lastVolumeBeforeMute = currentVolume;
    }
    volumeSlider.value = String(nextVolume);
    setVolume(nextVolume);
    updateMobileAudioToggle(nextVolume);
  });

  playerCollapseBtn?.addEventListener('click', () => {
    if (!player || window.innerWidth <= 1280) return;
    player.classList.toggle('is-collapsed');
    localStorage.setItem('player-collapsed', player.classList.contains('is-collapsed') ? 'true' : 'false');
    syncPlayerCollapsedState();
  });

  window.addEventListener('resize', syncPlayerCollapsedState);

  const trackSlider = document.getElementById('track-slider');
  if (trackSlider) {
    trackSlider.addEventListener('mousedown', () => handleSeekStart());
    trackSlider.addEventListener('touchstart', () => handleSeekStart());
    trackSlider.addEventListener('input', (e) => handleSeekMove(e.target.value));
    trackSlider.addEventListener('change', (e) => handleSeekEnd(e.target.value));
  }
}

function setupAutoStartAudio() {
  const tryAutoStart = async () => {
    if (getIsPlaying()) return;
    try {
      await toggleAudio();
    } catch (e) {}
  };

  window.setTimeout(tryAutoStart, 150);

  const unlockAudio = async () => {
    if (getIsPlaying()) return;
    try {
      await toggleAudio();
    } catch (e) {}
  };

  document.addEventListener('pointerdown', unlockAudio, { once: true });
  document.addEventListener('keydown', unlockAudio, { once: true });
}

function setupCvDownload() {
  document.getElementById('btn-cv-hero')?.addEventListener('click', () => {
    const lang = getCurrentLang();
    const link = document.createElement('a');
    if (lang === 'es') {
      link.href = '/assets/docs/Stefano_Tommasi_ES_CV.pdf';
      link.download = 'Stefano_Tommasi_ES_CV.pdf';
    } else {
      link.href = '/assets/docs/Stefano_Tommasi_EN_CV.pdf';
      link.download = 'Stefano_Tommasi_EN_CV.pdf';
    }
    link.click();
  });
}

function setupMobileNav() {
  const btn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const nav = document.getElementById('main-nav');

  btn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    navLinks?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!navLinks?.classList.contains('open')) return;
    if (nav?.contains(e.target)) return;
    navLinks.classList.remove('open');
  });
}

function setupResponsiveMusicPlayerPlacement() {
  const player = document.getElementById('music-player');
  const navLinks = document.querySelector('.nav-links');
  const nav = document.getElementById('main-nav');
  if (!player || !navLinks || !nav) return;

  const placeholder = document.createComment('music-player-anchor');
  player.parentNode?.insertBefore(placeholder, player);

  const syncPlacement = () => {
    const isMobile = window.innerWidth <= 1280;
    if (isMobile && player.parentElement !== navLinks) {
      navLinks.appendChild(player);
    } else if (!isMobile && player.parentNode !== placeholder.parentNode) {
      placeholder.parentNode?.insertBefore(player, placeholder.nextSibling);
    }
  };

  syncPlacement();
  window.addEventListener('resize', syncPlacement);
}

function setupGlitchText() {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.textContent = 'STEFANO TOMMASI';
    heroTitle.setAttribute('data-text', 'STEFANO TOMMASI');
  }

  document.querySelectorAll('.glitch-text').forEach(el => {
    if (!el.getAttribute('data-text') || el.getAttribute('data-text') === '') {
      el.setAttribute('data-text', el.textContent);
    }
  });
  document.querySelectorAll('.nav-link').forEach(el => {
    el.addEventListener('mouseenter', () => triggerGlitch(el, 300));
  });
}

function maybePlayTechReveal() {
  const modeKey = isDarkMode ? 'dark' : 'light';
  if (playedTechRevealModes.has(modeKey)) return;

  const grid = document.getElementById('tech-grid');
  if (!grid) return;

  playedTechRevealModes.add(modeKey);
  const targets = [...grid.querySelectorAll('.tech-category-title')];

  targets.forEach((el, index) => {
    window.setTimeout(() => {
      triggerGlitch(el, isDarkMode ? 420 : 480);
    }, index * 60);
  });
}

function triggerGlitch(element, duration = 500) {
  if (!element) return;

  if (element._glitchInterval) {
    clearInterval(element._glitchInterval);
  }

  let originalText = element.classList.contains('hero-title')
    ? 'STEFANO TOMMASI'
    : element.getAttribute('data-text');
  if (!originalText) {
    originalText = element.textContent;
    element.setAttribute('data-text', originalText);
  }

  element.classList.add('glitching');

  const charsCyberpunk = 'ï¾Šï¾ï¾‹ï½°ï½³ï½¼ï¾…ï¾“ï¾†ï½»ï¾œï¾‚ï½µï¾˜ï½±ï¾Žï¾ƒï¾ï½¹ï¾’ï½´ï½¶ï½·ï¾‘ï¾•ï¾—ï½¾ï¾ˆï½½ï¾€ï¾‡ï¾1234567890!<>-_\\\\';
  const charsNier = 'â–“â–‘â–’â–ˆâ–„â–€â”‚â”¤â•¡â•¢â•–â•—â•£â•‘â•—â•â•œâ•›â”â””â”´â”¬â”œâ”€â”¼â•žâ•Ÿâ•šâ•”â•©â•¦â• â•â•¬';
  const chars = isDarkMode ? charsCyberpunk : charsNier;

  let iterations = 0;
  const maxIterations = Math.floor(duration / 50);

  element._glitchInterval = setInterval(() => {
    element.textContent = originalText
      .split('')
      .map((char, i) => {
        if (i < iterations) return originalText[i];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
    iterations += 1;

    if (iterations >= originalText.length || iterations >= maxIterations) {
      clearInterval(element._glitchInterval);
      element._glitchInterval = null;
      element.textContent = originalText;
      element.classList.remove('glitching');
    }
  }, 50);
}

window.__portfolio = {
  navigateTo,
  get currentSection() { return currentSection; },
  get isDarkMode() { return isDarkMode; },
};
