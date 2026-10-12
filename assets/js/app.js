/**
 * HADI EDUCATION SYSTEM (HES) — GLOBAL APPLICATION LOGIC
 * Manages the English/light presentation, sticky navbar, animated stats,
 * mobile drawer, interactive AI assistant, and form validation.
 */

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initTheme();
  initLanguage();
  initHeroTyping();
  initNavbar();
  initNavigationHover();
  initLearningPathwayCarousel();
  initCampusVideo();
  initMobileDrawer();
  initCounters();
  initAccordion();
  initTabs();
  initLightbox();
  initChatbot();
  initForms();
  initVisionMissionParallax();
  initVehicleDestinationJourney();
});

/* ==========================================================================
   0. SCROLL-TRIGGERED REVEALS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = Array.from(document.querySelectorAll(
    "main section, main h1, main h2, main h3, main h4, main h5, main h6, " +
    "main p, main ul, main ol, main li, main button, main img, main article, " +
    "main [class*='card'], main [class*='step'], main [class*='item'], " +
    "footer h1, footer h2, footer h3, footer h4, footer h5, footer h6, " +
    "footer p, footer ul, footer ol, footer li, footer img, footer article, " +
    "footer [class*='card'], footer [class*='item']"
  )).filter(element =>
    !element.closest(".vision-mission-showcase") &&
    !element.matches(".timeline-stepper-pair .timeline-step, .footer-copyright, .vm-bg-img, .vm-bg-logo, .principal-bg-img")
  );
  if (!revealElements.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!("IntersectionObserver" in window) && !reducedMotion.matches) return;

  const cardElements = revealElements.filter(element =>
    element.matches("img, article, [class*='card'], [class*='step'], [class*='item']")
  );
  const cardPositions = new Map();

  cardElements.forEach(element => {
    const siblings = cardElements.filter(sibling => sibling.parentElement === element.parentElement);
    const position = siblings.indexOf(element);
    cardPositions.set(element, position);
  });

  const staggerCounts = new Map();
  revealElements.forEach(element => {
    const parent = element.parentElement;
    if (!parent) return;

    const count = staggerCounts.get(parent) || 0;
    if (element.matches("p, ul, ol, li, button")) {
      if (!element.hasAttribute("data-delay")) {
        element.setAttribute("data-delay", String(Math.min(count * 100, 600)));
      }
      staggerCounts.set(parent, count + 1);
    }

    if (element.hasAttribute("data-delay")) {
      const delay = Number.parseInt(element.getAttribute("data-delay"), 10);
      if (Number.isFinite(delay) && delay > 0) {
        element.style.setProperty("--reveal-delay", `${Math.min(delay, 1000)}ms`);
      }
    }

    if (element.matches("img")) {
      element.classList.add("reveal-zoom");
    } else if (cardPositions.has(element)) {
      const index = cardPositions.get(element);
      element.classList.add(index % 2 === 0 ? "reveal-left" : "reveal-right");
    } else {
      element.classList.add("reveal");
    }
  });

  document.documentElement.classList.add("js", "reveal-pending");

  if (reducedMotion.matches) {
    revealElements.forEach(element => element.classList.add("is-visible"));
    document.documentElement.classList.remove("reveal-pending");
    return;
  }

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      activeObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  window.requestAnimationFrame(() => {
    document.documentElement.classList.remove("reveal-pending");
    revealElements.forEach(element => observer.observe(element));
  });
}

/* ==========================================================================
   1. DEFAULT PRESENTATION (English & Light Mode)
   ========================================================================== */
function initTheme() {
  document.documentElement.setAttribute("data-theme", "light");
}

/* ==========================================================================
   2. ENGLISH LANGUAGE
   ========================================================================== */
function initLanguage() {
  document.documentElement.setAttribute("lang", "en");
  document.documentElement.setAttribute("dir", "ltr");

  const englishElements = document.querySelectorAll("[data-en][data-ur]");
  englishElements.forEach(el => {
    el.innerHTML = el.getAttribute("data-en");
  });
}

function initHeroTyping() {
  const heading = document.querySelector("#hero-typing-title");
  if (!heading) return;

  const text = heading.textContent.trim();
  heading.setAttribute("aria-label", text);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const typeText = (element, value, characterInterval, onComplete) => {
    element.textContent = "";
    element.classList.add("is-typing");

    const startTime = performance.now();
    const typeNextCharacter = () => {
      const characterCount = Math.min(
        value.length,
        Math.floor((performance.now() - startTime) / characterInterval) + 1
      );
      element.textContent = value.slice(0, characterCount);

      if (characterCount < value.length) {
        window.setTimeout(typeNextCharacter, 30);
      } else {
        element.classList.remove("is-typing");
        if (onComplete) onComplete();
      }
    };

    typeNextCharacter();
  };

  typeText(heading, text, 65);
}

/* ==========================================================================
   3. STICKY NAVBAR ON SCROLL
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

function initNavigationHover() {
  const links = document.querySelectorAll(".navbar .nav-link");

  links.forEach(link => {
    const highlightShape = document.createElement("span");
    highlightShape.setAttribute("aria-hidden", "true");
    highlightShape.style.cssText = [
      "position:absolute",
      "z-index:-1",
      "top:50%",
      "left:50%",
      "width:130%",
      "height:150%",
      "border-radius:12px",
      "background:linear-gradient(145deg, rgba(255,255,255,.98), rgba(255,255,255,.84))",
      "opacity:0",
      "transform:translate(-50%,-50%) scale(.82)",
      "transition:opacity 260ms ease, transform 320ms ease",
      "pointer-events:none"
    ].join(";");
    link.prepend(highlightShape);

    const highlight = () => {
      highlightShape.style.opacity = "1";
      highlightShape.style.transform = "translate(-50%,-50%) scale(1)";
      link.style.setProperty("color", "#000000", "important");
    };

    const restore = () => {
      highlightShape.style.opacity = "0";
      highlightShape.style.transform = "translate(-50%,-50%) scale(.82)";
      link.style.removeProperty("color");
    };

    link.addEventListener("pointerenter", () => {
      highlight();
    });

    link.addEventListener("pointerleave", () => {
      if (!link.matches(":focus-visible")) {
        restore();
      }
    });

    link.addEventListener("focus", () => {
      highlight();
    });

    link.addEventListener("blur", () => {
      if (!link.matches(":hover")) {
        restore();
      }
    });
  });
}

function initLearningPathwayCarousel() {
  const stage = document.querySelector(".timeline-stepper-pair");
  if (!stage) return;

  const cards = Array.from(stage.querySelectorAll(".timeline-step"));
  if (cards.length !== 3) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactViewport = window.matchMedia("(max-width: 768px)");
  let activeIndex = 0;
  let intervalId;

  const updatePositions = () => {
    cards.forEach((card, index) => {
      const position = (index - activeIndex + cards.length) % cards.length;
      card.dataset.carouselPosition = ["front", "right", "left"][position];
      card.setAttribute("aria-current", position === 0 ? "true" : "false");
    });
  };

  const stopCarousel = () => {
    if (intervalId !== undefined) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
  };

  const rotationDelay = () => (compactViewport.matches ? 1300 : 2200);

  const startCarousel = () => {
    if (reducedMotion.matches || intervalId !== undefined) return;

    intervalId = window.setInterval(() => {
      activeIndex = (activeIndex + 1) % cards.length;
      updatePositions();
    }, rotationDelay());
  };

  stage.classList.add("is-carousel-ready");
  updatePositions();
  startCarousel();

  const restartCarousel = () => {
    stopCarousel();
    startCarousel();
  };

  reducedMotion.addEventListener("change", restartCarousel);
  compactViewport.addEventListener("change", restartCarousel);
}

function initCampusVideo() {
  const iframe = document.querySelector(".video-wrapper iframe");
  if (!iframe) return;

  if (!iframe.id) {
    iframe.id = "hes-campus-video";
  }

  const embedUrl = new URL(iframe.getAttribute("src"), window.location.href);
  embedUrl.searchParams.set("enablejsapi", "1");
  embedUrl.searchParams.set("origin", window.location.origin);
  iframe.setAttribute("src", embedUrl.toString());

  let player = null;

  const sendPlayerCommand = (func) => {
    if (!iframe.contentWindow) return;
    iframe.contentWindow.postMessage(JSON.stringify({
      event: "command",
      func,
      args: []
    }), "*");
  };

  const stopVideo = () => {
    if (player && typeof player.stopVideo === "function") {
      player.stopVideo();
      return;
    }
    sendPlayerCommand("pauseVideo");
    sendPlayerCommand("stopVideo");
  };

  const bindPlayer = () => {
    if (!window.YT || typeof window.YT.Player !== "function") return;
    player = new window.YT.Player(iframe.id);
  };

  if (window.YT && window.YT.Player) {
    bindPlayer();
  } else {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === "function") previousReady();
      bindPlayer();
    };
    if (!document.querySelector("script[src='https://www.youtube.com/iframe_api']")) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  }

  let lastScrollY = window.scrollY;
  let visibleRatio = 1;

  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    const scrollingUp = currentY < lastScrollY - 4;
    lastScrollY = currentY;
    if (scrollingUp && visibleRatio < 0.7) {
      stopVideo();
    }
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visibleRatio = entry.intersectionRatio;
        if (!entry.isIntersecting || visibleRatio < 0.4) {
          stopVideo();
        }
      });
    }, { threshold: [0, 0.25, 0.4, 0.7, 1] });

    observer.observe(iframe);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopVideo();
    }
  });
}

/* ==========================================================================
   4. MOBILE SLIDE-IN DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const openBtn = document.querySelector(".menu-toggle-btn");
  const closeBtn = document.querySelector(".drawer-close");
  const drawer = document.querySelector(".mobile-drawer");
  const overlay = document.querySelector(".drawer-overlay");

  if (!drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  // Close when clicking any nav link in drawer
  const drawerLinks = drawer.querySelectorAll(".drawer-link");
  drawerLinks.forEach(link => link.addEventListener("click", closeDrawer));
}

/* ==========================================================================
   5. ANIMATED TRUST COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll(".counter-number");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.getAttribute("data-target"), 10) || 0;
        const suffix = el.getAttribute("data-suffix") || "";
        animateValue(el, 0, targetValue, 1800, suffix);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

function animateValue(obj, start, end, duration, suffix) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // easeOutQuad
    const easeProgress = 1 - (1 - progress) * (1 - progress);
    const currentVal = Math.floor(easeProgress * (end - start) + start);
    obj.textContent = currentVal.toLocaleString() + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = end.toLocaleString() + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

/* ==========================================================================
   6. ACCORDION (FAQ)
   ========================================================================== */
function initAccordion() {
  const triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      const wasOpen = item.classList.contains("open");

      // Optional: close other items in the same accordion
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll(".accordion-item").forEach(other => other.classList.remove("open"));
      }

      if (!wasOpen) {
        item.classList.add("open");
      }
    });
  });
}

/* ==========================================================================
   7. TABBED INTERFACE (Academics by Grade Level)
   ========================================================================== */
function initTabs() {
  const tabContainers = document.querySelectorAll("[data-tabs]");
  tabContainers.forEach(container => {
    const btns = container.querySelectorAll(".tab-btn");
    const panels = container.querySelectorAll(".tab-content-panel");

    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-tab-target");

        btns.forEach(b => b.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const targetPanel = container.querySelector(targetId);
        if (targetPanel) targetPanel.classList.add("active");
      });
    });
  });
}

/* ==========================================================================
   8. LIGHTBOX MODAL (Facilities & Visual Highlights)
   ========================================================================== */
function initLightbox() {
  const lightboxModal = document.querySelector(".lightbox-modal");
  if (!lightboxModal) return;

  const closeBtn = lightboxModal.querySelector(".lightbox-close-btn");
  const lightboxTitle = lightboxModal.querySelector(".lightbox-title");
  const lightboxDesc = lightboxModal.querySelector(".lightbox-desc");
  const triggers = document.querySelectorAll("[data-lightbox-trigger]");

  triggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const title = trigger.getAttribute("data-title") || "Facility Highlight";
      const desc = trigger.getAttribute("data-desc") || "Campus environment and facilities at Hadi Education System.";
      
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      lightboxModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  const closeModal = () => {
    lightboxModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxModal.classList.contains("active")) {
      closeModal();
    }
  });
}

/* ==========================================================================
   9. INTERACTIVE AI ASSISTANT WIDGET ("Hadi AI Advisor")
   ========================================================================== */
function initChatbot() {
  const openBtn = document.querySelector("#open-ai-chat");
  const closeBtn = document.querySelector("#close-ai-chat");
  const chatWindow = document.querySelector("#ai-chat-window");
  const messagesBox = document.querySelector("#ai-chat-messages");
  const chatInput = document.querySelector("#ai-chat-input");
  const sendBtn = document.querySelector("#ai-chat-send");
  const quickChips = document.querySelectorAll(".quick-reply-chip");

  if (!chatWindow) return;

  const toggleChat = () => {
    chatWindow.classList.toggle("open");
    if (chatWindow.classList.contains("open")) {
      setTimeout(() => chatInput && chatInput.focus(), 150);
    }
  };

  if (openBtn) openBtn.addEventListener("click", toggleChat);
  if (closeBtn) closeBtn.addEventListener("click", () => chatWindow.classList.remove("open"));

  const appendMessage = (text, sender = "bot") => {
    if (!messagesBox) return;
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.textContent = text;
    messagesBox.appendChild(msgDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  };

  const processUserQuery = (query) => {
    const text = query.trim().toLowerCase();
    if (!text) return;

    appendMessage(query, "user");
    if (chatInput) chatInput.value = "";

    // Simulated Thinking Delay
    setTimeout(() => {
      let matchedResponse = null;
      if (window.siteContent && window.siteContent.chatbotQA) {
        for (const item of window.siteContent.chatbotQA) {
          const matched = item.triggerWords.some(keyword => text.includes(keyword));
          if (matched) {
            matchedResponse = document.documentElement.getAttribute("lang") === "ur" 
              ? item.responseUr 
              : item.responseEn;
            break;
          }
        }
      }

      if (!matchedResponse) {
        matchedResponse = document.documentElement.getAttribute("lang") === "ur"
          ? "آپ کے سوال کا شکریہ! برائے مہربانی مزید معلومات کے لیے ہمارے واٹس ایپ نمبر 0300-1234567 پر رابطہ کریں یا ہمارے کیمپس پپلی روڈ بلکسر تشریف لائیں۔"
          : "Thank you for reaching out! For detailed queries regarding this, please WhatsApp our admissions desk at +92 300 1234567 or visit our campus on Pipli Road, Balkasar.";
      }

      appendMessage(matchedResponse, "bot");
    }, 450);
  };

  if (sendBtn && chatInput) {
    sendBtn.addEventListener("click", () => processUserQuery(chatInput.value));
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") processUserQuery(chatInput.value);
    });
  }

  quickChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const prompt = chip.getAttribute("data-prompt") || chip.textContent;
      processUserQuery(prompt);
    });
  });
}

/* ==========================================================================
   10. FORMS & CLIENT-SIDE VALIDATION (Admission & Contact)
   ========================================================================== */
function initForms() {
  // Admission Form
  const admissionForm = document.querySelector("#admissionForm");
  if (admissionForm) {
    admissionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const submitBtn = admissionForm.querySelector("button[type='submit']");
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting Application...";

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        admissionForm.reset();
        
        // Show Success Feedback Modal
        const successModal = document.querySelector("#admission-success-modal");
        if (successModal) {
          successModal.classList.add("active");
        } else {
          alert("Alhamdulillah! Your admission inquiry has been received. Our administration team will contact you shortly.");
        }
      }, 1200);
    });
  }

  // Contact Form
  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending Message...";

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        contactForm.reset();
        alert("Thank you! Your message has been sent to the administration of Hadi Education System.");
      }, 900);
    });
  }

  // Success Modal Close Handlers
  const modalCloseBtns = document.querySelectorAll(".modal-close-trigger");
  modalCloseBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".lightbox-modal");
      if (modal) modal.classList.remove("active");
    });
  });
}

/* ==========================================================================
   11. VISION & MISSION PARALLAX (Desktop Only)
   ========================================================================== */
function initVisionMissionParallax() {
  const sections = document.querySelectorAll(".vision-mission-showcase, .academic-journey-section");
  if (!sections.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = window.matchMedia("(min-width: 769px)");
  if (reducedMotion.matches || !desktopQuery.matches) return;

  sections.forEach(section => {
    const bgImg = section.querySelector(".vm-bg-img, .vm-bg-logo");
    if (!bgImg) return;

    const isLogo = bgImg.classList.contains("vm-bg-logo");
    let isIntersecting = false;
    let ticking = false;

    const updateParallax = () => {
      ticking = false;
      if (!isIntersecting || !desktopQuery.matches || reducedMotion.matches) {
        bgImg.style.transform = isLogo ? "translate(-50%, -50%)" : "none";
        return;
      }
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      // Calculate relative scroll position through section (-1 to 1)
      const relativeY = (rect.top + rect.height / 2 - viewportHeight / 2) / (viewportHeight + rect.height);
      // Subtle parallax offset
      const offset = Math.max(-25, Math.min(25, relativeY * 40));
      if (isLogo) {
        bgImg.style.transform = `translate3d(-50%, calc(-50% + ${offset.toFixed(1)}px), 0)`;
      } else {
        bgImg.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      }
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && desktopQuery.matches && !reducedMotion.matches) {
            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", onScroll, { passive: true });
            updateParallax();
          } else {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            bgImg.style.transform = isLogo ? "translate(-50%, -50%)" : "none";
          }
        });
      }, {
        threshold: 0,
        rootMargin: "50px 0px 50px 0px"
      });

      observer.observe(section);
    }
  });
}

/* ==========================================================================
   12. VISION & MISSION VEHICLE & DESTINATION JOURNEY
   ========================================================================== */
function initVehicleDestinationJourney() {
  const stepsList = document.getElementById("vmStepsList");
  if (!stepsList) return;

  const stepItems = Array.from(stepsList.querySelectorAll(".vm-step-item"));
  if (!stepItems.length) return;

  const pathSolid = document.getElementById("vmPathSolid");
  const progressCur = document.getElementById("vmProgressCur");
  const progressFill = document.getElementById("vmProgressFill");
  const mobileCount = document.getElementById("vmMobileStepCount");
  const mobileFill = document.getElementById("vmMobileBarFill");
  const mobileVehicle = document.getElementById("vmMobileBarVehicle");
  const desktopTrack = document.querySelector(".vm-progress-track");
  const mobileTrack = document.querySelector(".vm-mobile-bar-track");

  let activeIndex = 0;

  const updateJourneyState = (index) => {
    activeIndex = Math.max(0, Math.min(index, stepItems.length - 1));
    const stepNumber = activeIndex + 1;
    const progressPercent = ((stepNumber / stepItems.length) * 100).toFixed(1);
    const pathPercent = activeIndex === 0 ? "0%" : activeIndex === 1 ? "50%" : "100%";

    stepItems.forEach((item, idx) => {
      item.classList.remove("completed", "active", "upcoming");
      if (idx < activeIndex) {
        item.classList.add("completed");
        item.removeAttribute("aria-current");
      } else if (idx === activeIndex) {
        item.classList.add("active");
        item.setAttribute("aria-current", "step");
      } else {
        item.classList.add("upcoming");
        item.removeAttribute("aria-current");
      }
    });

    if (pathSolid) {
      pathSolid.style.height = pathPercent;
    }

    if (progressCur) progressCur.textContent = String(stepNumber);
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
    if (desktopTrack) desktopTrack.setAttribute("aria-valuenow", String(stepNumber));

    if (mobileCount) mobileCount.textContent = String(stepNumber);
    if (mobileFill) mobileFill.style.width = `${progressPercent}%`;
    if (mobileVehicle) {
      mobileVehicle.style.left = `calc(${progressPercent}% - 7px)`;
    }
    if (mobileTrack) mobileTrack.setAttribute("aria-valuenow", String(stepNumber));
  };

  // IntersectionObserver to sync active step on scroll
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepNum = parseInt(entry.target.getAttribute("data-step"), 10) || 1;
          updateJourneyState(stepNum - 1);
        }
      });
    }, {
      root: null,
      threshold: 0.35,
      rootMargin: "-15% 0px -35% 0px"
    });

    stepItems.forEach(item => observer.observe(item));
  }

  // Click on step item or node smoothly activates that step
  stepItems.forEach((item, idx) => {
    item.addEventListener("click", () => {
      updateJourneyState(idx);
    });
  });

  // Initial step setup
  updateJourneyState(0);
}


