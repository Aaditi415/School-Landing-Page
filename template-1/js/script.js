
/* =========================================
   ASTRON — SPACE INTERACTIONS
========================================= */

// Generate random stars
const starsContainer = document.getElementById("stars");

if (starsContainer) {
    for (let i = 0; i < 20; i++) {
        const star = document.createElement("span");

        star.className = "star";

        const size = Math.random() * 2 + 1;

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty(
            "--duration",
            `${Math.random() * 3 + 2}s`
        );

        starsContainer.appendChild(star);
    }
}

// Coming Soon Countdown
const daysElement = document.getElementById("days");

if (daysElement) {

    // Change this to your actual launch date
    const launchDate = new Date("2026-12-31T00:00:00").getTime();

    function updateCountdown() {
        const now = Date.now();
        const difference = launchDate - now;

        if (difference <= 0) {
            ["days", "hours", "minutes", "seconds"].forEach(id => {
                document.getElementById(id).textContent = "00";
            });
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );
        const minutes = Math.floor(
            (difference / (1000 * 60)) % 60
        );
        const seconds = Math.floor(
            (difference / 1000) % 60
        );

        document.getElementById("days").textContent =
            String(days).padStart(2, "0");

        document.getElementById("hours").textContent =
            String(hours).padStart(2, "0");

        document.getElementById("minutes").textContent =
            String(minutes).padStart(2, "0");

        document.getElementById("seconds").textContent =
            String(seconds).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Notification form
const notifyForm = document.getElementById("notifyForm");

if (notifyForm) {
    notifyForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = this.querySelector("input").value;
        const message = document.getElementById("formMessage");

        message.textContent = "Thanks! Your email is ready for launch notifications.";
        message.style.color = "#45d6a1";

        console.log("Notification signup:", email);

        this.reset();
    });
}

// Go Back button
const goBackButton = document.getElementById("goBack");

if (goBackButton) {
    goBackButton.addEventListener("click", function () {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "index.html";
        }
    });
}
