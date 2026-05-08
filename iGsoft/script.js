/* ── Preloader ── */
(function () {
  const loader = document.getElementById("preloader");
  const fill   = document.getElementById("preloaderFill");
  const pct    = document.getElementById("preloaderPct");
  if (!loader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    if (fill) fill.style.width = progress + "%";
    if (pct)  pct.textContent  = Math.round(progress) + "%";
    if (progress >= 100) {
      setTimeout(() => {
        loader.classList.add("is-done");
        document.body.style.overflow = "";
      }, 300);
    }
  }, 80);

  document.body.style.overflow = "hidden";
})();

/* ── Cursor Glow ── */
(function () {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);
  let mx = -999, my = -999;
  document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
  (function tick() {
    glow.style.left = mx + "px";
    glow.style.top  = my + "px";
    requestAnimationFrame(tick);
  })();
})();

/* ── Hero Canvas Particle Grid ── */
(function () {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, dots, mouse = { x: -999, y: -999 };
  const SPACING = 52, RADIUS = 1.2, CONNECT = 110;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const cols = Math.ceil(W / SPACING) + 1;
    const rows = Math.ceil(H / SPACING) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: c * SPACING, y: r * SPACING,
          ox: c * SPACING, oy: r * SPACING,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach((d) => {
      d.x += d.vx; d.y += d.vy;
      if (Math.abs(d.x - d.ox) > 18) d.vx *= -1;
      if (Math.abs(d.y - d.oy) > 18) d.vy *= -1;
      const dx = d.x - mouse.x, dy = d.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const glow = dist < CONNECT ? 1 - dist / CONNECT : 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, RADIUS + glow * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(41,151,255,${0.18 + glow * 0.55})`;
      ctx.fill();
    });
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(41,151,255,${(1 - d / CONNECT) * 0.18})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  canvas.closest(".hero")?.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.closest(".hero")?.addEventListener("mouseleave", () => { mouse.x = -999; mouse.y = -999; });
  window.addEventListener("resize", resize);
  resize();
  draw();
})();

/* ── Service data ── */
const serviceData = {
  seo: {
    label: "SEO Services",
    title: "Search visibility engineered for compounding growth.",
    description: "Technical audits, content architecture, and conversion-aware optimization help the right audience find you and stay engaged.",
    image: "https://picsum.photos/seed/igsoft-seo/1200/800",
    metrics: ["Technical SEO", "Content architecture", "Analytics alignment"],
    tags: ["Keyword strategy", "On-page systems", "Structured data", "Reporting dashboards"],
  },
  web: {
    label: "Web Development",
    title: "Launch-ready websites built for speed, clarity, and control.",
    description: "From premium marketing sites to custom front-end builds, we ship performant experiences that stay stable under real traffic and real timelines.",
    image: "https://picsum.photos/seed/igsoft-web/1200/800",
    metrics: ["Front-end engineering", "CMS integration", "Performance budgets"],
    tags: ["Responsive builds", "GSAP motion", "QA workflows", "Scalable code"],
  },
  uiux: {
    label: "UI/UX Design",
    title: "Product and brand experiences shaped around how people actually move.",
    description: "We design interfaces that balance elegance with comprehension, making complex products feel intuitive without sanding off their ambition.",
    image: "https://picsum.photos/seed/igsoft-uiux/1200/800",
    metrics: ["UX strategy", "Interface systems", "Prototype direction"],
    tags: ["Wireframes", "Design systems", "User flows", "Interaction states"],
  },
  content: {
    label: "Content Marketing",
    title: "Narratives that pull visitors forward instead of filling space.",
    description: "Messaging, editorial systems, and campaign frameworks keep the story sharp across launch pages, product content, and ongoing growth channels.",
    image: "https://picsum.photos/seed/igsoft-content/1200/800",
    metrics: ["Narrative strategy", "Editorial systems", "Campaign messaging"],
    tags: ["Landing pages", "Thought leadership", "Conversion copy", "Content calendars"],
  },
  app: {
    label: "App Development",
    title: "Digital products designed to feel polished from first tap to daily habit.",
    description: "We partner on mobile and web app experiences that need strong UX thinking, clear front-end execution, and room to evolve after v1.",
    image: "https://picsum.photos/seed/igsoft-app/1200/800",
    metrics: ["App experience design", "Front-end architecture", "Launch planning"],
    tags: ["MVP workflows", "Cross-platform UX", "Component systems", "Iteration loops"],
  },
  reputation: {
    label: "Reputation",
    title: "Brand trust strengthened through consistency, clarity, and response.",
    description: "We help brands manage visibility, strengthen credibility, and build supporting systems that keep public perception aligned with the work.",
    image: "https://picsum.photos/seed/igsoft-reputation/1200/800",
    metrics: ["Brand monitoring", "Review strategy", "Authority building"],
    tags: ["Trust signals", "Case studies", "Social proof", "Crisis response planning"],
  },
};

const header          = document.querySelector(".site-header");
const navToggle       = document.querySelector(".nav-toggle");
const navLinks        = document.querySelectorAll(".nav-links a");
const serviceTriggers = document.querySelectorAll(".service-trigger");
const serviceImage    = document.getElementById("service-image");
const serviceLabel    = document.getElementById("service-label");
const serviceTitle    = document.getElementById("service-title");
const serviceDesc     = document.getElementById("service-description");
const serviceMetrics  = document.getElementById("service-metrics");
const serviceTags     = document.getElementById("service-tags");
const testimonialSlides = Array.from(document.querySelectorAll(".testimonial-shell > .testimonial-track .testimonial-slide"));
const testimonialDots   = Array.from(document.querySelectorAll(".slider-dot"));
const sliderButtons     = document.querySelectorAll(".slider-button");
const testimonialShell  = document.querySelector(".testimonial-shell");
const testimonialCount  = document.getElementById("testimonial-count");
const testimonialProg   = document.querySelector(".testimonial-progress span");
const contactForm       = document.querySelector(".contact-form");
const formNote          = document.querySelector(".form-note");
const prefersReduced    = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let activeService = "seo";
let activeSlide   = 0;
let sliderTimer   = null;

/* ── Services ── */
const setServiceContent = (key) => {
  const data = serviceData[key];
  if (!data) return;
  activeService = key;
  serviceTriggers.forEach(t => t.classList.toggle("is-active", t.dataset.service === key));
  const update = () => {
    serviceImage.src = data.image;
    serviceImage.alt = data.label;
    serviceLabel.textContent = data.label;
    serviceTitle.textContent = data.title;
    serviceDesc.textContent  = data.description;
    serviceMetrics.innerHTML = data.metrics.map(m => `<span class="metric-chip">${m}</span>`).join("");
    serviceTags.innerHTML    = data.tags.map(t => `<span class="tag-chip">${t}</span>`).join("");
  };
  if (prefersReduced || typeof gsap === "undefined") { update(); return; }
  gsap.killTweensOf(".service-panel");
  gsap.timeline({ defaults: { duration: 0.22, ease: "power2.out" } })
    .to(".service-panel", { opacity: 0.6, y: 8 })
    .add(update)
    .to(".service-panel", { opacity: 1, y: 0 });
};

/* ── Testimonials ── */
const setActiveSlide = (index) => {
  if (!testimonialSlides.length) return;
  activeSlide = (index + testimonialSlides.length) % testimonialSlides.length;
  testimonialSlides.forEach((slide, i) => {
    const on = i === activeSlide;
    slide.classList.toggle("is-active", on);
    slide.setAttribute("aria-hidden", String(!on));
    if (typeof gsap !== "undefined") gsap.set(slide, { autoAlpha: on ? 1 : 0, clearProps: on ? "display" : "transform" });
    else { slide.style.opacity = on ? "1" : "0"; slide.style.visibility = on ? "visible" : "hidden"; }
  });
  testimonialDots.forEach((d, i) => d.classList.toggle("is-active", i === activeSlide));
  if (testimonialCount) testimonialCount.textContent = `${String(activeSlide + 1).padStart(2,"0")} / ${String(testimonialSlides.length).padStart(2,"0")}`;
  if (testimonialProg)  testimonialProg.style.width  = `${((activeSlide + 1) / testimonialSlides.length) * 100}%`;
  if (prefersReduced || typeof gsap === "undefined") return;
  gsap.killTweensOf(testimonialSlides);
  gsap.timeline()
    .fromTo(testimonialSlides[activeSlide], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power2.out", overwrite: true })
    .fromTo(testimonialSlides[activeSlide].querySelector(".testimonial-copy"),   { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.42, ease: "power2.out" }, "-=0.24")
    .fromTo(testimonialSlides[activeSlide].querySelector(".testimonial-impact"), { autoAlpha: 0, x: 22, scale: 0.98 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.42, ease: "power2.out" }, "<0.06");
};

const stopSlider  = () => { if (sliderTimer) { clearInterval(sliderTimer); sliderTimer = null; } };
const startSlider = () => { stopSlider(); sliderTimer = setInterval(() => setActiveSlide(activeSlide + 1), 5200); };

/* ── Nav ── */
navToggle?.addEventListener("click", () => {
  const open = header.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});
navLinks.forEach(l => l.addEventListener("click", () => { header.classList.remove("is-open"); navToggle?.setAttribute("aria-expanded","false"); }));
serviceTriggers.forEach(t => { const fn = () => setServiceContent(t.dataset.service); t.addEventListener("mouseenter", fn); t.addEventListener("focus", fn); t.addEventListener("click", fn); });
sliderButtons.forEach(b => b.addEventListener("click", () => { setActiveSlide(activeSlide + (b.dataset.direction === "prev" ? -1 : 1)); startSlider(); }));
testimonialDots.forEach(d => d.addEventListener("click", () => { setActiveSlide(Number(d.dataset.index)); startSlider(); }));
testimonialShell?.addEventListener("mouseenter", stopSlider);
testimonialShell?.addEventListener("mouseleave", startSlider);
testimonialShell?.addEventListener("focusin",    stopSlider);
testimonialShell?.addEventListener("focusout",   startSlider);
window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 24));
contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector(".contact-submit");
  if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
  try {
    const res  = await fetch("contact.php", { method: "POST", body: new FormData(contactForm) });
    const data = await res.json();
    if (formNote) { formNote.textContent = data.message; formNote.style.color = data.ok ? "#64ffda" : "#ff6b6b"; }
    if (data.ok) contactForm.reset();
  } catch { if (formNote) { formNote.textContent = "Network error. Please try again."; formNote.style.color = "#ff6b6b"; } }
  finally { if (btn) { btn.disabled = false; btn.textContent = "Send Inquiry"; } }
});

setServiceContent(activeService);
setActiveSlide(activeSlide);
testimonialSlides.forEach((s, i) => s.setAttribute("aria-hidden", String(i !== 0)));
startSlider();

/* ── Project Modal ── */
(function () {
  const popup    = document.getElementById("leadPopup");
  const closeBtn = document.getElementById("popupClose");
  const backdrop = document.getElementById("popupBackdrop");
  const form     = document.getElementById("leadForm");
  const note     = document.querySelector(".proj-note");
  if (!popup) return;

  const KEY = "igsoft_lead_shown";
  let lastFocused = null;

  /* ── Focus trap ── */
  const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
  function trapFocus(e) {
    const els = Array.from(popup.querySelectorAll(FOCUSABLE)).filter(el => !el.closest('[hidden]'));
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  /* ── Open ── */
  const open = (trigger) => {
    lastFocused = trigger || document.activeElement;
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", trapFocus);
    // Small delay so CSS transition plays after display
    requestAnimationFrame(() => closeBtn?.focus());
  };

  /* ── Close ── */
  const close = () => {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", trapFocus);
    sessionStorage.setItem(KEY, "1");
    // Restore focus to the element that opened the modal
    if (lastFocused && typeof lastFocused.focus === "function") {
      setTimeout(() => lastFocused.focus(), 50);
    }
  };

  /* ── Auto-open after 15s (once per session) ── */
  if (!sessionStorage.getItem(KEY)) setTimeout(() => open(null), 15000);

  /* ── Trigger buttons ── */
  document.getElementById("heroProjectBtn")?.addEventListener("click", function () { open(this); });
  document.getElementById("navProjectBtn")?.addEventListener("click",  function () { open(this); });

  /* ── Close triggers ── */
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && popup.classList.contains("is-open")) close(); });

  /* ── Client-side validation ── */
  function validateForm() {
    let valid = true;
    const nameField  = document.getElementById("field-name");
    const emailField = document.getElementById("field-email");
    const nameInput  = document.getElementById("popup-name");
    const emailInput = document.getElementById("popup-email");

    // Reset
    [nameField, emailField].forEach(f => f?.classList.remove("has-error"));

    if (!nameInput?.value.trim()) {
      nameField?.classList.add("has-error");
      nameInput?.focus();
      valid = false;
    }
    const emailOk = emailInput?.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
    if (!emailOk) {
      emailField?.classList.add("has-error");
      if (valid) emailInput?.focus(); // only steal focus if name was ok
      valid = false;
    }
    return valid;
  }

  /* Clear error state on input */
  ["popup-name", "popup-email"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", function () {
      this.closest(".proj-field")?.classList.remove("has-error");
    });
  });

  /* ── Form submit ── */
  form?.addEventListener("submit", async e => {
    e.preventDefault();
    if (!validateForm()) return;

    const btn      = document.getElementById("leadSubmitBtn");
    const btnText  = btn?.querySelector(".proj-submit-text");
    if (btn) { btn.disabled = true; }
    if (btnText) btnText.textContent = "Sending…";

    try {
      const res  = await fetch("lead.php", { method: "POST", body: new FormData(form) });
      const data = await res.json();
      if (note) { note.textContent = data.message; note.style.color = data.ok ? "#64ffda" : "#ff6b6b"; }
      if (data.ok) { form.reset(); setTimeout(close, 2400); }
    } catch {
      if (note) { note.textContent = "Network error. Please try again."; note.style.color = "#ff6b6b"; }
    } finally {
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = "Send Project Request";
    }
  });
})();

/* ── GSAP Animations ── */
if (!prefersReduced && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  /* ── Utility: split text nodes into word spans ── */
  function splitWords(el) {
    el.childNodes.forEach(node => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const words = node.textContent.trim().split(/\s+/).filter(Boolean);
      if (!words.length) return;
      const frag = document.createDocumentFragment();
      words.forEach((w, i) => {
        const outer = document.createElement("span");
        outer.className = "split-word";
        const inner = document.createElement("span");
        inner.className = "split-word-inner";
        inner.textContent = w;
        outer.appendChild(inner);
        frag.appendChild(outer);
        if (i < words.length - 1) frag.appendChild(document.createTextNode(" "));
      });
      node.replaceWith(frag);
    });
  }

  /* ── Hero entrance (fires after preloader) ── */
  function runHero() {
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) splitWords(heroTitle);

    /* hide everything first */
    gsap.set(".hero-badge, .hero-sub, .hero-cta, .hero-cards, .hero-ticker, .scroll-indicator", { autoAlpha: 0, y: 24 });
    gsap.set(".split-word-inner", { yPercent: 105 });

    gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 })
      .to(".hero-badge",        { autoAlpha: 1, y: 0, duration: 1 })
      .to(".split-word-inner",  { yPercent: 0, duration: 1.1, stagger: 0.055 }, "-=0.6")
      .to(".hero-sub",          { autoAlpha: 1, y: 0, duration: 1 }, "-=0.7")
      .to(".hero-cta",          { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.75")
      .to(".hero-cards",        { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.7")
      .to(".hero-ticker",       { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.65")
      .to(".scroll-indicator",  { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5");
  }

  const preloader = document.getElementById("preloader");
  if (preloader) {
    const obs = new MutationObserver(() => {
      if (preloader.classList.contains("is-done")) { obs.disconnect(); runHero(); }
    });
    obs.observe(preloader, { attributes: true, attributeFilter: ["class"] });
  } else {
    runHero();
  }

  /* ── Scroll indicator float ── */
  gsap.to(".scroll-indicator", { y: 8, repeat: -1, yoyo: true, duration: 1.6, ease: "sine.inOut", delay: 2 });

  /* ── Hero stat counters ── */
  document.querySelectorAll(".hero-card [data-count]").forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.textContent.replace(String(target), "");
    ScrollTrigger.create({
      trigger: el, start: "top 92%", once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, { val: target, duration: 2, ease: "power3.out",
          onUpdate: () => { el.textContent = (Number.isInteger(target) ? Math.round(obj.val) : obj.val.toFixed(1)) + suffix; }
        });
      }
    });
  });

  /* ── Generic fade-up reveal for section headings ── */
  gsap.utils.toArray(".section-heading, .services-intro, .ap-intro").forEach(el => {
    const eyebrow = el.querySelector(".eyebrow");
    const h2      = el.querySelector("h2, .ap-title");
    const p       = el.querySelector("p:not(.eyebrow)");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 80%", once: true }
    });
    if (eyebrow) tl.from(eyebrow, { autoAlpha: 0, y: 16, duration: 0.8, ease: "expo.out" });
    if (h2)      tl.from(h2,      { autoAlpha: 0, y: 28, duration: 1,   ease: "expo.out" }, "-=0.5");
    if (p)       tl.from(p,       { autoAlpha: 0, y: 20, duration: 0.9, ease: "expo.out" }, "-=0.6");
  });

  /* ── AP rows: image scale-in + copy stagger ── */
  gsap.utils.toArray(".ap-row").forEach(row => {
    const img  = row.querySelector(".ap-media img");
    const copy = row.querySelector(".ap-copy");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: row, start: "top 75%", once: true }
    });
    if (img)  tl.from(img,  { autoAlpha: 0, scale: 1.06, duration: 1.4, ease: "expo.out" });
    if (copy) tl.from(Array.from(copy.children), {
      autoAlpha: 0, y: 32, stagger: 0.1, duration: 1, ease: "expo.out"
    }, "-=1");
  });

  /* ── AP image subtle parallax ── */
  gsap.utils.toArray(".ap-media img").forEach(img => {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none",
      scrollTrigger: { trigger: img.closest(".ap-row"), start: "top bottom", end: "bottom top", scrub: 1.2 }
    });
  });

  /* ── Services ── */
  gsap.timeline({
    scrollTrigger: { trigger: ".services-grid", start: "top 78%", once: true }
  })
    .from(".service-trigger", { autoAlpha: 0, x: -20, stagger: 0.07, duration: 0.9, ease: "expo.out" })
    .from(".service-panel",   { autoAlpha: 0, y: 30, duration: 1, ease: "expo.out" }, "-=0.6");

  /* ── Feature rows: copy left, media right (or reversed) ── */
  gsap.utils.toArray(".feature-row").forEach(row => {
    const copy  = row.querySelector(".feature-copy");
    const media = row.querySelector(".feature-media");
    const isRev = row.classList.contains("feature-row-reverse");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: row, start: "top 78%", once: true }
    });
    if (copy)  tl.from(copy,  { autoAlpha: 0, x: isRev ? 40 : -40, duration: 1.1, ease: "expo.out" });
    if (media) tl.from(media, { autoAlpha: 0, x: isRev ? -40 : 40, scale: 1.04, duration: 1.1, ease: "expo.out" }, "<");
  });

  /* ── Feature image parallax ── */
  gsap.utils.toArray(".feature-media img").forEach(img => {
    gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none",
      scrollTrigger: { trigger: img.closest(".feature-row"), start: "top bottom", end: "bottom top", scrub: 1.5 }
    });
  });

  /* ── Portfolio grid: staggered reveal ── */
  gsap.from(".portfolio-card", {
    autoAlpha: 0, y: 48, stagger: { each: 0.1, from: "start" }, duration: 1.1, ease: "expo.out",
    scrollTrigger: { trigger: ".portfolio-grid", start: "top 80%", once: true }
  });

  /* ── Insight cards ── */
  gsap.from(".insight-card", {
    autoAlpha: 0, y: 40, stagger: 0.1, duration: 1, ease: "expo.out",
    scrollTrigger: { trigger: ".insight-grid", start: "top 80%", once: true }
  });

  /* ── Contact section ── */
  gsap.timeline({
    scrollTrigger: { trigger: ".contact-layout", start: "top 78%", once: true }
  })
    .from(".contact-copy",  { autoAlpha: 0, x: -40, duration: 1.1, ease: "expo.out" })
    .from(".contact-form",  { autoAlpha: 0, x:  40, duration: 1.1, ease: "expo.out" }, "<");

  /* ── Footer ── */
  gsap.from(".footer-layout > *", {
    autoAlpha: 0, y: 24, stagger: 0.12, duration: 1, ease: "expo.out",
    scrollTrigger: { trigger: ".site-footer", start: "top 95%", once: true }
  });

  /* ── Hover: portfolio cards — image zoom only, no translate ── */
  document.querySelectorAll(".portfolio-card").forEach(card => {
    const img = card.querySelector("img");
    card.addEventListener("mouseenter", () => gsap.to(img, { scale: 1.07, duration: 0.7, ease: "power2.out" }));
    card.addEventListener("mouseleave", () => gsap.to(img, { scale: 1,    duration: 0.7, ease: "power2.out" }));
  });

  /* ── Hover: insight cards — lift only ── */
  document.querySelectorAll(".insight-card").forEach(card => {
    card.addEventListener("mouseenter", () => gsap.to(card, { y: -6, duration: 0.5, ease: "power2.out" }));
    card.addEventListener("mouseleave", () => gsap.to(card, { y:  0, duration: 0.5, ease: "power2.out" }));
  });

  /* ── Magnetic CTA buttons ── */
  document.querySelectorAll(".button-primary, .hero-btn-primary, .proj-submit").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.18;
      const y = (e.clientY - r.top  - r.height / 2) * 0.18;
      gsap.to(btn, { x, y, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    });
    btn.addEventListener("mouseleave", () =>
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "expo.out", overwrite: "auto" })
    );
  });

  /* ── Ticker GSAP-driven (replaces CSS animation for sync) ── */
  const ticker = document.querySelector(".hero-ticker-track");
  if (ticker) {
    ticker.style.animation = "none";
    const w = ticker.scrollWidth / 2;
    gsap.to(ticker, { x: -w, duration: 28, repeat: -1, ease: "none" });
  }
}
