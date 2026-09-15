// Slide content configuration
const slidesData = [
    {
        emoji: "🎉🎂✨",
        title: "Happy Birthday!",
        message: "A little wish, made <em>especially</em> for you."
    },
    {
        emoji: "🌟💫",
        title: "Another Year Brighter",
        message: "With each passing year, you shine <em>brighter</em> than before."
    },
    {
        emoji: "❤️🎁",
        title: "Wishing You Joy",
        message: "May your day be filled with <em>love</em>, laughter, and happy memories."
    },
    {
        emoji: "🌈✨",
        title: "You're Amazing",
        message: "Thank you for being the <em>wonderful</em> person you are!"
    },
    {
        emoji: "🎊🥳",
        title: "Cheers to You!",
        message: "Here's to another year of <em>adventures</em> and beautiful moments."
    }
];

// DOM Elements
const progressContainer = document.getElementById("progress");
const counterEl = document.getElementById("counter");
const slideEl = document.getElementById("slide");
const slideEmoji = document.getElementById("slideEmoji");
const slideTitle = document.getElementById("slideTitle");
const slideMessage = document.getElementById("slideMessage");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const restartBtn = document.getElementById("restart");
const nextZone = document.getElementById("nextZone");
const backZone = document.getElementById("backZone");
const hintEl = document.getElementById("hint");
const stageEl = document.getElementById("stage");
const progressBar = document.getElementById("progress");

// State
let currentIndex = 0;
const totalSlides = slidesData.length;

/**
 * Initialize progress bars
 */
function initProgressBars() {
    progressContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
        const bar = document.createElement("span");
        bar.className = "bar";
        const fill = document.createElement("div");
        bar.appendChild(fill);
        progressContainer.appendChild(bar);
    }
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string with em tags
 * @returns {DocumentFragment} - Safe HTML fragment
 */
function createSafeHTML(html) {
    const container = document.createElement("div");
    container.innerHTML = html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/&lt;em&gt;/g, "<em>")
        .replace(/&lt;\/em&gt;/g, "</em>");
    return container.firstChild;
}

/**
 * Render slide content
 * @param {number} index - Slide index
 */
function renderSlide(index) {
    const data = slidesData[index];

    // Re-trigger slide animation
    slideEl.classList.remove("animate-enter");
    void slideEl.offsetWidth; // Trigger reflow
    slideEl.classList.add("animate-enter");

    // Update content
    slideEmoji.textContent = data.emoji;
    slideTitle.textContent = data.title;
    slideMessage.innerHTML = ""; // Clear first
    slideMessage.appendChild(createSafeHTML(data.message));

    // Update counter
    counterEl.textContent = `${index + 1} / ${totalSlides}`;

    // Update progress bars
    const bars = progressContainer.querySelectorAll(".bar");
    bars.forEach((bar, i) => {
        bar.classList.remove("done", "current");
        if (i < index) {
            bar.classList.add("done");
        } else if (i === index) {
            bar.classList.add("current");
        }
    });

    // Update aria attributes
    progressBar.setAttribute("aria-valuenow", index + 1);
    progressBar.setAttribute("aria-valuemax", totalSlides);

    // Update controls
    prevBtn.disabled = index === 0;

    if (index === totalSlides - 1) {
        nextBtn.textContent = "Done 🎉";
        hintEl.textContent = "You've reached the end! Tap restart anytime.";
    } else {
        nextBtn.textContent = "Next →";
        hintEl.textContent = index === 0 
            ? "Tap the right side or use Next to continue"
            : "Keep going to see more wishes!";
    }
}

/**
 * Navigate to next slide
 */
function goNext() {
    if (currentIndex < totalSlides - 1) {
        currentIndex++;
        renderSlide(currentIndex);
    }
}

/**
 * Navigate to previous slide
 */
function goPrev() {
    if (currentIndex > 0) {
        currentIndex--;
        renderSlide(currentIndex);
    }
}

/**
 * Restart slideshow
 */
function restart() {
    currentIndex = 0;
    renderSlide(currentIndex);
}

// Event Listeners
nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", goPrev);
restartBtn.addEventListener("click", restart);
nextZone.addEventListener("click", goNext);
backZone.addEventListener("click", goPrev);

// Keyboard navigation
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
    } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
    }
});

// Touch swipe gestures
let touchStartX = 0;
let touchEndX = 0;

window.addEventListener(
    "touchstart",
    (e) => {
        touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
);

window.addEventListener(
    "touchend",
    (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    },
    { passive: true }
);

/**
 * Handle swipe gestures
 */
function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
            goNext();
        } else {
            goPrev();
        }
    }
}

// Initialize
initProgressBars();
renderSlide(currentIndex);