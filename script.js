// script.js - Dark Mode Toggle

const html = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');

// Function to set theme
function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Update button icon/text
  if (theme === 'dark') {
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>'; // Sun for light mode toggle
    toggleBtn.title = 'Switch to Light Mode';
  } else {
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    toggleBtn.title = 'Switch to Dark Mode';
  }
}

// Load saved theme on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else {
  // Default to light (or use prefers-color-scheme if you want system default)
  setTheme('light');
}

// Toggle on click
toggleBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme') || 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// Optional: Smooth scroll for nav links (if you have them)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});