const DRAFT_KEY = 'sumith-portfolio-draft';
let data;
const status = document.getElementById('save-status');
const profileFields = [
  ['firstName', 'First name'], ['lastName', 'Last name'], ['role', 'Professional title'], ['location', 'Location'],
  ['headline', 'Hero headline'], ['intro', 'Short introduction', 'textarea'], ['availability', 'Availability line'], ['contactIntro', 'Contact section introduction', 'textarea'],
  ['email', 'Email'], ['linkedin', 'LinkedIn URL'], ['github', 'GitHub URL'], ['resume', 'Résumé file path']
];
const brandFields = [
  ['accent', 'Accent color', 'color'], ['stampMark', 'Seal initials / mark'], ['stampTop', 'Seal top text'], ['stampBottom', 'Seal bottom text']
];
const aboutFields = [
  ['title', 'About heading', 'textarea'], ['paragraphs', 'About text', 'paragraphs'], ['focus', 'Focus area']
];
const repeaters = {
  projects: { label: 'Project', fields: [['title','Project name'],['category','Category'],['summary','Summary','textarea'],['highlights','Highlights (one per line)','lines'],['tools','Tools / tags (one per line)','lines']] },
  experience: { label: 'Role', fields: [['title','Job title'],['company','Company'],['date','Dates'],['place','Location'],['description','Description','textarea']] },
  education: { label: 'Education item', fields: [['title','Qualification'],['detail','Institution / place'],['date','Year / date']] },
  skills: { label: 'Skill group', fields: [['title','Group name'],['detail','Skills (separate with ·)']] },
  stats: { label: 'Highlight', fields: [['value','Value'],['label','Description']] }
};

const byPath = (path) => path.split('.').reduce((value, key) => value?.[key], data);
function setPath(path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const object = keys.reduce((current, key) => current[key], data);
  object[last] = value;
  saveDraft();
}
function saveDraft() {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch {}
  status.textContent = 'Saved in this browser · preview updated';
  const rawEditor = document.getElementById('raw-content');
  if (rawEditor && document.activeElement !== rawEditor) rawEditor.value = JSON.stringify(data, null, 2);
  const frame = document.getElementById('preview-frame');
  frame.contentWindow?.renderPortfolio?.(data);
}
function field(path, label, kind = 'text') {
  const wrap = document.createElement('label');
  wrap.className = 'editor-field';
  const title = document.createElement('span'); title.textContent = label; wrap.append(title);
  let input;
  if (kind === 'textarea' || kind === 'lines') {
    input = document.createElement('textarea'); input.rows = kind === 'lines' ? 3 : 4;
  } else {
    input = document.createElement('input'); input.type = kind;
  }
  input.dataset.path = path;
  const current = byPath(path);
  input.value = Array.isArray(current) ? current.join('\n') : (current ?? '');
  input.addEventListener('input', () => setPath(path, kind === 'lines' ? input.value.split('\n').map((line) => line.trim()).filter(Boolean) : input.value));
  wrap.append(input);
  return wrap;
}
function renderBaseFields(containerId, prefix, fields) {
  const container = document.getElementById(containerId); container.replaceChildren();
  fields.forEach(([key, label, kind]) => container.append(field(`${prefix}.${key}`, label, kind || 'text')));
}
function renderParagraphFields() {
  const container = document.getElementById('about-fields'); container.replaceChildren();
  container.append(field('about.title', 'About heading', 'textarea'));
  data.about.paragraphs.forEach((paragraph, index) => {
    const wrap = document.createElement('label'); wrap.className = 'editor-field';
    const title = document.createElement('span'); title.textContent = `About paragraph ${index + 1}`; wrap.append(title);
    const input = document.createElement('textarea'); input.rows = 4; input.value = paragraph; input.dataset.path = `about.paragraphs.${index}`;
    input.addEventListener('input', () => { data.about.paragraphs[index] = input.value; saveDraft(); }); wrap.append(input); container.append(wrap);
  });
  container.append(field('about.focus', 'Focus area'));
}
function renderRepeater(key) {
  const root = document.getElementById(`${key}-fields`); root.replaceChildren();
  (data[key] || []).forEach((item, index) => {
    const block = document.createElement('fieldset'); block.className = 'repeat-item';
    const head = document.createElement('div'); head.className = 'repeat-item-head';
    const legend = document.createElement('strong'); legend.textContent = `${repeaters[key].label} ${String(index + 1).padStart(2,'0')}`;
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove-item'; remove.textContent = 'Remove';
    remove.addEventListener('click', () => { data[key].splice(index, 1); saveDraft(); renderRepeater(key); });
    head.append(legend, remove); block.append(head);
    repeaters[key].fields.forEach(([prop, label, kind]) => {
      const control = document.createElement('label'); control.className = 'editor-field';
      const title = document.createElement('span'); title.textContent = label; control.append(title);
      const input = kind === 'textarea' || kind === 'lines' ? document.createElement('textarea') : document.createElement('input');
      if (input.tagName === 'TEXTAREA') input.rows = kind === 'lines' ? 3 : 4;
      input.value = Array.isArray(item[prop]) ? item[prop].join('\n') : (item[prop] ?? '');
      input.addEventListener('input', () => { item[prop] = kind === 'lines' ? input.value.split('\n').map((line) => line.trim()).filter(Boolean) : input.value; saveDraft(); });
      control.append(input); block.append(control);
    });
    root.append(block);
  });
}
function renderEditor() {
  renderBaseFields('profile-fields', 'profile', profileFields);
  renderBaseFields('brand-fields', 'brand', brandFields);
  renderParagraphFields();
  Object.keys(repeaters).forEach(renderRepeater);
  document.getElementById('photo-preview').src = data.profile.photo;
  document.getElementById('photo-preview').style.filter = data.profile.photoGrayscale === false ? 'none' : 'grayscale(100%)';
  const position = document.getElementById('photo-position');
  const positionValue = document.getElementById('photo-position-value');
  position.value = String(data.profile.photoPosition ?? 25);
  document.getElementById('photo-preview').style.objectPosition = `center ${position.value}%`;
  positionValue.value = `${position.value}%`;
  position.oninput = () => { data.profile.photoPosition = Number(position.value); positionValue.value = `${position.value}%`; document.getElementById('photo-preview').style.objectPosition = `center ${position.value}%`; saveDraft(); };
  const grayscale = document.getElementById('photo-grayscale');
  grayscale.checked = data.profile.photoGrayscale !== false;
  grayscale.onchange = () => { data.profile.photoGrayscale = grayscale.checked; document.getElementById('photo-preview').style.filter = grayscale.checked ? 'grayscale(100%)' : 'none'; saveDraft(); };
  const certifications = document.querySelector('[data-path="certifications"]');
  certifications.value = data.certifications.join('\n');
  certifications.oninput = () => { data.certifications = certifications.value.split('\n').map((line) => line.trim()).filter(Boolean); saveDraft(); };
  document.getElementById('raw-content').value = JSON.stringify(data, null, 2);
}
function addItem(key) {
  const defaults = {
    projects: { title:'New project', category:'Category · Type', summary:'Describe the project.', highlights:['What you built'], tools:['Tool'] },
    experience: { title:'Role', company:'Organization', date:'Dates', place:'Location', description:'Describe your work.' },
    education: { title:'Qualification', detail:'Institution', date:'Year' },
    skills: { title:'Skill group', detail:'Skill · Skill · Skill' },
    stats: { value:'0', label:'Add a short highlight' }
  };
  data[key].push(structuredClone(defaults[key])); saveDraft(); renderRepeater(key);
}
function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Choose an image file.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The photo could not be read.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('The photo could not be decoded.'));
      image.onload = () => {
        const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => addItem(button.dataset.add)));
document.getElementById('photo-file').addEventListener('change', async (event) => {
  const file = event.target.files[0]; if (!file) return;
  try {
    data.profile.photo = await compressPhoto(file);
    document.getElementById('photo-preview').src = data.profile.photo;
    saveDraft(); status.textContent = 'Photo updated · download content to publish it';
  } catch (error) { status.textContent = error.message; }
});
document.getElementById('restore-photo').addEventListener('click', () => {
  data.profile.photo = 'assets/sumith-portrait.jpeg'; data.profile.photoPosition = 25; data.profile.photoGrayscale = true; document.getElementById('photo-preview').src = data.profile.photo; document.getElementById('photo-position').value = '25'; document.getElementById('photo-position-value').value = '25%'; document.getElementById('photo-grayscale').checked = true; document.getElementById('photo-preview').style.filter = 'grayscale(100%)'; saveDraft();
});
document.getElementById('download-content').addEventListener('click', () => {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: 'application/json' });
  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'content.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  status.textContent = 'Downloaded content.json · replace the site copy, then redeploy';
});

document.getElementById('apply-json').addEventListener('click', () => {
  const error = document.getElementById('json-error');
  try {
    const parsed = JSON.parse(document.getElementById('raw-content').value);
    const arrays = ['stats','projects','experience','education','skills','certifications'];
    const profileKeys = ['firstName','lastName','role','location','headline','intro','photo','email','linkedin','github','availability','resume','contactIntro'];
    if (!parsed.profile || !parsed.brand || !parsed.about || !Array.isArray(parsed.about.paragraphs) || !arrays.every((key) => Array.isArray(parsed[key]))) throw new Error('Keep profile, brand, about paragraphs, and all content lists in the JSON.');
    if (!profileKeys.every((key) => typeof parsed.profile[key] === 'string')) throw new Error('Profile fields must stay text values.');
    if (!/^#[\da-f]{6}$/i.test(parsed.brand.accent) || !['stampMark','stampTop','stampBottom'].every((key) => typeof parsed.brand[key] === 'string')) throw new Error('Use a six-digit hex color and text values for the seal.');
    if (typeof parsed.about.title !== 'string' || typeof parsed.about.focus !== 'string' || !parsed.about.paragraphs.every((value) => typeof value === 'string')) throw new Error('About section values must be text.');
    const shapes = {stats:['value','label'],projects:['title','category','summary'],experience:['title','company','date','place','description'],education:['title','detail','date'],skills:['title','detail']};
    for (const [key, fields] of Object.entries(shapes)) if (!parsed[key].every((item) => item && fields.every((fieldName) => typeof item[fieldName] === 'string'))) throw new Error(`Check the text fields in ${key}.`);
    if (!parsed.projects.every((project) => Array.isArray(project.highlights) && Array.isArray(project.tools)) || !parsed.certifications.every((value) => typeof value === 'string')) throw new Error('Project highlights, tools, and certifications must be lists of text.');
    data = parsed;
    error.textContent = '';
    renderEditor();
    saveDraft();
    status.textContent = 'JSON applied · preview updated';
  } catch (exception) {
    error.textContent = exception instanceof SyntaxError ? `JSON error: ${exception.message}` : exception.message;
  }
});

document.getElementById('reset-content').addEventListener('click', async () => {
  if (!window.confirm('Reset all browser edits to the original portfolio content?')) return;
  const response = await fetch('content.json', { cache: 'no-store' }); data = await response.json();
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
  renderEditor(); saveDraft(); status.textContent = 'Original content restored in this browser';
});

(async () => {
  try {
    data = await fetch('content.json', { cache: 'no-store' }).then((response) => response.json());
    try { const saved = localStorage.getItem(DRAFT_KEY); if (saved) data = JSON.parse(saved); } catch {}
    renderEditor();
    document.getElementById('preview-frame').addEventListener('load', () => document.getElementById('preview-frame').contentWindow?.renderPortfolio?.(data));
  } catch {
    status.textContent = 'Could not load content.json. Start the local server from the site folder.';
  }
})();
