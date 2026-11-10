// ==============================
// ILOO — INTERACTIVE EXPERIENCE
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    // 1. SCROLL PROGRESS
    const progress = document.createElement("div");

    progress.className = "scroll-progress";

    document.body.appendChild(progress);

    window.addEventListener("scroll", () => {

        const scrollTop = window.scrollY;

        const pageHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const percentage =
            pageHeight > 0
                ? (scrollTop / pageHeight) * 100
                : 0;

        progress.style.width = percentage + "%";

    });


    // 2. SCROLL REVEAL
    const sections = document.querySelectorAll(
        ".about, .projects, .contact"
    );

    sections.forEach(section => {
        section.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                }

            });

        },
        {
            threshold: 0.15
        }
    );

    sections.forEach(section => {
        observer.observe(section);
    });


    // 3. FLOATING STICKERS
    const stickers = document.querySelectorAll(".sticker");

    stickers.forEach((sticker, index) => {

        sticker.style.animation =
            `float ${3 + index}s ease-in-out infinite`;

    });


    // 4. CONSOLE MESSAGE
    console.log(
        "%c HELLO, ILOO! ",
        "background: #ff36a6; color: white; font-size: 20px; font-weight: bold; padding: 10px;"
    );

    console.log(
        "%c Keep learning. Keep building.",
        "color: #ffe500; font-size: 14px;"
    );

});