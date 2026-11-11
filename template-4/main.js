
/* =====================================================
   ANNOUNCEMENT BAR
===================================================== */

function initAnnouncement() {

    const bar = document.getElementById("announcementBar");

    if (!bar) return;

    const label = document.getElementById("announcementLabel");
    const track = document.getElementById("announcementTrack");
    const cta = document.getElementById("announcementCta");
    const progress = document.getElementById("announcementProgress");

    if (!label || !track || !cta || !progress) return;


    /* ================================================
       ANNOUNCEMENT DATA
    ================================================ */

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


    /* ================================================
       SETTINGS
    ================================================ */

    const duration = 7000;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* ================================================
       CREATE SLIDES
    ================================================ */

    announcements.forEach(item => {

        const slide = document.createElement("div");

        slide.className = "announcement-slide";
        slide.textContent = item.message;

        track.appendChild(slide);

    });


    /* ================================================
       STATE
    ================================================ */

    let currentIndex = 0;
    let elapsed = 0;
    let lastTime = 0;
    let animationFrame = null;
    let isPaused = false;


    /* ================================================
       UPDATE ANNOUNCEMENT
    ================================================ */

    function updateAnnouncement(index) {

        const item = announcements[index];

        label.textContent = item.label;

        cta.textContent = "";

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

        bar.style.setProperty(
            "--announcement-progress-color",
            item.color
        );

        track.style.transform =
            `translateY(-${index * 20}px)`;

        progress.style.width = "0%";

    }


    /* ================================================
       SLIDE TO NEXT ANNOUNCEMENT
    ================================================ */

    function nextAnnouncement() {

        currentIndex = (currentIndex + 1) % announcements.length;

        updateAnnouncement(currentIndex);

        elapsed = 0;

    }


    /* ================================================
       PROGRESS ANIMATION
    ================================================ */

    function animateProgress(timestamp) {

        if (isPaused) {
            animationFrame = null;
            return;
        }

        if (!lastTime) lastTime = timestamp;

        const delta = timestamp - lastTime;

        lastTime = timestamp;

        elapsed += delta;

        const percentage = Math.min(
            (elapsed / duration) * 100,
            100
        );

        progress.style.width = `${percentage}%`;

        if (elapsed >= duration) {

            nextAnnouncement();

        }

        animationFrame = requestAnimationFrame(
            animateProgress
        );

    }


    /* ================================================
       START ROTATION
    ================================================ */

    function startRotation() {

        if (isPaused || animationFrame !== null) return;

        lastTime = 0;

        animationFrame = requestAnimationFrame(
            animateProgress
        );

    }


    /* ================================================
       PAUSE ROTATION
    ================================================ */

    function pauseRotation() {

        if (isPaused) return;

        isPaused = true;

        if (animationFrame !== null) {

            cancelAnimationFrame(animationFrame);

            animationFrame = null;

        }

    }


    /* ================================================
       RESUME ROTATION
    ================================================ */

    function resumeRotation() {

        if (!isPaused) return;

        isPaused = false;

        startRotation();

    }


    /* ================================================
       ACCESSIBILITY & USER INTERACTION
    ================================================ */

    bar.addEventListener("mouseenter", pauseRotation);
    bar.addEventListener("mouseleave", resumeRotation);

    bar.addEventListener("focusin", pauseRotation);
    bar.addEventListener("focusout", (event) => {

        if (!bar.contains(event.relatedTarget)) {
            resumeRotation();
        }

    });


    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            pauseRotation();
        } else {
            resumeRotation();
        }

    });


    /* ================================================
       INITIALIZE
    ================================================ */

    updateAnnouncement(currentIndex);

    if (!reducedMotion) {

        startRotation();

    }

}


/* =====================================================
   INITIALIZE AFTER DOM LOAD
===================================================== */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initAnnouncement
    );

} else {

    initAnnouncement();

}


/* =====================================================
   NAVBAR FUNCTIONALITY
===================================================== */

function initNavbar() {

    const header = document.getElementById("mainHeader");
    const toggle = document.getElementById("navbarToggle");
    const menu = document.getElementById("navbarMenu");

    if (!header || !toggle || !menu) return;

    const links = menu.querySelectorAll(".nav-link");


    /* ================================================
       OPEN / CLOSE MOBILE MENU
    ================================================ */

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

        const isOpen = menu.classList.contains("open");

        setMenuState(!isOpen);

    });


    /* ================================================
       CLOSE AFTER NAVIGATION
    ================================================ */

    links.forEach(link => {

        link.addEventListener("click", () => {

            setMenuState(false);

            links.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });


    /* ================================================
       CLOSE WHEN CLICKING OUTSIDE
    ================================================ */

    document.addEventListener("click", event => {

        if (
            !header.contains(event.target) &&
            menu.classList.contains("open")
        ) {

            setMenuState(false);

        }

    });


    /* ================================================
       ESCAPE KEY
    ================================================ */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            setMenuState(false);

            toggle.focus();

        }

    });


    /* ================================================
       CLOSE MENU WHEN RESIZING TO DESKTOP
    ================================================ */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {

            setMenuState(false);

        }

    });


    /* ================================================
       HEADER SCROLL EFFECT
    ================================================ */

    function updateHeader() {

        header.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );

    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    /* ================================================
       ACTIVE SECTION DETECTION
    ================================================ */

    const sections = document.querySelectorAll(
        "section[id], main[id]"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const sectionId = entry.target.id;

                    links.forEach(link => {

                        const isActive =
                            link.getAttribute("href") === `#${sectionId}`;

                        link.classList.toggle("active", isActive);

                    });

                }

            });

        }, {
            rootMargin: "-25% 0px -65% 0px"
        });

        sections.forEach(section => {
            observer.observe(section);
        });

    }

}


/* =====================================================
   INITIALIZE
===================================================== */

if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", initNavbar);

} else {

    initNavbar();

}
