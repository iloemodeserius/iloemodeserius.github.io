// ==============================
// ILOO — INTERACTIVE EXPERIENCE
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 0. BOOT SCREEN
    const boot = document.getElementById("boot");

    if (boot) {
        let seen = null;
        try { seen = sessionStorage.getItem("iloo-booted"); } catch (e) {}

        if (seen || reduceMotion) {
            boot.remove();
        } else {
            const log = document.getElementById("bootlog");
            const lines = [
                "[  OK  ] Mounting /home/iloo",
                "[  OK  ] Starting spray-paint.service",
                "[  OK  ] Loading galaxy modules...",
                "[  OK  ] Linking planets and stars",
                "[  OK  ] Reached target: Creative Mode",
                "",
                "Welcome to ILOO.OS — warp speed engaged ✳"
            ];
            let i = 0;
            let done = false;

            document.body.style.overflow = "hidden";

            const end = () => {
                if (done) return;
                done = true;
                boot.classList.add("out");
                document.body.style.overflow = "";
                try { sessionStorage.setItem("iloo-booted", "1"); } catch (e) {}
                setTimeout(() => boot.remove(), 950);
            };

            boot.addEventListener("click", end);
            window.addEventListener("keydown", end, { once: true });

            const next = () => {
                if (done) return;
                if (i < lines.length) {
                    log.textContent += lines[i++] + "\n";
                    setTimeout(next, 260);
                } else {
                    setTimeout(end, 600);
                }
            };
            next();
        }
    }

    // 1. SCROLL PROGRESS
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.appendChild(progress);

    window.addEventListener("scroll", () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    }, { passive: true });


    // 2. SCROLL REVEAL
    const sections = document.querySelectorAll(".about, .projects, .journey, .shell-sec, .contact");
    sections.forEach(s => s.classList.add("reveal"));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.12 });

    sections.forEach(s => observer.observe(s));


    // 3. TERMINAL TYPING
    const typed = document.getElementById("typed");

    if (typed) {
        const lines = [
            "whoami → iloo",
            "cat skills.txt → linux, js, java",
            "sudo explore --galaxy",
            "echo 'keep building!'"
        ];

        if (reduceMotion) {
            typed.textContent = lines[0];
        } else {
            let line = 0, char = 0, deleting = false;

            const tick = () => {
                const text = lines[line];
                char += deleting ? -1 : 1;
                typed.textContent = text.slice(0, char);

                let delay = deleting ? 30 : 70;

                if (!deleting && char === text.length) {
                    deleting = true;
                    delay = 1600;
                } else if (deleting && char === 0) {
                    deleting = false;
                    line = (line + 1) % lines.length;
                    delay = 400;
                }

                setTimeout(tick, delay);
            };

            tick();
        }
    }


    // 4. SPRAY THE WALL (canvas di hero)
    const hero = document.getElementById("home");
    const canvas = document.getElementById("wall");

    if (hero && canvas) {
        const ctx = canvas.getContext("2d");
        let color = "#FF36A6";
        let drawing = false;
        let last = null;

        const fit = () => {
            const r = hero.getBoundingClientRect();
            canvas.width = r.width;
            canvas.height = r.height;
        };

        const pos = (e) => {
            const r = hero.getBoundingClientRect();
            return { x: e.clientX - r.left, y: e.clientY - r.top };
        };

        const dot = (p) => {
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.6;
            for (let i = 0; i < 30; i++) {
                const a = Math.random() * Math.PI * 2;
                const r = Math.random() * Math.random() * 28;
                ctx.fillRect(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r, 2, 2);
            }
            ctx.globalAlpha = 1;
        };

        const line = (a, b) => {
            const n = Math.max(1, Math.floor(Math.hypot(b.x - a.x, b.y - a.y) / 6));
            for (let i = 1; i <= n; i++) {
                dot({ x: a.x + (b.x - a.x) * i / n, y: a.y + (b.y - a.y) * i / n });
            }
        };

        fit();
        window.addEventListener("resize", fit);

        // Hanya mouse/pen, supaya scroll di HP tetap normal
        hero.addEventListener("pointerdown", (e) => {
            if (e.pointerType === "touch" || e.target.closest("a, button, b")) return;
            drawing = true;
            last = pos(e);
            dot(last);
        });

        window.addEventListener("pointermove", (e) => {
            if (!drawing) return;
            const p = pos(e);
            line(last, p);
            last = p;
        });

        window.addEventListener("pointerup", () => { drawing = false; });

        const swatches = document.querySelectorAll(".pal b");
        swatches.forEach(b => {
            b.addEventListener("click", () => {
                color = b.dataset.c;
                swatches.forEach(o => o.classList.remove("on"));
                b.classList.add("on");
            });
        });

        const clear = document.getElementById("clr");
        if (clear) {
            clear.addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));
        }
    }


    // 5. INTERACTIVE TERMINAL
    const out = document.getElementById("out");
    const form = document.getElementById("cmdform");
    const input = document.getElementById("cmd");

    if (out && form && input) {
        const history = [];
        let hIndex = 0;

        const say = (text, cls = "") => {
            const row = document.createElement("div");
            row.className = "ln " + cls;
            row.textContent = text;
            out.appendChild(row);
            out.scrollTop = out.scrollHeight;
        };

        const sayAll = (arr, cls) => arr.forEach(t => say(t, cls));

        const commands = {
            help: () => sayAll([
                "Perintah yang tersedia:",
                "  about      siapa Iloo",
                "  skills     tech stack",
                "  projects   daftar project",
                "  github     buka GitHub",
                "  contact    cara menghubungi",
                "  neofetch   info sistem",
                "  sudo hire iloo",
                "  clear      bersihkan layar"
            ]),
            about: () => sayAll([
                "Iloo — pelajar, developer, Linux enthusiast, DevOps explorer.",
                "Belajar dengan mencoba. Setiap error = pelajaran."
            ]),
            whoami: () => say("iloo"),
            skills: () => say("linux  java  javascript  html  css  git  node.js"),
            projects: () => sayAll([
                "01  linux-lab         [learning]",
                "02  websocket-chat    [experiment]",
                "03  webrtc-experiment [in progress]"
            ]),
            ls: () => say("about.txt  projects/  skills.md  secrets/"),
            contact: () => say("GitHub → github.com/iloemodeserius", "ok"),
            github: () => {
                say("Membuka GitHub...", "ok");
                window.open("https://github.com/iloemodeserius", "_blank", "noopener");
            },
            neofetch: () => sayAll([
                "iloo@orbit",
                "-----------",
                "OS:     ILOO.OS (Cosmic Graffiti)",
                "Shell:  curiosity 1.0",
                "Stack:  linux, js, node.js",
                "Status: still learning, still building ✳"
            ]),
            clear: () => { out.innerHTML = ""; }
        };

        const run = (raw) => {
            const cmd = raw.trim().toLowerCase();
            if (!cmd) return;

            say("$ " + raw, "cmd");

            if (commands[cmd]) {
                commands[cmd]();
            } else if (cmd === "sudo hire iloo") {
                say("[sudo] password for recruiter: ********");
                sayAll(["Access granted ✳", "Iloo siap dihire: cepat belajar, nggak takut error."], "ok");
            } else if (cmd.startsWith("rm -rf")) {
                say("Nice try. Permission denied 😏", "err");
            } else if (cmd === "cat secrets" || cmd === "cd secrets") {
                say("Rahasianya: Iloo masih suka ngoding jam 2 pagi.", "ok");
            } else {
                say("command not found: " + cmd + " — ketik 'help'", "err");
            }
        };

        say("Welcome to ILOO.OS ✳  Ketik 'help' untuk mulai.", "ok");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const value = input.value;
            if (value.trim()) { history.push(value); hIndex = history.length; }
            run(value);
            input.value = "";
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "ArrowUp" && history.length) {
                hIndex = Math.max(0, hIndex - 1);
                input.value = history[hIndex];
                e.preventDefault();
            } else if (e.key === "ArrowDown") {
                hIndex = Math.min(history.length, hIndex + 1);
                input.value = history[hIndex] || "";
                e.preventDefault();
            }
        });

        document.getElementById("shell").addEventListener("click", () => input.focus());
    }


    // 6. CONSOLE MESSAGE
    console.log(
        "%c HELLO, ILOO! ",
        "background: #ff36a6; color: white; font-size: 20px; font-weight: bold; padding: 10px;"
    );
    console.log("%c Keep learning. Keep building.", "color: #ffe500; font-size: 14px;");

});