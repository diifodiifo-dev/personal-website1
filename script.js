document.addEventListener("DOMContentLoaded", () => {
  // --- Menu toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a');

  menuToggle.addEventListener('click', () => nav.classList.toggle('active'));
  navLinks.forEach(link =>
    link.addEventListener('click', () => nav.classList.remove('active'))
  );

  // --- Scroll elements ---
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section');
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header shrink / scrolled
    if (scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    // Active link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (scrollY >= top && scrollY < top + sec.offsetHeight) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current)
        link.classList.add('active');
    });

    // Back to top button
    if (scrollY > 300) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });

  // --- Smooth scroll ---
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // --- Typing effect ---
  const typingSpan = document.querySelector('.typing-text span');
  const words = ["Web Developer", "Web Designer", "Software Engineer"];
  let wordIndex = 0, charIndex = 0;

  function type() {
    if (charIndex < words[wordIndex].length) {
      typingSpan.textContent += words[wordIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, 150);
    } else setTimeout(erase, 1500);
  }

  function erase() {
    if (charIndex > 0) {
      typingSpan.textContent = words[wordIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, 100);
    } else {
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 500);
    }
  }

  type();

  // --- Section reveal animation ---
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));
});

// CONTACT FORM HANDLER
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        formStatus.style.color = "red";
        formStatus.textContent = "Please fill in all fields.";
        return;
    }

    formStatus.style.color = "#b74b4b";
    formStatus.textContent = "Message sent successfully! (Demo)";

    contactForm.reset();
});

