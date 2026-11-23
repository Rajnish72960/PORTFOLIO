// script.js

// Select the menu icon and navbar
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

// Toggle active class when menu icon is clicked
menuIcon.onclick = () => {
  navbar.classList.toggle('active');
  // Toggle menu icon between hamburger and close
  if (navbar.classList.contains('active')) {
    menuIcon.classList.replace('bx-menu', 'bx-x');
  } else {
    menuIcon.classList.replace('bx-x', 'bx-menu');
  }
};
