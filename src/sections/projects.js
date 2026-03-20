import { t } from '../i18n.js';

const PROJECTS = [
  {
    id: 1,
    titleKey: 'project.1.title',
    descKey: 'project.1.desc',
    stack: ['React', 'Vite', 'Express', 'Prisma', 'MongoDB'],
    icon: 'â–£',
    repoUrl: 'https://github.com/jeinjer/short-cirkuit-reskin',
    liveUrl: 'https://www.shortcirkuit.com/',
  },
  {
    id: 2,
    titleKey: 'project.2.title',
    descKey: 'project.2.desc',
    stack: ['TypeScript', 'Playwright', 'Cucumber'],
    icon: 'â—‡',
    repoUrl: 'https://github.com/jeinjer/Short-Cirkuit-Automation-Test',
    liveUrl: '',
  },
];

export function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((p) => `
    <div class="project-card" id="project-card-${p.id}">
      <div class="card-title-row">
        <div class="card-title glitch-text" data-text="${t(p.titleKey)}" data-i18n="${p.titleKey}">${t(p.titleKey)}</div>
      </div>
      <div class="card-desc" data-i18n="${p.descKey}">${t(p.descKey)}</div>
      <div class="card-stack">
        ${p.stack.map((s) => `<span class="stack-tag">${s}</span>`).join('')}
      </div>
      <div class="card-links">
        <a href="${p.repoUrl}" class="card-link" target="_blank" rel="noopener noreferrer" data-i18n="btn.repo">${t('btn.repo')}</a>
        ${p.liveUrl ? `<a href="${p.liveUrl}" class="card-link" target="_blank" rel="noopener noreferrer" data-i18n="btn.live">${t('btn.live')}</a>` : ''}
      </div>
    </div>
  `).join('');
}

export default { renderProjects };
