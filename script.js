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

// Save contact form submissions through Supabase's Data API.
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('[type="submit"]');
    const config = window.SUPABASE_CONFIG;
    const values = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim()
    };

    if (!values.name || !values.email || !values.message) {
      formStatus.style.color = "#ff7777";
      formStatus.textContent = "Please fill in all fields.";
      return;
    }

    if (!config?.url || !config?.publishableKey) {
      formStatus.style.color = "#ff7777";
      formStatus.textContent = "The contact form is not connected yet. Please email me directly.";
      return;
    }

    submitButton.disabled = true;
    formStatus.style.color = "#ccc";
    formStatus.textContent = "Sending your message…";

    try {
      const response = await fetch(`${config.url}/rest/v1/portfolio_contact_messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: config.publishableKey,
          Authorization: `Bearer ${config.publishableKey}`,
          Prefer: "return=minimal"
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) throw new Error(`Supabase returned ${response.status}`);

      formStatus.style.color = "#b74b4b";
      formStatus.textContent = "Thanks! Your message has been sent.";
      contactForm.reset();
    } catch (error) {
      console.error("Contact form submission failed:", error);
      formStatus.style.color = "#ff7777";
      formStatus.textContent = "Your message could not be sent. Please try again or email me directly.";
    } finally {
      submitButton.disabled = false;
    }
  });
}


