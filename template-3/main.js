const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Lucide icons
  if (window.lucide) lucide.createIcons();

  // Footer year
  $("#currentYear").textContent = new Date().getFullYear();

  // Rotating announcement
  const announcements = [
    "Applications are open for the 2027 intake.",
    "Curious about campus life? Send us a visit enquiry.",
    "Your ideas belong here. Explore Aurelia University."
  ];
  let announcementIndex = 0;
  window.setInterval(() => {
    announcementIndex = (announcementIndex + 1) % announcements.length;
    const el = $("#announcementText");
    if (el) el.textContent = announcements[announcementIndex];
  }, 5000);

  // Mobile navigation
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) lucide.createIcons();
  });
  $$("#mainNav a").forEach(link => link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    if (window.lucide) lucide.createIcons();
  }));

  // Scroll reveal
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => revealObserver.observe(el));

  // Count-up stats
  const counters = $$("[data-count]");
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const duration = 1300;
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + (target === 91 ? "%" : "+");
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(el => countObserver.observe(el));

  // Campus hotspots
  const campusPlaces = [
    { id: "learning", title: "Learning spaces", count: "01 / 04", copy: "Flexible classrooms and collaborative studios designed for discussion, experimentation and focused work.", tag: "Learn together", icon: "book-open" },
    { id: "library", title: "Library & ideas hub", count: "02 / 04", copy: "A welcoming place to research, read, collaborate and find a quiet corner to think.", tag: "Find your focus", icon: "library" },
    { id: "commons", title: "Student commons", count: "03 / 04", copy: "A social heart of campus for conversations, clubs, food and spontaneous connections.", tag: "Meet your people", icon: "coffee" },
    { id: "labs", title: "Labs & studios", count: "04 / 04", copy: "Hands-on environments where students can test ideas, build prototypes and learn by doing.", tag: "Make it real", icon: "flask-conical" }
  ];
  let campusIndex = 0;
  function showCampus(index) {
    campusIndex = (index + campusPlaces.length) % campusPlaces.length;
    const place = campusPlaces[campusIndex];
    $("#campusDetails").innerHTML = `<span class="campus-count">${place.count}</span><h3>${place.title}</h3><p>${place.copy}</p><div class="campus-tag"><i data-lucide="${place.icon}"></i> ${place.tag}</div>`;
    $$(".hotspot").forEach(pin => pin.classList.toggle("active", pin.dataset.place === place.id));
    if (window.lucide) lucide.createIcons();
  }
  $$(".hotspot").forEach(pin => pin.addEventListener("click", () => {
    const index = campusPlaces.findIndex(place => place.id === pin.dataset.place);
    showCampus(index);
  }));
  $("#campusPrev").addEventListener("click", () => showCampus(campusIndex - 1));
  $("#campusNext").addEventListener("click", () => showCampus(campusIndex + 1));

  // Gallery filters
  $("#galleryFilters").addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    const filter = button.dataset.filter;
    $$(".filter-btn").forEach(btn => btn.classList.toggle("active", btn === button));
    $$(".gallery-item").forEach(item => {
      item.classList.toggle("is-hidden", filter !== "all" && item.dataset.category !== filter);
    });
  });

  // Testimonial slider
  let testimonialIndex = 0;
  const testimonialTrack = $("#testimonialTrack");
  const testimonialSlides = $$(".testimonial-slide");
  function moveTestimonial(direction) {
    testimonialIndex = (testimonialIndex + direction + testimonialSlides.length) % testimonialSlides.length;
    testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;
  }
  $("#testimonialPrev").addEventListener("click", () => moveTestimonial(-1));
  $("#testimonialNext").addEventListener("click", () => moveTestimonial(1));

  // Contact form demo validation (no backend submission)
  $("#contactForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    $("#formMessage").textContent = "Thanks! This demo form is validated locally. Connect a form service or backend to receive real enquiries.";
    form.reset();
  });

  // Back to top
  const backTop = $("#backTop");
  window.addEventListener("scroll", () => backTop.classList.toggle("visible", window.scrollY > 450), { passive: true });
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Simple keyword-based chatbot
  const chatWindow = $("#chatWindow");
  const chatToggle = $("#chatToggle");
  const chatClose = $("#chatClose");
  const chatMessages = $("#chatMessages");
  const chatInput = $("#chatInput");
  function addMessage(text, type) {
    const message = document.createElement("div");
    message.className = type === "user" ? "user-message" : "bot-message";
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function getReply(question) {
    const q = question.toLowerCase();
    if (/hello|hi|hey/.test(q)) return "Hello! Great to meet you. What would you like to explore?";
    if (/program|course|degree|study/.test(q)) return "Aurelia's demo program areas include Business, Design, Science, Humanities, Media and Technology. Contact admissions for the verified course catalogue.";
    if (/admission|apply|application|eligib/.test(q)) return "Start by exploring a program, checking its entry requirements and contacting admissions for current deadlines and documents.";
    if (/campus|visit|tour|location/.test(q)) return "We'd love to help you explore campus. Use the enquiry form to ask about visit availability and the confirmed campus address.";
    if (/fee|scholarship|financial/.test(q)) return "Fees and scholarships depend on the program and intake. Please contact the admissions team for accurate, current details.";
    if (/club|sport|student life|activity/.test(q)) return "Student life can include creative clubs, sport, culture, volunteering and events. Ask the student team for the current activity list.";
    if (/faculty|teacher|professor/.test(q)) return "Our faculty section introduces sample profiles. Replace these with verified faculty information before publishing.";
    if (/contact|email|phone/.test(q)) return "Use the enquiry form on this page. The email and phone shown are placeholders and need to be replaced with official contact details.";
    return "Thanks for your question! I can help with programs, admissions, campus visits, fees, student life or contact details. For anything specific, please send an enquiry.";
  }
  function sendChat(text) {
    const clean = text.trim();
    if (!clean) return;
    addMessage(clean, "user");
    addMessage(getReply(clean), "bot");
  }
  chatToggle.addEventListener("click", () => { chatWindow.hidden = !chatWindow.hidden; if (!chatWindow.hidden) chatInput.focus(); });
  chatClose.addEventListener("click", () => { chatWindow.hidden = true; });
  $("#chatForm").addEventListener("submit", event => {
    event.preventDefault();
    sendChat(chatInput.value);
    chatInput.value = "";
  });
  $$(".chat-suggestions button").forEach(button => button.addEventListener("click", () => sendChat(button.dataset.question)));

  // Close the chatbot with Escape
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") chatWindow.hidden = true;
  });
