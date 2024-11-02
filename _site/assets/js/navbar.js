// assets/js/navbar.js
let lastScrollTop = 0;
const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Scroll down - hide navbar
    navbar.style.top = "-80px"; // Adjust this value based on the height of your navbar
  } else {
    // Scroll up - show navbar
    navbar.style.top = "15px"; // Reset position
  }

  lastScrollTop = scrollTop; // Update last scroll position
});
