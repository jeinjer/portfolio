const translations = {
  es: {
    'nav.about': 'SOBRE MI',
    'nav.experience': 'EXPERIENCIA',
    'nav.projects': 'PROYECTOS',
    'nav.tech': 'TECNOLOGÍAS',
    'nav.contact': 'CONTACTO',
    'hero.subtitle': 'ANALISTA QA y DESARROLLADOR FULLSTACK',
    'hero.desc': 'Construyendo software de dí­a, cazando bugs de noche',
    'hero.contact': 'CONTACTO',
    'cv.btn': 'DESCARGAR CV',
    'about.title': 'SOBRE MI',
    'about.line0': '> Ingeniero en Sistemas recibido en la UTN FRC.',
    'about.line1': '> Especializado en testing manual/automatizado y desarrollo web.',
    'about.line2': '> Stack QA: Playwright, Cucumber, Postman',
    'about.line3': '> Stack Web: React/Next.js, Node.js, Supabase, Prisma, Mongo.',
    'experience.title': 'EXPERIENCIA',
    'projects.title': 'PROYECTOS',
    'tech.title': 'TECNOLOGÍAS',
    'contact.title': 'CONTACTO',
    'contact.intro': '¿Quieres contactar conmigo por una propuesta? ¡Hablemos!',
    'exp.short_cirkuit.title': 'Short Cirkuit',
    'exp.short_cirkuit.subtitle': 'Soporte IT (Mar 2020 - Dic 2023)',
    'exp.short_cirkuit.content': '<ul><li>Servicio al cliente y asesoramiento técnico.</li><li>Armado de PCs y presupuestos a medida.</li><li>Formateo, instalación y configuración de sistemas operativos.</li><li>Mantenimiento preventivo, limpieza física y optimización de software.</li></ul>',
    'exp.tga.title': 'TGA',
    'exp.tga.subtitle': 'QA Analyst / QA Tester (Dec 2023 - Jan 2026)',
    'exp.tga.content': '<ul><li>Planificación y ejecución de pruebas funcionales para web y mobile.</li><li>Ejecucion de smoke, regresión y retesting por release.</li><li>Diseño, mantenimiento y priorización de casos de prueba.</li><li>Reporte y seguimiento de defectos en JIRA.</li></ul>',
    'exp.freelance.title': 'Freelancer',
    'exp.freelance.subtitle': 'Analista QA & Desarrollador Fullstack (Actual)',
    'exp.freelance.content': '<ul><li>Desarrollo de aplicaciones web responsivas.</li><li>Automatización de pruebas (E2E, API).</li><li>Mantenimiento y despliegue continuo de soluciones personalizadas.</li></ul>',
    'project.1.title': 'SHORT CIRKUIT',
    'project.1.desc': 'Rediseño integral de un e-commerce/servicio técnico con catalogo, carrito, checkout, autenticación, panel admin y auto-sincronización de stock.',
    'project.2.title': 'SHORT CIRKUIT AUTOMATION TEST',
    'project.2.desc': 'Suite E2E y API enfocada en regresión para validar flujos críticos de negocio.',
    'btn.repo': '> REPO',
    'btn.live': '> WEB',
    'player.idle': 'Sin reproducir',
    'player.playlist': 'PLAYLIST',
  },
  en: {
    'nav.about': 'ABOUT ME',
    'nav.experience': 'EXPERIENCE',
    'nav.projects': 'PROJECTS',
    'nav.tech': 'TECH',
    'nav.contact': 'CONTACT',
    'hero.subtitle': 'QA ANALYST - FULLSTACK DEVELOPER',
    'hero.desc': 'Building software by day, hunting bugs by night.',
    'hero.contact': 'CONTACT',
    'cv.btn': 'DOWNLOAD CV',
    'about.title': 'ABOUT ME',
    'about.line0': '> Systems Engineer graduated from UTN FRC.',
    'about.line1': '> Specialized in manual/automated testing and web development.',
    'about.line2': '> QA Stack: Playwright, Cucumber, Postman',
    'about.line3': '> Web Stack: React/Next.js, Node.js, Supabase, Prisma, Mongo.',
    'experience.title': 'EXPERIENCE',
    'projects.title': 'PROJECTS',
    'tech.title': 'TECH',
    'contact.title': 'CONTACT',
    'contact.intro': '¿Want to  contact me for a proposal? Let\'s talk!',
    'exp.short_cirkuit.title': 'Short Cirkuit',
    'exp.short_cirkuit.subtitle': 'IT Support (Mar 2020 - Dec 2023)',
    'exp.short_cirkuit.content': '<ul><li>Customer service and technical advice.</li><li>Custom PC assembly and quoting.</li><li>OS formatting, installation, and configuration.</li><li>Preventive maintenance, hardware cleaning, and software optimization.</li></ul>',
    'exp.tga.title': 'TGA',
    'exp.tga.subtitle': 'QA Analyst / QA Tester (Dec 2023 - Jan 2026)',
    'exp.tga.content': '<ul><li>Planning and execution of functional tests for web and mobile.</li><li>Execution of smoke and regression tests; retesting and fix verification.</li><li>Design, maintenance, and prioritization of test cases.</li><li>Defect reporting and tracking in JIRA.</li></ul>',
    'exp.freelance.title': 'Freelancer',
    'exp.freelance.subtitle': 'QA Automation & Fullstack Developer (Current)',
    'exp.freelance.content': '<ul><li>Web responsive application development.</li><li>Test automation (E2E, API).</li><li>Maintenance and continuous deployment of custom solutions.</li></ul>',
    'project.1.title': 'SHORT CIRKUIT',
    'project.1.desc': 'Full reskin of a tech-service/e-commerce site with catalog, cart, checkout, authentication, admin panel and automated product sync.',
    'project.2.title': 'SHORT CIRKUIT AUTOMATION TEST',
    'project.2.desc': 'E2E and API regression suite for critical business flows using Playwright, Cucumber, rich evidence artifacts and domain-based coverage.',
    'btn.repo': '> REPO',
    'btn.live': '> WEB',
    'player.idle': 'Not playing',
    'player.playlist': 'PLAYLIST',
  }
};

let currentLang = localStorage.getItem('portfolio-lang') || 'es';

export function getCurrentLang() { return currentLang; }

export function t(key) {
  return translations[currentLang]?.[key] || translations.es?.[key] || key;
}

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('portfolio-lang', lang);
  updateAllI18n();
}

export function toggleLanguage() {
  const newLang = currentLang === 'es' ? 'en' : 'es';
  setLanguage(newLang);
  return newLang;
}

export function updateAllI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    el.textContent = text;
    if (el.classList.contains('glitch-text')) {
      el.setAttribute('data-text', text);
    }
  });
}

export default { getCurrentLang, t, setLanguage, toggleLanguage, updateAllI18n };
