const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

function toggleMenu() {
  const isOpen = navbar.classList.toggle('active');
  menuIcon.classList.toggle('bx-menu', !isOpen);
  menuIcon.classList.toggle('bx-x', isOpen);
  menuIcon.setAttribute('aria-expanded', String(isOpen));
  menuIcon.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
}

menuIcon.addEventListener('click', toggleMenu);
menuIcon.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleMenu();
  }
});

navbar.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
    menuIcon.classList.replace('bx-x', 'bx-menu');
    menuIcon.setAttribute('aria-expanded', 'false');
    menuIcon.setAttribute('aria-label', 'Open navigation menu');
  });
});
