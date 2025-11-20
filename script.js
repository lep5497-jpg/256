// script.js
// Theme toggle, PDF download (html2pdf), and contact form validation.

// --- Theme Toggle ---
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

function updateThemeUI() {
  const theme = htmlEl.getAttribute('data-theme') || 'light';
  themeToggleBtn.setAttribute('aria-pressed', theme === 'dark');
  themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggleBtn.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  updateThemeUI();

  // Optional: persist preference
  try { localStorage.setItem('preferred-theme', next); } catch(e) {}
});

// Apply saved preference (if present)
try {
  const saved = localStorage.getItem('preferred-theme');
  if (saved) htmlEl.setAttribute('data-theme', saved);
} catch(e) {}
updateThemeUI();


// --- Download PDF using html2pdf.js ---
const downloadBtn = document.getElementById('download-pdf');
downloadBtn.addEventListener('click', () => {
  // Optional button disabled state while generating
  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Preparing...';

  // html2pdf configuration
  const opt = {
    margin:       10,
    filename:     'resume.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // choose an element to render — using the whole body here
  const element = document.body;

  // Trigger generation
  html2pdf().set(opt).from(element).save().then(() => {
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'Download PDF';
  }).catch((err) => {
    console.error('PDF generation failed:', err);
    alert('Unable to generate PDF in this browser.');
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'Download PDF';
  });
});


// --- Contact Form Validation ---
const form = document.getElementById('contact-form');
const errorBox = document.getElementById('form-error');

function validateEmail(email) {
  // simple, robust-ish email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorBox.hidden = true;
  errorBox.textContent = '';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const errors = [];
  if (!name) errors.push('Name cannot be empty.');
  if (!email || !validateEmail(email)) errors.push('Please enter a valid email address.');
  if (message.length < 10) errors.push('Message must be at least 10 characters long.');

  if (errors.length) {
    errorBox.innerHTML = errors.map(x => `<div>• ${x}</div>`).join('');
    errorBox.hidden = false;
    // focus first invalid field
    if (!name) form.name.focus();
    else if (!email || !validateEmail(email)) form.email.focus();
    else form.message.focus();
    return;
  }

  // Simulate successful send:
  alert('Message sent successfully!');
  form.reset();
  errorBox.hidden = true;
});
