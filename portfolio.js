const DRAFT_KEY = 'sumith-portfolio-draft';

const escapeText = (value) => String(value ?? '');
const make = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = escapeText(text);
  return node;
};
const setText = (id, value) => {
  const node = document.getElementById(id);
  if (node) node.textContent = escapeText(value);
};
const safeLink = (value, fallback = '#') => {
  const url = String(value || '').trim();
  if (/^(https:\/\/|mailto:|assets\/|\.\/)/i.test(url)) return url;
  return fallback;
};

function renderStats(items = []) {
  const root = document.getElementById('stats');
  root.replaceChildren();
  items.forEach((item) => {
    const box = make('div', 'stat-item');
    box.append(make('strong', String(item.value ?? '').length > 10 ? 'stat-value stat-value-long' : 'stat-value', item.value));
    box.append(make('small', 'stat-label', item.label));
    root.append(box);
  });
  root.append(make('p', 'stat-note', 'BUILDING AI SYSTEMS\nFROM DATA TO DECISION.'));
}

function renderProjects(items = []) {
  const root = document.getElementById('project-grid');
  root.replaceChildren();
  items.forEach((project, index) => {
    const card = make('article', `project-card reveal${index === 0 ? ' project-featured' : ''}`);
    const visual = make('div', `project-visual visual-tone-${index % 5}`);
    const visualTop = make('div', 'visual-top');
    visualTop.append(make('span', '', String(project.category || 'PROJECT').toUpperCase()));
    visualTop.append(make('span', '', `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`));
    const visualCore = make('div', 'visual-core');
    visualCore.append(make('span', 'visual-index', String(index + 1).padStart(2, '0')));
    visualCore.append(make('span', 'visual-word', String(project.title || 'Project').split(' ').slice(0, 2).join(' ').toUpperCase()));
    visual.append(visualTop, visualCore, make('span', 'visual-orbit orbit-a'), make('span', 'visual-orbit orbit-b'));
    const details = make('div', 'project-details');
    details.append(make('p', 'project-type', project.category));
    details.append(make('h3', '', project.title));
    details.append(make('p', 'project-description', project.summary));
    const points = make('ul', 'project-points');
    (project.highlights || []).filter(Boolean).forEach((highlight) => points.append(make('li', '', highlight)));
    details.append(points);
    const tags = make('div', 'tags');
    (project.tools || []).filter(Boolean).forEach((tool) => tags.append(make('span', '', tool)));
    details.append(tags);
    card.append(visual, details);
    root.append(card);
  });
}

function renderAbout(about = {}) {
  setText('about-title', about.title);
  setText('about-location', window.portfolioData.profile.location);
  setText('about-education', window.portfolioData.education?.[0]?.title || 'Computer Science');
  setText('about-focus', about.focus);
  setText('seal-mark', window.portfolioData.brand.stampMark || 'TS');
  setText('brand-header-mark', window.portfolioData.brand.stampMark || 'TS');
  setText('brand-footer-mark', window.portfolioData.brand.stampMark || 'TS');
  setText('seal-top', window.portfolioData.brand.stampTop || 'CURIOUS');
  setText('seal-bottom', window.portfolioData.brand.stampBottom || 'BY DESIGN');
  const paragraphs = document.getElementById('about-paragraphs');
  paragraphs.replaceChildren();
  (about.paragraphs || []).filter(Boolean).forEach((paragraph) => paragraphs.append(make('p', '', paragraph)));
}

function renderTimeline(experience = [], education = []) {
  const root = document.getElementById('experience-list');
  root.replaceChildren();
  experience.forEach((entry, index) => {
    const row = make('article', 'timeline-item reveal');
    row.append(make('div', 'timeline-date', entry.date));
    const main = make('div', 'timeline-main');
    const title = make('div', 'timeline-title');
    title.append(make('h3', '', entry.title), make('span', '', String(entry.place || '').toUpperCase()));
    main.append(title, make('p', 'timeline-org', entry.company), make('p', 'timeline-description', entry.description));
    row.append(main, make('div', 'timeline-mark', String(index + 1).padStart(2, '0')));
    root.append(row);
  });
  education.forEach((entry) => {
    const row = make('article', 'timeline-item education-item reveal');
    row.append(make('div', 'timeline-date', entry.date));
    const main = make('div', 'timeline-main');
    const title = make('div', 'timeline-title');
    title.append(make('h3', '', entry.title));
    main.append(title, make('p', 'timeline-org', entry.detail));
    row.append(main, make('div', 'timeline-mark', 'ED'));
    root.append(row);
  });
}

function renderSkills(skills = [], certifications = []) {
  const root = document.getElementById('skills-list');
  root.replaceChildren();
  skills.forEach((skill, index) => {
    const row = make('div', 'skill-row reveal');
    row.append(make('span', '', String(index + 1).padStart(2, '0')), make('b', '', skill.title), make('p', '', skill.detail));
    root.append(row);
  });
  const certRoot = document.getElementById('certifications-list');
  certRoot.replaceChildren();
  certifications.forEach((certificate) => certRoot.append(make('li', '', certificate)));
}

function renderPortfolio(data) {
  if (!data?.profile || !data?.brand) return;
  window.portfolioData = data;
  document.documentElement.style.setProperty('--orange', /^#[\da-f]{6}$/i.test(data.brand.accent) ? data.brand.accent : '#ff4d0b');
  setText('first-name', String(data.profile.firstName || '').toUpperCase());
  setText('last-name', String(data.profile.lastName || '').toUpperCase());
  setText('role', String(data.profile.role || '').toUpperCase());
  setText('location', String(data.profile.location || '').toUpperCase());
  setText('headline', data.profile.headline);
  setText('intro', data.profile.intro);
  setText('availability', String(data.profile.availability || '').toUpperCase());
  setText('contact-intro', data.profile.contactIntro || 'Let’s connect.');
  setText('header-full-name', `${data.profile.firstName} ${data.profile.lastName}`.toUpperCase());
  setText('footer-full-name', `${data.profile.firstName} ${data.profile.lastName}`.toUpperCase());
  setText('portrait-caption', `${data.profile.role || 'AI ENGINEER'} · ${(data.profile.location || 'INDIA').split(',').at(-1).trim()}`.toUpperCase());
  const photo = document.getElementById('profile-photo');
  photo.style.objectPosition = `center ${Math.min(100, Math.max(0, Number(data.profile.photoPosition ?? 25)))}%`;
  photo.classList.toggle('photo-color', data.profile.photoGrayscale === false);
  const photoValue = String(data.profile.photo || 'assets/sumith-portrait.jpeg');
  photo.src = /^data:image\/(jpeg|png|webp);base64,/i.test(photoValue) ? photoValue : safeLink(photoValue, 'assets/sumith-portrait.jpeg');
  photo.alt = `Portrait of ${data.profile.firstName} ${data.profile.lastName}`;
  const resume = document.getElementById('resume-link');
  resume.href = safeLink(data.profile.resume, 'assets/tirumala-sumith-resume.pdf');
  const emailHref = data.profile.email ? `mailto:${data.profile.email}` : '#contact';
  document.getElementById('email-button').href = emailHref;
  document.getElementById('email-link').href = emailHref;
  document.getElementById('email-link').firstChild.textContent = String(data.profile.email || '').toUpperCase() + ' ';
  document.getElementById('linkedin-link').href = safeLink(data.profile.linkedin);
  document.getElementById('github-link').href = safeLink(data.profile.github);
  document.getElementById('contact-github-link').href = safeLink(data.profile.github);
  renderStats(data.stats);
  renderProjects(data.projects);
  renderAbout(data.about);
  renderTimeline(data.experience, data.education);
  renderSkills(data.skills, data.certifications);
  document.title = `${data.profile.firstName} ${data.profile.lastName} — ${data.profile.role}`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `${data.profile.firstName} ${data.profile.lastName} — ${data.profile.headline}`);
  window.dispatchEvent(new Event('portfolio:rendered'));
}
window.renderPortfolio = renderPortfolio;

async function loadPortfolio() {
  let data;
  try {
    data = await fetch('content.json', { cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error('Could not read content.json');
      return response.json();
    });
  } catch (error) {
    console.error(error);
    document.body.classList.add('content-error');
    return;
  }
  try {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) data = JSON.parse(draft);
  } catch {
    // Continue with the shipped content if browser storage is unavailable or invalid.
  }
  renderPortfolio(data);
}

loadPortfolio();
