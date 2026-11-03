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

navLinks.forEach(link => {

    link.addEventListener("click", closeMenu);

});


/* =========================================
   CLOSE MENU ON OUTSIDE CLICK
========================================= */

document.addEventListener("click", event => {

    const clickedInside =
        navMenu.contains(event.target) ||
        menuToggle.contains(event.target);

    if (!clickedInside) {
        closeMenu();
    }

});


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeMenu();
        menuToggle.focus();

    }

});


/* =========================================
   STICKY HEADER SCROLL EFFECT
========================================= */

function updateHeader() {

    header.classList.toggle(
        "scrolled",
        window.scrollY > 30
    );

}

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* =========================================
   ACTIVE NAVIGATION ON SCROLL
========================================= */

const sections = document.querySelectorAll(
    "main section[id]"
);

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const currentId = entry.target.id;

                navLinks.forEach(link => {

                    const isActive =
                        link.getAttribute("href") === `#${currentId}`;

                    link.classList.toggle("active", isActive);

                });

            });

        },

        {
            rootMargin: "-20% 0px -65% 0px"
        }

    );

    sections.forEach(section => {
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
        progress: "#A98543"
    },

    {
        icon: "calendar-days",
        message: "Discover Our Campus — Book a School Tour",
        link: "Book Your Visit",
        href: "#contact",
        background: "#D9EBDD",
        color: "#426F55",
        progress: "#5C9873"
    },

    {
        icon: "sparkles",
        message: "A World of Learning, Creativity & Discovery",
        link: "Explore Campus Life",
        href: "#campus",
        background: "#E9DDF5",
        color: "#705C91",
        progress: "#9276BC"
    }

];


const announcementBar =
    document.getElementById("announcementBar");

const announcementIcon =
    document.getElementById("announcementIcon");

const announcementMessage =
    document.getElementById("announcementMessage");

const announcementLink =
    document.getElementById("announcementLink");

const announcementProgress =
    document.getElementById("announcementProgress");

const announcementItem =
    document.querySelector(".announcement-item");


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

    announcementBar.style.setProperty(
        "--notice-bg",
        notice.background
    );

    announcementBar.style.setProperty(
        "--notice-color",
        notice.color
    );

    announcementBar.style.setProperty(
        "--notice-progress",
        notice.progress
    );

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

        currentNotice =
            (currentNotice + 1) % announcements.length;

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

announcementBar.addEventListener(
    "mouseenter",
    pauseTicker
);

announcementBar.addEventListener(
    "mouseleave",
    resumeTicker
);

announcementBar.addEventListener(
    "focusin",
    pauseTicker
);

announcementBar.addEventListener(
    "focusout",
    event => {

        if (!announcementBar.contains(event.relatedTarget)) {
            resumeTicker();
        }

    }
);


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
        "(prefers-reduced-motion: reduce)"
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

            const currentValue = Math.floor(
                target * easedProgress
            );

            counter.textContent =
                currentValue.toLocaleString("en-IN") + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent =
                    target.toLocaleString("en-IN") + suffix;
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
            threshold: 0.25
        }
    );

    observer.observe(statsSection);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStatistics);
} else {
    initStatistics();
}
