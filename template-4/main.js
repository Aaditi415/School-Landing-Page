

function initAnnouncement() {
    const bar = document.getElementById("announcementBar");
    const label = document.getElementById("announcementLabel");
    const track = document.getElementById("announcementTrack");
    const cta = document.getElementById("announcementCta");
    const progress = document.getElementById("announcementProgress");

    if (!bar || !label || !track || !cta || !progress) return;

    const announcements = [
        {
            label: "ADMISSIONS",
            message: "Admissions are now open for the 2027–28 academic year.",
            button: "Apply Now",
            link: "#admissions",
            color: "#FFB86B"
        },
        {
            label: "CAMPUS LIFE",
            message: "Discover a world of creativity, learning and opportunities.",
            button: "Explore Campus",
            link: "#facilities",
            color: "#78CDB5"
        },
        {
            label: "ACADEMICS",
            message: "Building knowledge, confidence and future-ready skills.",
            button: "Discover More",
            link: "#academics",
            color: "#C3BFFF"
        }
    ];

    const duration = 7000;
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    announcements.forEach(({ message }) => {
        const slide = document.createElement("div");
        slide.className = "announcement-slide";
        slide.textContent = message;
        track.appendChild(slide);
    });

    let currentIndex = 0;
    let elapsed = 0;
    let lastTime = 0;
    let animationFrame = null;
    let isPaused = false;

    function updateAnnouncement(index) {
        const item = announcements[index];

        label.textContent = item.label;
        cta.replaceChildren();

        const buttonText = document.createElement("span");
        buttonText.textContent = item.button;

        const arrow = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        arrow.setAttribute("viewBox", "0 0 24 24");
        arrow.setAttribute("fill", "none");
        arrow.setAttribute("aria-hidden", "true");

        const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        path.setAttribute("d", "M7 17L17 7M7 7H17V17");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-width", "1.8");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");

        arrow.appendChild(path);
        cta.append(buttonText, arrow);
        cta.href = item.link;

        bar.style.setProperty("--announcement-progress-color", item.color);
        track.style.transform = `translateY(-${index * 20}px)`;
        progress.style.width = "0%";
    }

    function nextAnnouncement() {
        currentIndex = (currentIndex + 1) % announcements.length;
        updateAnnouncement(currentIndex);
        elapsed = 0;
    }

    function animateProgress(timestamp) {
        if (isPaused) {
            animationFrame = null;
            return;
        }

        if (!lastTime) lastTime = timestamp;

        elapsed += timestamp - lastTime;
        lastTime = timestamp;

        progress.style.width = `${Math.min((elapsed / duration) * 100, 100)}%`;

        if (elapsed >= duration) nextAnnouncement();

        animationFrame = requestAnimationFrame(animateProgress);
    }

    function startRotation() {
        if (reducedMotion || isPaused || animationFrame !== null) return;

        lastTime = 0;
        animationFrame = requestAnimationFrame(animateProgress);
    }

    function pauseRotation() {
        if (isPaused) return;

        isPaused = true;

        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    }

    function resumeRotation() {
        if (reducedMotion || !isPaused) return;

        isPaused = false;
        startRotation();
    }

    bar.addEventListener("mouseenter", pauseRotation);
    bar.addEventListener("mouseleave", resumeRotation);
    bar.addEventListener("focusin", pauseRotation);

    bar.addEventListener("focusout", event => {
        if (!bar.contains(event.relatedTarget)) resumeRotation();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            pauseRotation();
        } else {
            resumeRotation();
        }
    });

    updateAnnouncement(currentIndex);
    startRotation();
}


/* =====================================================
   NAVBAR
===================================================== */

function initNavbar() {
    const header = document.getElementById("mainHeader");
    const toggle = document.getElementById("navbarToggle");
    const menu = document.getElementById("navbarMenu");

    if (!header || !toggle || !menu) return;

    const links = menu.querySelectorAll(".nav-link");

    function setMenuState(open) {
        menu.classList.toggle("open", open);
        toggle.classList.toggle("active", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute(
            "aria-label",
            open ? "Close navigation menu" : "Open navigation menu"
        );
    }

    toggle.addEventListener("click", () => {
        setMenuState(!menu.classList.contains("open"));
    });

    links.forEach(link => {
        link.addEventListener("click", () => {
            setMenuState(false);
            links.forEach(item => item.classList.remove("active"));
            link.classList.add("active");
        });
    });

    document.addEventListener("click", event => {
        if (!header.contains(event.target) && menu.classList.contains("open")) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && menu.classList.contains("open")) {
            setMenuState(false);
            toggle.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) setMenuState(false);
    });

    function updateHeader() {
        header.classList.toggle("scrolled", window.scrollY > 20);
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    if ("IntersectionObserver" in window) {
        const sections = document.querySelectorAll("section[id], main[id]");

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const sectionId = entry.target.id;

                links.forEach(link => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${sectionId}`
                    );
                });
            });
        }, {
            rootMargin: "-25% 0px -65% 0px"
        });

        sections.forEach(section => observer.observe(section));
    }
}


/* =====================================================
   STATISTICS
===================================================== */

function animateCounter(element) {
    const target = Number(element.dataset.target);
    if (!Number.isFinite(target)) return;

    const duration = 2000;
    const startTime = performance.now();
    const suffix = element.querySelector("span")?.textContent || "";

    function updateCounter(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(target * easedProgress);

        element.innerHTML =
            `${currentValue.toLocaleString("en-IN")}<span>${suffix}</span>`;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.innerHTML =
                `${target.toLocaleString("en-IN")}<span>${suffix}</span>`;
        }
    }

    requestAnimationFrame(updateCounter);
}

function initStatistics() {
    const statsSection = document.querySelector(".stats-section");
    if (!statsSection) return;

    const counters = statsSection.querySelectorAll(".stat-number");

    if ("IntersectionObserver" in window && counters.length) {
        const counterObserver = new IntersectionObserver(entries => {
            if (!entries.some(entry => entry.isIntersecting)) return;

            counters.forEach(animateCounter);
            counterObserver.disconnect();
        }, { threshold: 0.4 });

        counterObserver.observe(statsSection);
    }

    const statItems = document.querySelectorAll(".stat-item");

    if ("IntersectionObserver" in window && statItems.length) {
        const itemObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("show");
                itemObserver.unobserve(entry.target);
            });
        }, { threshold: 0.2 });

        statItems.forEach(item => itemObserver.observe(item));
    } else {
        statItems.forEach(item => item.classList.add("show"));
    }
}


/* =====================================================
   EVENTS FEATURED IMAGE
===================================================== */

function initEventPreview() {
    const featuredEvent = document.querySelector("#featuredEvent");
    const upcomingEventsPanel = document.querySelector(".upcoming-events");

    if (!featuredEvent || !upcomingEventsPanel) return;

    const featuredImage = document.querySelector("#featuredEventImage");
    const featuredCategory = document.querySelector("#featuredEventCategory");
    const featuredDate = document.querySelector("#featuredEventDate");
    const featuredTitle = document.querySelector("#featuredEventTitle");
    const featuredDescription = document.querySelector("#featuredEventDescription");

    if (
        !featuredImage ||
        !featuredCategory ||
        !featuredDate ||
        !featuredTitle ||
        !featuredDescription
    ) return;

    const upcomingEvents = upcomingEventsPanel.querySelectorAll(".upcoming-event");

    const defaultEvent = {
        image: featuredEvent.dataset.defaultImage,
        category: featuredCategory.textContent.trim(),
        date: featuredDate.textContent.trim(),
        title: featuredTitle.textContent.trim(),
        description: featuredDescription.textContent.trim()
    };

    let activeImage = defaultEvent.image;

    function updateFeaturedEvent(eventData) {
        featuredCategory.textContent = eventData.category || "";
        featuredDate.textContent = eventData.date || "";
        featuredTitle.textContent = eventData.title || "";
        featuredDescription.textContent = eventData.description || "";

        if (!eventData.image || eventData.image === activeImage) return;

        activeImage = eventData.image;
        featuredImage.style.opacity = "0";

        const newImage = new Image();

        newImage.onload = () => {
            if (activeImage !== eventData.image) return;

            featuredImage.src = eventData.image;
            featuredImage.alt = eventData.title || "";

            requestAnimationFrame(() => {
                featuredImage.style.opacity = "1";
            });
        };

        newImage.onerror = () => {
            if (activeImage === eventData.image) {
                featuredImage.style.opacity = "1";
            }
            console.error("Event image could not load:", eventData.image);
        };

        newImage.src = eventData.image;
    }

    upcomingEvents.forEach(event => {
        const eventData = {
            image: event.dataset.image,
            category: event.dataset.category,
            date: event.dataset.date,
            title: event.dataset.title,
            description: event.dataset.description
        };

        event.addEventListener("mouseenter", () => {
            updateFeaturedEvent(eventData);
        });

        event.addEventListener("focusin", () => {
            updateFeaturedEvent(eventData);
        });
    });

    upcomingEventsPanel.addEventListener("mouseleave", () => {
        updateFeaturedEvent(defaultEvent);
    });

    upcomingEventsPanel.addEventListener("focusout", event => {
        if (!upcomingEventsPanel.contains(event.relatedTarget)) {
            updateFeaturedEvent(defaultEvent);
        }
    });
}


/* =====================================================
   BACK TO TOP
===================================================== */

function initBackToTop() {
    const backToTop = document.getElementById("backToTop");
    if (!backToTop) return;

    function toggleBackToTop() {
        backToTop.classList.toggle("show", window.scrollY > 400);
    }

    window.addEventListener("scroll", toggleBackToTop, { passive: true });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    toggleBackToTop();
}


/* =====================================================
   FAQ ACCORDION
===================================================== */

function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        if (!question) return;

        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            faqItems.forEach(faqItem => {
                faqItem.classList.remove("active");
                faqItem.querySelector(".faq-question")?.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });

            if (!isActive) {
                item.classList.add("active");
                question.setAttribute("aria-expanded", "true");
            }
        });
    });
}


/* =====================================================
   PAGE INITIALIZATION
===================================================== */

function initSchoolWebsite() {
    initAnnouncement();
    initNavbar();
    initStatistics();
    initEventPreview();
    initBackToTop();
    initFaqAccordion();

    const footerYear = document.getElementById("footerYear");
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSchoolWebsite, { once: true });
} else {
    initSchoolWebsite();
}
