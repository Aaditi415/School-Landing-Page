document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Current year
  $("#currentYear").textContent = new Date().getFullYear();

  // Announcement rotation + pause on hover/focus/tab hidden
  const announcementBar = $("#announcementBar");
  const announcementMessage = $("#announcementMessage");
  const announcementProgress = $("#announcementProgress");
  const announcementItems = [
    "Admissions open for Academic Year 2027–28",
    "Discover our campus — book a school tour",
    "A world of learning, creativity & discovery"
  ];
  let announcementIndex = 0, announcementTimer, announcementStart = 0;
  let remaining = 5000, paused = false;

  function startAnnouncement() {
    if (!announcementMessage || !announcementProgress || paused) return;
    clearTimeout(announcementTimer);
    announcementProgress.style.transition = "none";
    announcementProgress.style.width = "0";
    void announcementProgress.offsetWidth;
    announcementProgress.style.transition = `width ${remaining}ms linear`;
    announcementProgress.style.width = "100%";
    announcementStart = Date.now();
    announcementTimer = setTimeout(() => {
      announcementMessage.style.opacity = "0";
      announcementMessage.style.transform = "translateY(5px)";
      setTimeout(() => {
        announcementIndex = (announcementIndex + 1) % announcementItems.length;
        announcementMessage.textContent = announcementItems[announcementIndex];
        announcementMessage.style.opacity = "1";
        announcementMessage.style.transform = "translateY(0)";
        remaining = 5000;
        startAnnouncement();
      }, 220);
    }, remaining);
  }
  function pauseAnnouncement() {
    if (paused) return;
    paused = true;
    clearTimeout(announcementTimer);
    remaining = Math.max(0, remaining - (Date.now() - announcementStart));
    const track = announcementProgress?.parentElement;
    const width = track?.getBoundingClientRect().width || 1;
    const current = announcementProgress?.getBoundingClientRect().width || 0;
    if (announcementProgress) {
      announcementProgress.style.transition = "none";
      announcementProgress.style.width = `${current / width * 100}%`;
    }
  }
  function resumeAnnouncement() {
    if (!paused) return;
    paused = false;
    if (remaining <= 0) {
      announcementIndex = (announcementIndex + 1) % announcementItems.length;
      announcementMessage.textContent = announcementItems[announcementIndex];
      remaining = 5000;
    }
    startAnnouncement();
  }
  if (announcementBar) {
    startAnnouncement();
    announcementBar.addEventListener("mouseenter", pauseAnnouncement);
    announcementBar.addEventListener("mouseleave", resumeAnnouncement);
    announcementBar.addEventListener("focusin", pauseAnnouncement);
    announcementBar.addEventListener("focusout", resumeAnnouncement);
    document.addEventListener("visibilitychange", () => document.hidden ? pauseAnnouncement() : resumeAnnouncement());
  }

  // Mobile navigation
  const menuToggle = $("#menuToggle"), navMenu = $("#navMenu");
  function closeMenu() {
    navMenu?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open menu");
    if (menuToggle) menuToggle.classList.remove("active");
  }
  menuToggle?.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuToggle.classList.toggle("active", open);
  });
  $$(".nav-link, .nav-cta", navMenu || document).forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("click", e => {
    if (navMenu && menuToggle && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  window.addEventListener("resize", () => { if (innerWidth > 560) closeMenu(); });

  // Header shadow + rocket
  const header = $("#siteHeader"), rocket = $("#rocketButton");
  function scrollUI() {
    header?.classList.toggle("scrolled", window.scrollY > 25);
    rocket?.classList.toggle("visible", window.scrollY > 400);
  }
  window.addEventListener("scroll", scrollUI, { passive: true });
  scrollUI();
  rocket?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Reveal animations
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => revealObserver.observe(el));
  } else revealItems.forEach(el => el.classList.add("visible"));

  // Animated statistics
  const counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target, target = Number(el.dataset.count), suffix = el.dataset.suffix || "";
        const duration = 1500, start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => counterObserver.observe(el));
  }

  // Campus interactive pins
  const campusPlaces = [
    { id: "building", number: "01", title: "A place to learn", description: "Bright, welcoming learning spaces designed to encourage questions, collaboration and discovery.", fact: "Thoughtful spaces for curious minds" },
    { id: "playground", number: "02", title: "Room to play", description: "Open spaces where movement, teamwork and joyful play can be part of every school day.", fact: "Play, movement and team spirit" },
    { id: "library", number: "03", title: "Stories live here", description: "A welcoming corner for reading, imagination, research and finding a new favourite book.", fact: "A new adventure on every shelf" },
    { id: "garden", number: "04", title: "A little greener", description: "Outdoor spaces invite learners to notice nature, care for living things and explore the world around them.", fact: "Growing curiosity in the outdoors" }
  ];
  let campusIndex = 0;
  function showCampus(index) {
    campusIndex = (index + campusPlaces.length) % campusPlaces.length;
    const place = campusPlaces[campusIndex];
    $("#campusNumber").textContent = place.number;
    $("#campusTitle").textContent = place.title;
    $("#campusDescription").textContent = place.description;
    $("#campusFact").textContent = place.fact;
    $$(".campus-pin").forEach(pin => pin.classList.toggle("active", pin.dataset.place === place.id));
  }
  $$(".campus-pin").forEach(pin => pin.addEventListener("click", () => {
    const index = campusPlaces.findIndex(place => place.id === pin.dataset.place);
    if (index >= 0) showCampus(index);
  }));
  $("#campusPrev")?.addEventListener("click", () => showCampus(campusIndex - 1));
  $("#campusNext")?.addEventListener("click", () => showCampus(campusIndex + 1));

  // Leadership tabs
  const leaders = [
    {
      name: "Our School Leadership", role: "AURELIA INTERNATIONAL SCHOOL",
      message: "At Aurelia, leadership begins with listening. We believe children thrive when families and educators work together with care, clarity and a shared sense of purpose.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85"
    },
    {
      name: "Our Principal", role: "SCHOOL PRINCIPAL",
      message: "A meaningful school experience is built on trust, thoughtful teaching and the belief that every learner has something wonderful to contribute.",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=900&q=85"
    },
    {
      name: "Our Educators", role: "THE AURELIA TEAM",
      message: "Our educators aim to make learning engaging, supportive and full of possibility — helping children feel confident enough to ask, try and grow.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85"
    }
  ];
  $$(".leader-tab").forEach(tab => tab.addEventListener("click", () => {
    const leader = leaders[Number(tab.dataset.leader)];
    if (!leader) return;
    $("#leaderName").textContent = leader.name;
    $("#leaderRole").textContent = leader.role;
    $("#leaderMessage").textContent = leader.message;
    $("#leaderImage").src = leader.image;
    $$(".leader-tab").forEach(item => item.classList.toggle("active", item === tab));
  }));

  // FAQ accordion
  $$(".faq-question").forEach(button => button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const wasOpen = item.classList.contains("open");
    $$(".faq-item").forEach(other => {
      other.classList.remove("open");
      other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      other.querySelector(".faq-question span").textContent = "+";
    });
    if (!wasOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      button.querySelector("span").textContent = "−";
    }
  }));

  // Cultural gallery filters
  $$(".filter-button").forEach(button => button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    $$(".filter-button").forEach(item => item.classList.toggle("active", item === button));
    $$(".culture-card").forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !show);
    });
  }));

  // Contact form demo validation — no data is sent or stored
  $("#contactForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const message = $("#formMessage");
    if (!form.reportValidity()) return;
    message.textContent = "Thank you! This demo form is working. Connect a form service to receive real enquiries.";
    message.style.color = "#27834c";
    form.reset();
  });

  // Rule-based chatbot demo
  const chatWindow = $("#chatWindow"), chatToggle = $("#chatToggle");
  const chatMessages = $("#chatMessages"), chatInput = $("#chatInput");
  function toggleChat(open) {
    chatWindow?.classList.toggle("open", open);
    chatWindow?.setAttribute("aria-hidden", String(!open));
    chatToggle?.setAttribute("aria-expanded", String(open));
    if (open) setTimeout(() => chatInput?.focus(), 150);
  }
  chatToggle?.addEventListener("click", () => toggleChat(!chatWindow.classList.contains("open")));
  $("#chatClose")?.addEventListener("click", () => toggleChat(false));
  function addChatMessage(text, type) {
    const div = document.createElement("div");
    div.className = type === "user" ? "user-message" : "bot-message";
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function getReply(question) {
    const q = question.toLowerCase();
    if (/admission|apply|application|enrol/.test(q)) return "To begin, send an enquiry using our contact form. The admissions team can explain eligibility, documents and current availability.";
    if (/facility|facilities|sport|music|art|robot|library/.test(q)) return "Our activity areas are designed around creative arts, music, sports, STEM, science, reading, nature and technology. Contact the school for current facilities and programmes.";
    if (/visit|tour|campus|location|address/.test(q)) return "We'd love to welcome you! Please use the contact form to request a campus visit and confirm the school's address.";
    if (/grade|class|age|year/.test(q)) return "The learning journey section gives an illustrative overview. Please contact the school to confirm current grades and age eligibility.";
    if (/fee|fees|cost|price/.test(q)) return "Please contact the school office directly for the latest fee structure. We don't want to give you outdated information.";
    if (/time|hour|timing|transport|bus/.test(q)) return "Please contact the school office for confirmed timings and transport routes.";
    if (/hello|hi|hey|good morning/.test(q)) return "Hello! 👋 Welcome to Aurelia. What would you like to know about our school?";
    if (/thank/.test(q)) return "You're very welcome! Happy to help. ✳";
    return "Thanks for your question! Our school team can help with the most accurate details. Please send us a message through the contact form.";
  }
  function sendChat(text) {
    const clean = text.trim();
    if (!clean) return;
    addChatMessage(clean, "user");
    chatInput.value = "";
    setTimeout(() => addChatMessage(getReply(clean), "bot"), 350);
  }
  $("#chatForm")?.addEventListener("submit", event => {
    event.preventDefault();
    sendChat(chatInput.value);
  });
  $$(".chat-suggestions button").forEach(button => button.addEventListener("click", () => sendChat(button.dataset.question)));

  // Keep current nav item in sync with visible section
  const sections = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$(".nav-link").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => navObserver.observe(section));
  }
});
