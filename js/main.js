/* =========================================
   NAVBAR ELEMENTS
========================================= */

const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

/* =========================================
   MOBILE MENU
========================================= */

function openMenu() {
  navMenu.classList.add("show");
  menuToggle.classList.add("active");

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation menu");
}

function closeMenu() {
  navMenu.classList.remove("show");
  menuToggle.classList.remove("active");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.contains("show");

  isOpen ? closeMenu() : openMenu();
});

/* =========================================
   CLOSE MENU AFTER NAVIGATION
========================================= */

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* =========================================
   CLOSE MENU ON OUTSIDE CLICK
========================================= */

document.addEventListener("click", (event) => {
  const clickedInside =
    navMenu.contains(event.target) || menuToggle.contains(event.target);

  if (!clickedInside) {
    closeMenu();
  }
});

/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    menuToggle.focus();
  }
});

/* =========================================
   STICKY HEADER SCROLL EFFECT
========================================= */

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 30);
}

window.addEventListener("scroll", updateHeader, { passive: true });

updateHeader();

/* =========================================
   ACTIVE NAVIGATION ON SCROLL
========================================= */

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const currentId = entry.target.id;

        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${currentId}`;

          link.classList.toggle("active", isActive);
        });
      });
    },

    {
      rootMargin: "-20% 0px -65% 0px",
    },
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* =========================================
   RESPONSIVE MENU RESET
========================================= */

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMenu();
  }
});

/* =========================================
   ANNOUNCEMENT TICKER
========================================= */

const announcements = [
  {
    icon: "megaphone",
    message: "Admissions Open for Academic Year 2027–28",
    link: "Explore Admissions",
    href: "#admissions",
    background: "#F7E9B9",
    color: "#745C32",
    progress: "#A98543",
  },

  {
    icon: "calendar-days",
    message: "Discover Our Campus — Book a School Tour",
    link: "Book Your Visit",
    href: "#contact",
    background: "#D9EBDD",
    color: "#426F55",
    progress: "#5C9873",
  },

  {
    icon: "sparkles",
    message: "A World of Learning, Creativity & Discovery",
    link: "Explore Campus Life",
    href: "#campus",
    background: "#E9DDF5",
    color: "#705C91",
    progress: "#9276BC",
  },
];

const announcementBar = document.getElementById("announcementBar");

const announcementIcon = document.getElementById("announcementIcon");

const announcementMessage = document.getElementById("announcementMessage");

const announcementLink = document.getElementById("announcementLink");

const announcementProgress = document.getElementById("announcementProgress");

const announcementItem = document.querySelector(".announcement-item");

/* =========================================
   TICKER SETTINGS
========================================= */

const NOTICE_DURATION = 10000;

let currentNotice = 0;
let noticeTimer = null;
let tickerPaused = false;

/* =========================================
   RENDER NOTICE
========================================= */

function renderNotice(index) {
  const notice = announcements[index];

  announcementBar.style.setProperty("--notice-bg", notice.background);

  announcementBar.style.setProperty("--notice-color", notice.color);

  announcementBar.style.setProperty("--notice-progress", notice.progress);

  announcementMessage.textContent = notice.message;

  announcementLink.textContent = notice.link;
  announcementLink.href = notice.href;

  /* Create link arrow */

  const arrow = document.createElement("i");

  arrow.setAttribute("data-lucide", "arrow-up-right");

  announcementLink.appendChild(arrow);

  /* Update announcement icon */

  announcementIcon.replaceChildren();

  const icon = document.createElement("i");

  icon.setAttribute("data-lucide", notice.icon);

  announcementIcon.appendChild(icon);

  /* Refresh Lucide icons */

  if (window.lucide) {
    lucide.createIcons();
  }

  /* Restart content animation */

  announcementItem.style.animation = "none";

  void announcementItem.offsetWidth;

  announcementItem.style.animation = "";

  /* Restart progress animation */

  announcementProgress.classList.remove("running");

  void announcementProgress.offsetWidth;

  if (!tickerPaused) {
    announcementProgress.classList.add("running");
  }
}

/* =========================================
   START TICKER
========================================= */

function startTicker() {
  if (tickerPaused || noticeTimer) return;

  announcementProgress.classList.remove("running");

  void announcementProgress.offsetWidth;

  announcementProgress.classList.add("running");

  noticeTimer = setTimeout(() => {
    currentNotice = (currentNotice + 1) % announcements.length;

    renderNotice(currentNotice);

    noticeTimer = null;

    startTicker();
  }, NOTICE_DURATION);
}

/* =========================================
   PAUSE TICKER
========================================= */

function pauseTicker() {
  tickerPaused = true;

  clearTimeout(noticeTimer);

  noticeTimer = null;

  announcementProgress.style.animationPlayState = "paused";
}

/* =========================================
   RESUME TICKER
========================================= */

function resumeTicker() {
  if (!tickerPaused) return;

  tickerPaused = false;

  announcementProgress.style.animationPlayState = "running";

  startTicker();
}

/* =========================================
   TICKER INTERACTIONS
========================================= */

announcementBar.addEventListener("mouseenter", pauseTicker);

announcementBar.addEventListener("mouseleave", resumeTicker);

announcementBar.addEventListener("focusin", pauseTicker);

announcementBar.addEventListener("focusout", (event) => {
  if (!announcementBar.contains(event.relatedTarget)) {
    resumeTicker();
  }
});

/* =========================================
   PAUSE WHEN TAB IS HIDDEN
========================================= */

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseTicker();
  } else {
    resumeTicker();
  }
});

/* =========================================
   INITIALIZE
========================================= */

if (window.lucide) {
  lucide.createIcons();
}

renderNotice(currentNotice);
startTicker();

/* =========================================
   STATISTICS COUNT-UP ANIMATION
========================================= */

function initStatistics() {
  const statsSection = document.querySelector(".stats-section");
  const statCards = document.querySelectorAll(".stat-card");
  const counters = document.querySelectorAll(".stat-number .counter");

  if (!statsSection || !statCards.length || !counters.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";

    if (!Number.isFinite(target)) return;

    if (prefersReducedMotion) {
      counter.textContent = target.toLocaleString("en-IN") + suffix;
      return;
    }

    const duration = 1600;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      const currentValue = Math.floor(target * easedProgress);

      counter.textContent = currentValue.toLocaleString("en-IN") + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString("en-IN") + suffix;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  function revealStatistics() {
    statCards.forEach((card) => {
      card.classList.add("is-visible");
    });

    counters.forEach(animateCounter);
  }

  if (!("IntersectionObserver" in window)) {
    revealStatistics();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealStatistics();
          observer.disconnect();
        }
      });
    },
    {
      threshold: 0.25,
    },
  );

  observer.observe(statsSection);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStatistics);
} else {
  initStatistics();
}

/* =====================================================
   EXPLORE OUR CAMPUS - INTERACTIVE MAP
===================================================== */

const campusLocations = [
  {
    title: "Academic Building",
    category: "LEARNING SPACES",
    description:
      "A welcoming learning environment where young minds explore new ideas, develop their skills and grow with confidence.",
    area: "25,000 sq. ft.",
    capacity: "600 Students",
    features: ["Smart Classrooms", "Digital Learning", "Interactive Spaces"],
  },
  {
    title: "Sports Ground",
    category: "SPORTS & FITNESS",
    description:
      "A spacious outdoor sports area where students build teamwork, confidence and healthy habits through physical activities.",
    area: "18,000 sq. ft.",
    capacity: "200 Students",
    features: ["Football", "Athletics", "Outdoor Games"],
  },
  {
    title: "Library",
    category: "READING & DISCOVERY",
    description:
      "A peaceful and inspiring reading space filled with stories, knowledge and resources that encourage a lifelong love of learning.",
    area: "3,500 sq. ft.",
    capacity: "80 Students",
    features: ["Story Books", "Reading Corners", "Digital Resources"],
  },
  {
    title: "Science Laboratories",
    category: "EXPERIMENT & EXPLORE",
    description:
      "Purpose-designed spaces where students learn by experimenting, observing and discovering how the world around them works.",
    area: "4,000 sq. ft.",
    capacity: "60 Students",
    features: ["Physics Lab", "Chemistry Lab", "Biology Lab"],
  },
  {
    title: "Art & Music Rooms",
    category: "CREATIVITY & EXPRESSION",
    description:
      "Creative spaces where students express themselves through painting, music, dance and hands-on artistic activities.",
    area: "2,800 sq. ft.",
    capacity: "70 Students",
    features: ["Painting Studio", "Music Room", "Dance Space"],
  },
  {
    title: "Playground",
    category: "PLAY & GROW",
    description:
      "A cheerful and engaging play area where children develop coordination, imagination and friendships through play.",
    area: "5,000 sq. ft.",
    capacity: "100 Students",
    features: ["Play Equipment", "Open Play", "Activity Zone"],
  },
  {
    title: "Cafeteria",
    category: "FOOD & WELLBEING",
    description:
      "A comfortable dining space designed for students to enjoy meals, connect with friends and develop healthy eating habits.",
    area: "2,200 sq. ft.",
    capacity: "120 Students",
    features: ["Dining Area", "Clean Facilities", "Seating Zones"],
  },
  {
    title: "Garden & Open Spaces",
    category: "NATURE & WELLBEING",
    description:
      "Green outdoor spaces that bring students closer to nature and provide opportunities for relaxation and outdoor learning.",
    area: "8,000 sq. ft.",
    capacity: "150 Students",
    features: ["Green Gardens", "Nature Walks", "Outdoor Learning"],
  },
];

const campusHotspots = document.querySelectorAll(".campus-hotspot");

const campusTitle = document.getElementById("campusTitle");
const campusCategory = document.getElementById("campusCategory");
const campusDescription = document.getElementById("campusDescription");
const campusArea = document.getElementById("campusArea");
const campusCapacity = document.getElementById("campusCapacity");
const campusNumber = document.getElementById("campusNumber");
const campusFeatures = document.getElementById("campusFeatures");
const campusProgress = document.getElementById("campusProgress");

const campusPrev = document.getElementById("campusPrev");
const campusNext = document.getElementById("campusNext");

let activeCampusLocation = 0;

/* UPDATE INFORMATION */

function updateCampusLocation(index) {
  if (index < 0 || index >= campusLocations.length) return;

  activeCampusLocation = index;

  const location = campusLocations[index];

  // Update text
  campusTitle.textContent = location.title;
  campusCategory.textContent = location.category;
  campusDescription.textContent = location.description;
  campusArea.textContent = location.area;
  campusCapacity.textContent = location.capacity;
  campusNumber.textContent = `${String(index + 1).padStart(2, "0")} / ${String(campusLocations.length).padStart(2, "0")}`;

  // Update features
  campusFeatures.innerHTML = "";

  location.features.forEach((feature) => {
    const featureTag = document.createElement("span");

    featureTag.textContent = feature;

    campusFeatures.appendChild(featureTag);
  });

  // Update active hotspot
  campusHotspots.forEach((hotspot, i) => {
    hotspot.classList.toggle("active", i === index);
  });

  // Update progress
  const progressDots = campusProgress.querySelectorAll("span");

  progressDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  // Replay information animation
  const infoContent = document.getElementById("campusInfo");

  infoContent.style.animation = "none";

  void infoContent.offsetWidth;

  infoContent.style.animation = "campusFade 0.35s ease";
}

/* HOTSPOT CLICK */

campusHotspots.forEach((hotspot) => {
  hotspot.addEventListener("click", () => {
    const index = Number(hotspot.dataset.location);

    updateCampusLocation(index);
  });
});

/* PREVIOUS LOCATION */

campusPrev.addEventListener("click", () => {
  const nextIndex =
    (activeCampusLocation - 1 + campusLocations.length) %
    campusLocations.length;

  updateCampusLocation(nextIndex);
});

/* NEXT LOCATION */

campusNext.addEventListener("click", () => {
  const nextIndex = (activeCampusLocation + 1) % campusLocations.length;

  updateCampusLocation(nextIndex);
});

/* INITIAL LOCATION */

updateCampusLocation(0);

/* =====================================================
   LEADERSHIP MESSAGE INTERACTION
===================================================== */

const leaders = [
  {
    role: "OUR FOUNDING VISION",
    title: "Education is not just about learning. It's about becoming.",
    description:
      "At Aurelia International School, we believe every child carries extraordinary potential. Our vision is to create an environment where curiosity is encouraged, individuality is celebrated and every learner feels inspired to achieve more.",
    extra:
      "Together, let us nurture confident minds, compassionate hearts and responsible global citizens.",
    name: "Founder Name",
    designation: "Founder & Chairperson",
    signature: "A. Founder",
  },

  {
    role: "A MESSAGE FROM OUR PRINCIPAL",
    title: "Every child deserves the opportunity to shine.",
    description:
      "Education is a journey of discovery, growth and meaningful experiences. At Aurelia, our focus is on creating a supportive environment where every student feels valued, challenged and motivated to reach their fullest potential.",
    extra:
      "We are committed to making every school day a step towards a brighter and more confident future.",
    name: "Principal Name",
    designation: "Principal",
    signature: "P. Principal",
  },

  {
    role: "A MESSAGE FROM OUR VICE PRINCIPAL",
    title: "Small steps today create extraordinary futures.",
    description:
      "We believe that learning extends far beyond textbooks. Through encouragement, creativity, discipline and collaboration, we help students build the skills and values they need to navigate the world with confidence.",
    extra:
      "Our promise is to make every child's learning experience meaningful, joyful and full of possibilities.",
    name: "Vice Principal Name",
    designation: "Vice Principal",
    signature: "V. Principal",
  },
];

const leaderTabs = document.querySelectorAll(".leader-tab");
const leaderPhotos = document.querySelectorAll("[data-leader-photo]");

const leaderRole = document.getElementById("leaderRole");
const leaderTitle = document.getElementById("leaderTitle");
const leaderDescription = document.getElementById("leaderDescription");
const leaderExtra = document.getElementById("leaderExtra");
const leaderName = document.getElementById("leaderName");
const leaderDesignation = document.getElementById("leaderDesignation");
const leaderSignature = document.getElementById("leaderSignature");
const leaderIndex = document.getElementById("leaderIndex");

const leaderMessage = document.getElementById("leaderMessage");

const leaderPrev = document.getElementById("leaderPrev");
const leaderNext = document.getElementById("leaderNext");

let activeLeader = 0;

/* CHANGE LEADER */

function showLeader(index) {
  if (index < 0 || index >= leaders.length) return;

  activeLeader = index;

  const leader = leaders[index];

  // Update message
  leaderRole.textContent = leader.role;
  leaderTitle.textContent = leader.title;
  leaderDescription.textContent = leader.description;
  leaderExtra.textContent = leader.extra;
  leaderName.textContent = leader.name;
  leaderDesignation.textContent = leader.designation;
  leaderSignature.textContent = leader.signature;

  leaderIndex.textContent = `${String(index + 1).padStart(2, "0")} / 03`;

  // Update tabs
  leaderTabs.forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
  });

  // Update main portrait
  leaderPhotos.forEach((photo, i) => {
    photo.classList.toggle("active", i === index);
  });

  // Re-run message animation
  leaderMessage.style.animation = "none";
  void leaderMessage.offsetWidth;
  leaderMessage.style.animation = "leaderMessageReveal 0.45s ease";
}

/* TAB CLICK */

leaderTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    showLeader(index);
  });
});

/* PORTRAIT CLICK */

leaderPhotos.forEach((photo) => {
  photo.addEventListener("click", () => {
    const index = Number(photo.dataset.leaderPhoto);

    showLeader(index);
  });
});

/* PREVIOUS */

leaderPrev.addEventListener("click", () => {
  const index = (activeLeader - 1 + leaders.length) % leaders.length;

  showLeader(index);
});

/* NEXT */

leaderNext.addEventListener("click", () => {
  const index = (activeLeader + 1) % leaders.length;

  showLeader(index);
});

/* DEFAULT */

showLeader(0);

/* =========================================================
   FAQ ACCORDION
========================================================= */

document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    // Close all FAQ items
    document.querySelectorAll(".faq-item").forEach((faq) => {
      faq.classList.remove("active");
      faq.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    // Open clicked item if it was previously closed
    if (!isActive) {
      item.classList.add("active");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

/* =========================================================
   CONTACT FORM
========================================================= */

const schoolContactForm = document.getElementById("schoolContactForm");

if (schoolContactForm) {
  schoolContactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const messageBox = document.getElementById("contactFormMessage");

    if (!schoolContactForm.checkValidity()) {
      schoolContactForm.reportValidity();
      return;
    }

    const formData = new FormData(schoolContactForm);

    const parentName = formData.get("parentName");

    messageBox.textContent = `Thank you, ${parentName}! Your form is valid. Please connect a form service to submit your enquiry to the school.`;

    messageBox.className = "contact-form-message success";

    schoolContactForm.reset();
  });
}

/* =====================================================
   FOOTER YEAR
===================================================== */

const footerYear = document.getElementById("footerYear");

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

/* =====================================================
   ROCKET BACK TO TOP INTERACTION
===================================================== */

const rocketButton = document.getElementById("rocketBackTop");

if (rocketButton) {
  let rocketLaunching = false;

  // Show rocket after scrolling
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 350 && !rocketLaunching) {
        rocketButton.classList.add("visible");
      } else if (window.scrollY <= 350 && !rocketLaunching) {
        rocketButton.classList.remove("visible");
      }
    },
    { passive: true },
  );

  // Launch rocket
  rocketButton.addEventListener("click", () => {
    if (rocketLaunching) return;

    rocketLaunching = true;

    rocketButton.classList.add("visible", "launching");

    // Scroll page to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Reset rocket after launch animation
    setTimeout(() => {
      rocketButton.classList.remove("launching");

      rocketButton.classList.remove("visible");

      // Allow the next launch
      rocketLaunching = false;

      if (window.scrollY > 350) {
        rocketButton.classList.add("visible");
      }
    }, 1700);
  });
}

/* =========================================================
   CULTURE GALLERY FILTER
========================================================= */

const cultureFilters = document.querySelectorAll(".culture-filter");
const cultureItems = document.querySelectorAll(".culture-gallery-item");
const cultureGalleryCount = document.querySelector(".culture-gallery-count");

if (cultureFilters.length && cultureItems.length) {
  function filterCultureGallery(selectedCategory) {
    let visibleCount = 0;

    cultureItems.forEach((item) => {
      const itemCategory = item.dataset.category;

      const shouldShow =
        selectedCategory === "all" || itemCategory === selectedCategory;

      item.classList.toggle("is-hidden", !shouldShow);

      if (shouldShow) {
        visibleCount++;
      }
    });

    if (cultureGalleryCount) {
      cultureGalleryCount.textContent = `${String(visibleCount).padStart(2, "0")} MOMENTS`;
    }

    cultureFilters.forEach((button) => {
      const isActive = button.dataset.filter === selectedCategory;

      button.classList.toggle("active", isActive);

      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  cultureFilters.forEach((button) => {
    button.addEventListener("click", () => {
      filterCultureGallery(button.dataset.filter);
    });
  });

  filterCultureGallery("all");
}

/* ==========================================
   PARENT LETTERS NAVIGATION
========================================== */

const parentLetters = document.querySelectorAll(".parent-letter");
const letterDots = document.querySelectorAll(".letter-dot");
const previousLetterButton = document.querySelector("[data-letter-prev]");
const nextLetterButton = document.querySelector("[data-letter-next]");

if (parentLetters.length && letterDots.length) {
  let currentLetterIndex = 0;

  function showParentLetter(index) {
    currentLetterIndex = (index + parentLetters.length) % parentLetters.length;

    parentLetters.forEach((letter, i) => {
      letter.classList.toggle("active", i === currentLetterIndex);

      const number = letter.querySelector(".letter-number");

      if (number) {
        number.textContent = `${String(i + 1).padStart(2, "0")} / ${String(parentLetters.length).padStart(2, "0")}`;
      }
    });

    letterDots.forEach((dot, i) => {
      const isActive = i === currentLetterIndex;

      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
  }

  previousLetterButton?.addEventListener("click", () => {
    showParentLetter(currentLetterIndex - 1);
  });

  nextLetterButton?.addEventListener("click", () => {
    showParentLetter(currentLetterIndex + 1);
  });

  letterDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showParentLetter(Number(dot.dataset.goTo));
    });
  });

  showParentLetter(0);
}



/* ==========================================
   AURELIA SMART SCHOOL CHATBOT
   Vanilla JavaScript - No Backend
========================================== */

(function () {

    const chatbotToggle = document.getElementById("chatbotToggle");
    const chatbotWindow = document.getElementById("chatbotWindow");
    const chatbotClose = document.getElementById("chatbotClose");
    const chatbotRestart = document.getElementById("chatbotRestart");
    const chatbotMessages = document.getElementById("chatbotMessages");
    const chatbotForm = document.getElementById("chatbotForm");
    const chatbotInput = document.getElementById("chatbotInput");
    const chatbotSuggestions = document.getElementById("chatbotSuggestions");

    if (
        !chatbotToggle ||
        !chatbotWindow ||
        !chatbotMessages ||
        !chatbotForm ||
        !chatbotInput
    ) {
        return;
    }


    /* ==========================================
       1. SCHOOL INFORMATION
       Update these values with real information.
    ========================================== */

    const schoolInfo = {

        name: "Aurelia International School",

        admissionYear: "2027–28",

        phone: "+91 00000 00000",

        email: "hello@aurelia.edu",

        address: "Your School Address, Your City, Your State, India",

        officeHours: "Monday to Saturday, 9:00 AM to 4:00 PM",

        grades: "Early Years, Primary Years, Middle Years and Senior Years",

        ageCriteria: "Please contact our admissions team for the current age criteria.",

        fees: "Our fee structure depends on the grade and applicable school charges. Please contact our admissions team for accurate and updated details.",

        curriculum: "Aurelia focuses on meaningful learning, curiosity, creativity, communication and the overall development of every child. Please contact the school for the confirmed curriculum details.",

        transport: "Please contact our school office to check transport availability, routes and related charges.",

        timings: "Please contact the school office for the confirmed class-wise school timings."

    };


    /* ==========================================
       2. CHATBOT STATE
    ========================================== */

    let isChatOpen = false;
    let isReplying = false;


    /* ==========================================
       3. CHAT HELPERS
    ========================================== */

    function getCurrentTime() {

        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    }


    function scrollChatToBottom() {

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    }


    function createChatMessage(message, sender, link = null) {

        const messageRow = document.createElement("div");

        messageRow.className = `chat-message ${sender}`;

        if (sender === "bot") {

            const avatar = document.createElement("div");

            avatar.className = "chat-message-avatar";

            const icon = document.createElement("i");

            icon.setAttribute("data-lucide", "graduation-cap");

            avatar.appendChild(icon);

            messageRow.appendChild(avatar);

        }

        const content = document.createElement("div");

        content.className = "chat-message-content";

        const bubble = document.createElement("div");

        bubble.className = "chat-message-bubble";

        // Use textContent to prevent HTML injection.
        bubble.textContent = message;

        content.appendChild(bubble);


        // Optional internal website link.
        if (link && sender === "bot") {

            const linkElement = document.createElement("a");

            linkElement.className = "chatbot-link";

            linkElement.href = link.url;

            linkElement.textContent = link.label + " →";

            content.appendChild(linkElement);

        }


        const time = document.createElement("span");

        time.className = "chat-message-time";

        time.textContent = getCurrentTime();

        content.appendChild(time);

        messageRow.appendChild(content);

        chatbotMessages.appendChild(messageRow);

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

        scrollChatToBottom();

    }


    function showTypingIndicator() {

        const typingRow = document.createElement("div");

        typingRow.className = "chat-message bot";

        typingRow.id = "chatbotTyping";

        const avatar = document.createElement("div");

        avatar.className = "chat-message-avatar";

        const icon = document.createElement("i");

        icon.setAttribute("data-lucide", "graduation-cap");

        avatar.appendChild(icon);

        const typing = document.createElement("div");

        typing.className = "chat-typing";

        typing.innerHTML = "<span></span><span></span><span></span>";

        typingRow.appendChild(avatar);

        typingRow.appendChild(typing);

        chatbotMessages.appendChild(typingRow);

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

        scrollChatToBottom();

    }


    function removeTypingIndicator() {

        const typing = document.getElementById("chatbotTyping");

        if (typing) {
            typing.remove();
        }

    }


    /* ==========================================
       4. SCHOOL QUESTION RESPONSE ENGINE
    ========================================== */

    function getBotResponse(rawMessage) {

        const message = rawMessage
            .toLowerCase()
            .replace(/[^\w\s₹]/g, " ")
            .replace(/\s+/g, " ")
            .trim();


        // Greetings
        if (
            /^(hi|hello|hey|hii|hiii|good morning|good afternoon|good evening|namaste|namaskar)$/.test(message)
        ) {

            return {
                text: "Hello! 👋 Welcome to Aurelia International School! I'm your school assistant. I can help you with admissions, classes, facilities, school timings and much more. What would you like to know?"
            };

        }


        // Thanks
        if (
            /\b(thank you|thanks|thank u|thx)\b/.test(message)
        ) {

            return {
                text: "You're most welcome! 😊 We're always happy to help. Would you like to know anything else about Aurelia?"
            };

        }


        // Goodbye
        if (
            /\b(bye|goodbye|see you|talk later)\b/.test(message)
        ) {

            return {
                text: "Thank you for visiting Aurelia International School! Have a wonderful day. We hope to welcome you to our campus soon. 💚"
            };

        }


        // Admissions
        if (
            /\b(admission|admissions|admit|enrol|enroll|enrollment|apply|application|joining|join school|new admission)\b/.test(message)
        ) {

            return {
                text: `We're excited that you're considering Aurelia! 🎓 Admissions are open for the ${schoolInfo.admissionYear} academic year. You can begin by submitting an enquiry, visiting our campus and completing the application process. Our admissions team can guide you through the next steps.`,
                link: {
                    label: "Explore admissions",
                    url: "#admissions"
                }
            };

        }


        // Admission year
        if (
            /\b(academic year|admission year|2027|2028)\b/.test(message)
        ) {

            return {
                text: `Our displayed admission year is ${schoolInfo.admissionYear}. Please contact the school office to confirm current availability and application deadlines.`,
                link: {
                    label: "Contact our school",
                    url: "#contact"
                }
            };

        }


        // Fees
        if (
            /\b(fee|fees|tuition|payment|charges|cost|price|scholarship)\b/.test(message)
        ) {

            return {
                text: schoolInfo.fees,
                link: {
                    label: "Ask about school fees",
                    url: "#contact"
                }
            };

        }


        // Age criteria
        if (
            /\b(age|ages|age limit|age criteria|minimum age|child age|how old)\b/.test(message)
        ) {

            return {
                text: schoolInfo.ageCriteria,
                link: {
                    label: "Contact admissions",
                    url: "#contact"
                }
            };

        }


        // Grades and classes
        if (
            /\b(classes|class|grade|grades|standard|standards|early years|primary|middle school|senior years|nursery|kindergarten|kg|pre primary)\b/.test(message)
        ) {

            return {
                text: `We organise our learning journey into ${schoolInfo.grades}. Each stage supports children's learning and development at different ages.`,
                link: {
                    label: "Explore learning journey",
                    url: "#learning-journey"
                }
            };

        }


        // Facilities
        if (
            /\b(facility|facilities|library|lab|laboratory|playground|ground|sports|music|dance|art|robotics|science|computer|technology|classroom)\b/.test(message)
        ) {

            return {
                text: "Aurelia's planned learning experiences include Art & Craft, Music & Dance, Sports & Games, Robotics & STEM, Science, Reading, Nature and Technology. Explore the different activities and learning spaces on our website!",
                link: {
                    label: "Explore our facilities",
                    url: "#facilities"
                }
            };

        }


        // Campus visit
        if (
            /\b(campus visit|visit|school visit|tour|school tour|see school|location visit)\b/.test(message)
        ) {

            return {
                text: "We'd love to welcome you to our campus! 😊 You can send us an enquiry to arrange a visit. Our team can help you with a suitable time.",
                link: {
                    label: "Book a campus enquiry",
                    url: "#contact"
                }
            };

        }


        // Location and address
        if (
            /\b(location|address|where is|where are|directions|map|reach school|school situated)\b/.test(message)
        ) {

            return {
                text: `You can find our school at: ${schoolInfo.address}. Please confirm the address with the school office before travelling.`,
                link: {
                    label: "View contact details",
                    url: "#contact"
                }
            };

        }


        // School timings
        if (
            /\b(timing|timings|school time|school hours|opening time|closing time|when does school start|when does school end)\b/.test(message)
        ) {

            return {
                text: schoolInfo.timings,
                link: {
                    label: "Contact school office",
                    url: "#contact"
                }
            };

        }


        // Office hours
        if (
            /\b(office hours|working hours|office timing|when is office open)\b/.test(message)
        ) {

            return {
                text: `Our displayed office hours are ${schoolInfo.officeHours}. Please confirm the latest schedule with the school office.`
            };

        }


        // Transport
        if (
            /\b(transport|bus|school bus|pickup|pick up|drop|van|bus route)\b/.test(message)
        ) {

            return {
                text: schoolInfo.transport,
                link: {
                    label: "Ask about transport",
                    url: "#contact"
                }
            };

        }


        // Curriculum
        if (
            /\b(curriculum|teaching|education|learning method|syllabus|subjects|academics)\b/.test(message)
        ) {

            return {
                text: schoolInfo.curriculum,
                link: {
                    label: "Explore our school",
                    url: "#about"
                }
            };

        }


        // Events and celebrations
        if (
            /\b(events|event|festival|celebration|annual day|competition|activities|function)\b/.test(message)
        ) {

            return {
                text: "School life is full of opportunities to learn, participate and celebrate! Explore our events and cultural celebrations to discover more.",
                link: {
                    label: "Explore school events",
                    url: "#events"
                }
            };

        }


        // Teachers and staff
        if (
            /\b(teacher|teachers|educator|educators|staff|principal|vice principal)\b/.test(message)
        ) {

            return {
                text: "Our school values caring guidance, encouragement and individual attention. You can learn more about the people and values behind Aurelia through our school information.",
                link: {
                    label: "Discover Aurelia",
                    url: "#about"
                }
            };

        }


        // Parents and testimonials
        if (
            /\b(parent|parents|review|reviews|testimonial|testimonials|feedback|experience)\b/.test(message)
        ) {

            return {
                text: "We believe a strong school community grows through trust and shared experiences. Visit our parent letters section to read the stories shared by our school community.",
                link: {
                    label: "Read parent letters",
                    url: "#parent-letters"
                }
            };

        }


        // Contact information
        if (
            /\b(contact|phone|mobile|number|email|mail|call|telephone)\b/.test(message)
        ) {

            return {
                text: `You can reach our school office at ${schoolInfo.phone} or email ${schoolInfo.email}.`,
                link: {
                    label: "Contact us",
                    url: "#contact"
                }
            };

        }


        // About the school
        if (
            /\b(about|aurelia|school|who are you|tell me about)\b/.test(message)
        ) {

            return {
                text: "Aurelia International School is designed around a welcoming learning environment where children can discover their strengths, build confidence and explore new possibilities. What would you like to know about our school?",
                link: {
                    label: "Discover our school",
                    url: "#about"
                }
            };

        }


        // Fallback
        return {
            text: "That's a good question! 😊 I don't have that specific information available right now. I can help with admissions, classes, fees, facilities, school timings, transport or campus visits. You can also contact our school team for more details.",
            link: {
                label: "Contact our school",
                url: "#contact"
            }
        };

    }


    /* ==========================================
       5. SEND AND RECEIVE MESSAGES
    ========================================== */

    function sendBotReply(message) {

        const response = getBotResponse(message);

        isReplying = true;

        chatbotInput.disabled = true;

        showTypingIndicator();

        // Simulate a natural short response delay.
        setTimeout(() => {

            removeTypingIndicator();

            createChatMessage(
                response.text,
                "bot",
                response.link || null
            );

            isReplying = false;

            chatbotInput.disabled = false;

            chatbotInput.focus();

        }, 650);

    }


    function sendUserMessage(message) {

        const cleanMessage = message.trim();

        if (!cleanMessage || isReplying) {
            return;
        }

        createChatMessage(cleanMessage, "user");

        chatbotInput.value = "";

        sendBotReply(cleanMessage);

    }


    /* ==========================================
       6. WELCOME MESSAGE
    ========================================== */

    function showWelcomeMessage() {

        chatbotMessages.innerHTML = "";

        createChatMessage(
            "Hello! 👋 Welcome to Aurelia International School. I'm your school assistant. How can I help you today?",
            "bot"
        );

    }


    showWelcomeMessage();


    /* ==========================================
       7. OPEN AND CLOSE CHAT
    ========================================== */

    function openChatbot() {

        isChatOpen = true;

        chatbotWindow.classList.add("open");

        chatbotToggle.classList.add("active");

        chatbotToggle.setAttribute("aria-expanded", "true");

        chatbotWindow.setAttribute("aria-hidden", "false");

        chatbotInput.focus();

    }


    function closeChatbot() {

        isChatOpen = false;

        chatbotWindow.classList.remove("open");

        chatbotToggle.classList.remove("active");

        chatbotToggle.setAttribute("aria-expanded", "false");

        chatbotWindow.setAttribute("aria-hidden", "true");

    }


    chatbotToggle.addEventListener("click", () => {

        if (isChatOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }

    });


    chatbotClose.addEventListener("click", closeChatbot);


    // Close with Escape.
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape" && isChatOpen) {
            closeChatbot();
        }

    });


    /* ==========================================
       8. FORM SUBMISSION
    ========================================== */

    chatbotForm.addEventListener("submit", (event) => {

        event.preventDefault();

        sendUserMessage(chatbotInput.value);

    });


    /* ==========================================
       9. QUICK QUESTION BUTTONS
    ========================================== */

    if (chatbotSuggestions) {

        chatbotSuggestions.querySelectorAll("[data-question]")
            .forEach((button) => {

                button.addEventListener("click", () => {

                    if (!isChatOpen) {
                        openChatbot();
                    }

                    sendUserMessage(button.dataset.question);

                });

            });

    }


    /* ==========================================
       10. RESTART CONVERSATION
    ========================================== */

    if (chatbotRestart) {

        chatbotRestart.addEventListener("click", () => {

            if (isReplying) {
                return;
            }

            showWelcomeMessage();

            chatbotInput.value = "";

            chatbotInput.focus();

        });

    }


})();
