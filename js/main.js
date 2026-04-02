/* ============================================================
   VIREXA EXPORTS — JavaScript
   ============================================================ */

"use strict";

// ===== LAZY VIDEO LOADING (below-fold videos only) =====
function loadLazyVideo(videoEl) {
  const source = videoEl.querySelector("source[data-src]");
  if (!source) return;
  source.setAttribute("src", source.dataset.src);
  source.removeAttribute("data-src");
  videoEl.load();
  videoEl.play().catch(function () {});
}

// Below-fold videos: load only when scrolled into view
var lazyVideos = document.querySelectorAll("video[data-lazy]");
if (lazyVideos.length > 0 && "IntersectionObserver" in window) {
  var videoObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadLazyVideo(entry.target);
          videoObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "200px" },
  );
  lazyVideos.forEach(function (v) {
    videoObserver.observe(v);
  });
}

// ===== LANGUAGE SYSTEM =====
const translations = {};
let currentLang = localStorage.getItem("virexaLang") || "es";

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("virexaLang", lang);

  // Sincronizar el campo oculto del formulario de contacto
  const langInput = document.getElementById("form-lang");
  if (langInput) langInput.value = lang;

  // Update lang buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // Update all elements with data-es / data-en
  document.querySelectorAll("[data-es], [data-en]").forEach((el) => {
    const text = el.getAttribute(`data-${lang}`);
    if (!text) return;

    // For input placeholders
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      // handled separately if needed
      return;
    }

    // For select options
    if (el.tagName === "OPTION") {
      el.textContent = text;
      return;
    }

    // For elements with HTML content (icons inside), keep icons
    const icons = el.querySelectorAll("i");
    if (icons.length > 0) {
      // Rebuild with icon + text
      const iconHTML = Array.from(icons)
        .map((i) => i.outerHTML)
        .join("");
      el.innerHTML = iconHTML + " " + text;
    } else {
      el.innerHTML = text;
    }
  });

  // Update html lang attribute
  document.documentElement.lang = lang === "es" ? "es" : "en";

  // Update page title
  if (lang === "en") {
    document.title =
      "Virexa Exports General Trading FZCO | International Trade & Global Logistics";
  } else {
    document.title =
      "Virexa Exports General Trading FZCO | Comercio Internacional & Logística Global";
  }
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById("navbar");

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

// ===== MOBILE MENU =====
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

function toggleMenu() {
  const isOpen = navMenu.classList.toggle("open");
  hamburger.classList.toggle("active", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
}

function closeMenu() {
  navMenu.classList.remove("open");
  hamburger.classList.remove("active");
  hamburger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

// Close menu on outside click
document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target) && navMenu.classList.contains("open")) {
    closeMenu();
  }
});

// ===== ACTIVE NAV LINK ON SCROLL =====
function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('#nav-menu a[href^="#"]');
  const scrollPos = window.scrollY + 120;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById("back-to-top");

function handleBackToTop() {
  if (window.scrollY > 500) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    ".service-card, .product-card, .blog-card, .testimonial-card, .social-card, .gallery-item, .stat-item, .about-content, .about-image, .ceo-content, .ceo-video-wrap, .contact-info, .contact-form-wrap",
  );

  revealEls.forEach((el, i) => {
    el.classList.add("reveal");
    // Stagger delay based on position in parent
    const siblings = Array.from(el.parentElement.children);
    const idx = siblings.indexOf(el);
    if (idx > 0 && idx <= 4) {
      el.classList.add(`reveal-delay-${idx}`);
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  revealEls.forEach((el) => observer.observe(el));
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll(".stat-num[data-target]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target, 10);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 },
  );

  counters.forEach((el) => observer.observe(el));
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById("contact-form");
  const successMsg = document.getElementById("form-success");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Basic validation
    const required = form.querySelectorAll("[required]");
    let valid = true;

    required.forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = "#e53935";
        valid = false;
      } else {
        field.style.borderColor = "";
      }
    });

    // Email format validation
    const emailField = form.querySelector("#email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField && !emailRegex.test(emailField.value.trim())) {
      emailField.style.borderColor = "#e53935";
      valid = false;
    }

    if (!valid) return;

    // Submit button state
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.classList.add("btn--loading");
    submitBtn.innerHTML =
      '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';

    // Enviar datos al script PHP
    try {
      const formData = new FormData(form);
      formData.set("lang", currentLang);

      // Enviar el texto visible del interés según el idioma activo
      const interestSelect = form.querySelector("#interest");
      if (interestSelect && interestSelect.selectedIndex > 0) {
        const selectedOption =
          interestSelect.options[interestSelect.selectedIndex];
        const interestText =
          selectedOption.getAttribute(`data-${currentLang}`) ||
          selectedOption.textContent.trim();
        formData.set("interest", interestText);
      }

      const response = await fetch("php/sendMail.php", {
        method: "POST",
        body: formData,
      });

      let result;
      const rawText = await response.text();
      try {
        result = JSON.parse(rawText);
      } catch {
        console.error("[sendMail] Respuesta no-JSON del servidor:", rawText);
        alert("Error del servidor. Revisa la consola para más detalles.");
        return;
      }

      if (result.success) {
        form.reset();
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
        setTimeout(() => {
          successMsg.hidden = true;
        }, 6000);
      } else {
        alert(
          result.message || "No se pudo enviar el mensaje. Inténtelo de nuevo.",
        );
      }
    } catch (err) {
      console.error("[sendMail] Error de red:", err);
      alert(
        "Error de conexión. Verifique que el servidor PHP esté activo e inténtelo de nuevo.",
      );
    }

    submitBtn.disabled = false;
    submitBtn.classList.remove("btn--loading");
    submitBtn.innerHTML = originalText;
  });

  // Formateo automático del teléfono según país (libphonenumber-js)
  const phoneField = form.querySelector("#phone");
  if (phoneField && typeof libphonenumber !== "undefined") {
    phoneField.addEventListener("input", () => {
      const digits = phoneField.value.replace(/\D/g, "");
      if (!digits) {
        phoneField.value = "";
        return;
      }
      const formatted = new libphonenumber.AsYouType().input("+" + digits);
      phoneField.value = formatted.startsWith("+")
        ? formatted.slice(1)
        : formatted;
    });
    phoneField.addEventListener("keydown", (e) => {
      const allowed = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Home",
        "End",
      ];
      if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    });
  } else if (phoneField) {
    // Fallback si la librería no carga
    phoneField.addEventListener("input", () => {
      phoneField.value = phoneField.value.replace(/[^\d\s\-]/g, "");
    });
  }

  // Clear error state on input
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      field.style.borderColor = "";
    });
  });
}

// ===== GALLERY LIGHTBOX (with navigation) =====
function initGallery() {
  const items = Array.from(document.querySelectorAll(".gallery-item")).filter(
    (item) =>
      item.querySelector("img") &&
      !item.classList.contains("img-placeholder-dark"),
  );

  let currentIndex = 0;
  let overlay = null;
  let kbHandler = null;

  function getCaption(item) {
    return currentLang === "es"
      ? item.dataset.captionEs
      : item.dataset.captionEn;
  }

  function updateLightbox(index) {
    currentIndex = index;
    const item = items[index];
    const img = item.querySelector("img");
    const caption = getCaption(item);
    overlay.querySelector(".lightbox-img").src = img.src;
    overlay.querySelector(".lightbox-img").alt = img.alt;
    const cap = overlay.querySelector(".lightbox-caption");
    if (cap) cap.textContent = caption || "";
    overlay.querySelector(".lightbox-prev").style.visibility =
      index === 0 ? "hidden" : "visible";
    overlay.querySelector(".lightbox-next").style.visibility =
      index === items.length - 1 ? "hidden" : "visible";
    overlay.querySelector(".lightbox-counter").textContent =
      `${index + 1} / ${items.length}`;
  }

  function openLightbox(index) {
    const item = items[index];
    const img = item.querySelector("img");
    const caption = getCaption(item);

    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("tabindex", "-1");
    overlay.innerHTML = `
      <button class="lightbox-close" aria-label="Cerrar">✕</button>
      <button class="lightbox-prev" aria-label="Anterior">&#8592;</button>
      <div class="lightbox-inner">
        <img class="lightbox-img" src="${img.src}" alt="${img.alt}" />
      </div>
      <button class="lightbox-next" aria-label="Siguiente">&#8594;</button>
      <p class="lightbox-caption">${caption || ""}</p>
      <span class="lightbox-counter">${index + 1} / ${items.length}</span>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    overlay.focus();
    updateLightbox(index);

    const close = () => {
      overlay.remove();
      overlay = null;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", kbHandler);
    };

    overlay.querySelector(".lightbox-close").addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    overlay.querySelector(".lightbox-prev").addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentIndex > 0) updateLightbox(currentIndex - 1);
    });
    overlay.querySelector(".lightbox-next").addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentIndex < items.length - 1) updateLightbox(currentIndex + 1);
    });

    kbHandler = (e) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        if (e.key === "ArrowLeft" && currentIndex > 0)
          updateLightbox(currentIndex - 1);
        if (e.key === "ArrowRight" && currentIndex < items.length - 1)
          updateLightbox(currentIndex + 1);
      }
    };
    document.addEventListener("keydown", kbHandler);
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
    item.setAttribute("tabindex", "0");
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      items.forEach((item) => {
        if (filter === "all" || item.dataset.category === filter) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
}

// ===== FOOTER YEAR =====
function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

// ===== SMOOTH SCROLL for anchor links =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// ===== SCROLL EVENT (throttled) =====
let ticking = false;

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleNavbarScroll();
      handleBackToTop();
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }
}

// ===== LIGHTBOX STYLES (injected) =====
function injectLightboxStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .lightbox-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.92);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .lightbox-inner {
      position: relative;
      max-width: 1000px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .lightbox-inner img {
      max-width: 100%;
      max-height: 80vh;
      border-radius: 12px;
      box-shadow: 0 20px 80px rgba(0,0,0,0.5);
      object-fit: contain;
    }
    .lightbox-caption {
      color: rgba(255,255,255,0.8);
      font-size: 0.9rem;
      text-align: center;
      font-family: 'Montserrat', sans-serif;
    }
    .lightbox-close {
      position: absolute;
      top: -48px;
      right: 0;
      color: white;
      background: rgba(255,255,255,0.1);
      border: none;
      border-radius: 50%;
      width: 38px;
      height: 38px;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .lightbox-close:hover { background: rgba(201,168,76,0.8); }
    #nav-menu ul li a.active { color: #c9a84c; }
  `;
  document.head.appendChild(style);
}

// ===== INIT =====
// ===== VIDEO MODAL =====
function initVideoModal() {
  const triggers = document.querySelectorAll(".blog-video-clickable");
  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", openVideoModal);
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openVideoModal.call(trigger);
      }
    });
  });

  function openVideoModal() {
    const src = this.dataset.videoSrc;
    const overlay = document.createElement("div");
    overlay.className = "video-modal-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML = `
      <div class="video-modal-inner">
        <button class="video-modal-close" aria-label="Cerrar">✕</button>
        <video src="${src}" controls autoplay playsinline style="width:100%;max-height:80vh;outline:none;"></video>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    overlay.querySelector("video").focus();

    const close = () => {
      const vid = overlay.querySelector("video");
      vid.pause();
      overlay.remove();
      document.body.style.overflow = "";
    };

    overlay
      .querySelector(".video-modal-close")
      .addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", escHandler);
      }
    });
  }
}

// ===== GALLERY LOAD MORE =====
function initGalleryLoadMore() {
  const btn = document.getElementById("galleryLoadMore");
  if (!btn) return;

  const BATCH = 9;

  function updateButton() {
    const remaining = document.querySelectorAll(
      "#galleryGrid .gallery-hidden",
    ).length;
    btn.classList.toggle("hidden", remaining === 0);
  }

  btn.addEventListener("click", () => {
    const hidden = Array.from(
      document.querySelectorAll("#galleryGrid .gallery-hidden"),
    );
    hidden
      .slice(0, BATCH)
      .forEach((item) => item.classList.remove("gallery-hidden"));
    updateButton();
  });

  updateButton();
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  setLang(currentLang);
  initScrollReveal();
  initCounters();
  initContactForm();
  initGallery();
  initGalleryLoadMore();
  initSmoothScroll();
  injectLightboxStyles();
  initVideoModal();

  window.addEventListener("scroll", onScroll, { passive: true });

  // Expose global functions used in HTML onclick attributes
  window.setLang = setLang;
  window.toggleMenu = toggleMenu;
  window.closeMenu = closeMenu;
  window.scrollToTop = scrollToTop;
});
