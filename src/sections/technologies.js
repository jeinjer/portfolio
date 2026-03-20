import { getCurrentLang } from '../i18n.js';

const TECHNOLOGY_CATEGORIES = [
  {
    title: { es: 'Frontend', en: 'Frontend' },
    techs: [
    { name: 'JavaScript', icon: 'devicon-javascript-plain' },
    { name: 'TypeScript', icon: 'devicon-typescript-plain' },
    { name: 'React', icon: 'devicon-react-original' },
    { name: 'Next.js', icon: 'devicon-nextjs-plain' },
    { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-original' },
    { name: 'HTML5', icon: 'devicon-html5-plain' },
    { name: 'CSS3', icon: 'devicon-css3-plain' },
    ],
  },
  {
    title: { es: 'Backend', en: 'Backend' },
    techs: [
    { name: 'Node.js', icon: 'devicon-nodejs-plain' },
    { name: 'Express', icon: 'devicon-express-original' },
    { name: 'Spring Boot', icon: 'devicon-spring-original' },
    { name: 'Prisma', icon: 'devicon-prisma-original' },
    { name: 'Swagger', icon: 'devicon-swagger-plain' },
    ],
  },
  {
    title: { es: 'QA', en: 'QA' },
    techs: [
    { name: 'Playwright', icon: 'devicon-playwright-plain' },
    { name: 'Jest', icon: 'devicon-jest-plain' },
    { name: 'Cucumber', icon: 'fas fa-vial' },
    { name: 'JMeter', icon: 'fas fa-stopwatch' },
    { name: 'Postman', icon: 'devicon-postman-plain' },
    { name: 'OWASP ZAP', icon: 'fas fa-shield-alt' },
    ],
  },
  {
    title: { es: 'Bases de Datos', en: 'Databases' },
    techs: [
    { name: 'PostgreSQL', icon: 'devicon-postgresql-plain' },
    { name: 'SQL Server', icon: 'devicon-azuresqldatabase-plain' },
    { name: 'MongoDB', icon: 'devicon-mongodb-plain' },
    { name: 'Supabase', icon: 'devicon-supabase-plain' },
    ],
  },
  {
    title: { es: 'Cloud / Despliegue', en: 'Cloud / Deploy' },
    techs: [
    { name: 'Vercel', icon: 'devicon-vercel-original' },
    ],
  },
  {
    title: { es: 'CI/CD', en: 'CI/CD' },
    techs: [
    { name: 'GitHub Actions', icon: 'devicon-githubactions-plain' },
    ],
  },
  {
    title: { es: 'Herramientas', en: 'Tools' },
    techs: [
    { name: 'Git', icon: 'devicon-git-plain' },
    { name: 'GitHub', icon: 'devicon-github-original' },
    { name: 'JIRA', icon: 'devicon-jira-plain' },
    { name: 'Confluence', icon: 'devicon-confluence-plain' },
    ],
  },
];

export function renderTechnologies() {
  const grid = document.getElementById('tech-grid');
  if (!grid) return;
  const lang = getCurrentLang();

  grid.innerHTML = TECHNOLOGY_CATEGORIES.map(({ title, techs }, categoryIndex) => {
    const category = title[lang] || title.es;
    return `
    <div class="tech-category" style="--category-order:${categoryIndex};">
      <h3 class="tech-category-title glitch-text" data-text="${category}">${category}</h3>
      <div class="tech-category-grid">
        ${techs.map(tech => `
          <div class="tech-item" id="tech-${tech.name.replace(/[^a-zA-Z0-9]/g, '')}">
            <span class="tech-icon"><i class="${tech.icon}"></i></span>
            <span class="tech-name">${tech.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  }).join('');
}

export default { renderTechnologies };
