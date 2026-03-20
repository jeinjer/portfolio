import { t } from '../i18n.js';

const EXPERIENCES = [
  {
    id: 'exp1',
    left: '20%',
    top: '60%',
    i18nTitle: 'exp.short_cirkuit.title',
    i18nSubtitle: 'exp.short_cirkuit.subtitle',
    i18nContent: 'exp.short_cirkuit.content'
  },
  {
    id: 'exp2',
    left: '50%',
    top: '40%',
    i18nTitle: 'exp.tga.title',
    i18nSubtitle: 'exp.tga.subtitle',
    i18nContent: 'exp.tga.content'
  },
  {
    id: 'exp3',
    left: '80%',
    top: '70%',
    i18nTitle: 'exp.freelance.title',
    i18nSubtitle: 'exp.freelance.subtitle',
    i18nContent: 'exp.freelance.content'
  }
];

export function renderExperience() {
  const container = document.getElementById('experience-container');
  if (!container) return;

  let mapHtml = `
    <div class="game-map-container">
      <svg class="game-map-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 0,50 C 15,35 25,60 40,50 C 55,35 65,60 80,50 C 95,35 100,50 100,50" stroke="currentColor" stroke-width="0.2" fill="none" opacity="0.3"></path>
        <path d="M 10,0 C 15,25 20,75 15,100" stroke="currentColor" stroke-width="0.2" fill="none" opacity="0.2" stroke-dasharray="1,1"></path>
        <path d="M 50,0 C 45,25 55,75 50,100" stroke="currentColor" stroke-width="0.2" fill="none" opacity="0.2" stroke-dasharray="1,1"></path>
        <path d="M 90,0 C 95,25 85,75 90,100" stroke="currentColor" stroke-width="0.2" fill="none" opacity="0.2" stroke-dasharray="1,1"></path>
        <circle cx="20" cy="60" r="15" stroke="currentColor" stroke-width="0.2" fill="none" opacity="0.15"></circle>
        <circle cx="50" cy="40" r="20" stroke="currentColor" stroke-width="0.2" fill="none" opacity="0.15"></circle>
        <circle cx="80" cy="70" r="18" stroke="currentColor" stroke-width="0.2" fill="none" opacity="0.15"></circle>
      </svg>
      <svg class="game-map-path-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 20,60 L 50,40 L 80,70" stroke="currentColor" stroke-width="0.6" fill="none" stroke-dasharray="1, 1.5" class="game-path-line"></path>
      </svg>
  `;

  EXPERIENCES.forEach(exp => {
    mapHtml += `
      <div class="game-map-node" style="left: ${exp.left}; top: ${exp.top};" data-exp-id="${exp.id}" title="${t(exp.i18nTitle)}">
        <span class="game-map-label" data-i18n="${exp.i18nTitle}">${t(exp.i18nTitle)}</span>
      </div>
    `;
  });

  mapHtml += `</div>
    <div id="rpg-modal" class="rpg-modal-overlay">
      <div class="rpg-modal game-modal">
        <button class="rpg-modal-close" id="rpg-modal-close">X</button>
        <div class="rpg-modal-title glitch-text" id="rpg-modal-title" data-text=""></div>
        <div class="rpg-modal-subtitle" id="rpg-modal-subtitle"></div>
        <div class="rpg-modal-content" id="rpg-modal-content"></div>
      </div>
    </div>
  `;

  container.innerHTML = mapHtml;

  const modal = document.getElementById('rpg-modal');
  const closeBtn = document.getElementById('rpg-modal-close');
  const closeModal = () => {
    modal?.classList.remove('active');
    document.body.classList.remove('modal-open');
  };

  const openModal = () => {
    modal?.classList.add('active');
    document.body.classList.add('modal-open');
  };

  document.querySelectorAll('.game-map-node').forEach(node => {
    node.addEventListener('click', () => {
      const expId = node.getAttribute('data-exp-id');
      const expData = EXPERIENCES.find(e => e.id === expId);
      if (expData) {
        document.getElementById('rpg-modal-title').textContent = t(expData.i18nTitle);
        document.getElementById('rpg-modal-title').setAttribute('data-text', t(expData.i18nTitle));
        document.getElementById('rpg-modal-subtitle').textContent = t(expData.i18nSubtitle);
        document.getElementById('rpg-modal-content').innerHTML = t(expData.i18nContent);
        openModal();

        const titleEl = document.getElementById('rpg-modal-title');
        titleEl.classList.add('glitching');
        setTimeout(() => titleEl.classList.remove('glitching'), 400);
      }
    });
  });

  closeBtn?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  modal?._escHandler && document.removeEventListener('keydown', modal._escHandler);
  modal._escHandler = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', modal._escHandler);
}

export default { renderExperience };
