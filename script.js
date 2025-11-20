// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const downloadBtn = document.getElementById('downloadPdf');
  const yearSpan = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');
  const formError = document.getElementById('formError');

  // Set year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // --- Theme toggle (dark / light) ---
  function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    // optional: persist
    try { localStorage.setItem('site-theme', theme); } catch(e){}
  }

  // Initialize from localStorage or prefers-color-scheme
  const savedTheme = (function(){
    try { return localStorage.getItem('site-theme'); } catch(e){ return null; }
  })();

  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // --- Download PDF using html2pdf ---
  // Requires html2pdf.bundle.min.js included in index.html
  downloadBtn.addEventListener('click', async () => {
    const element = document.getElementById('pageContent');
    if (!element) return;

    // Optional: show a quick visual feedback
    downloadBtn.textContent = 'Preparing…';

    // html2pdf options
    const opt = {
      margin:       0.4,
      filename:     'resume.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: false, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      // Wait a tiny bit to allow paint if theme just changed
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation failed', err);
      alert('Unable to generate PDF. Please try again.');
    } finally {
      // restore text
      downloadBtn.textContent = 'Download PDF';
    }
  });

  // --- Contact form validation ---
  function validateEmail(email) {
    // simple but effective regex for general validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formError.style.display = 'none';
    formError.textContent = '';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const errors = [];
    if (!name) errors.push('Please enter your name.');
    if (!validateEmail(email)) errors.push('Please enter a valid email address.');
    if (message.length < 10) errors.push('Message must be at least 10 characters.');

    if (errors.length) {
      formError.innerHTML = errors.map(e => `<div>• ${e}</div>`).join('');
      formError.style.display = 'block';
      // focus first invalid
      if (!name) document.getElementById('name').focus();
      else if (!validateEmail(email)) document.getElementById('email').focus();
      else document.getElementById('message').focus();
      return;
    }

    // If validation passes
    alert('Message sent successfully!');

    // clear form
    contactForm.reset();
    formError.style.display = 'none';
  });

});
