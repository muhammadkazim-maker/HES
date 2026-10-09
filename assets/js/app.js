/**
 * HADI EDUCATION SYSTEM (HES) — GLOBAL APPLICATION LOGIC
 * Manages theme switching, bilingual toggle (RTL), sticky navbar,
 * animated stats, mobile drawer, interactive AI assistant, and form validation.
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLanguage();
  initNavbar();
  initMobileDrawer();
  initCounters();
  initAccordion();
  initTabs();
  initLightbox();
  initChatbot();
  initForms();
});

/* ==========================================================================
   1. THEME SWITCHER (Dark & Light Mode)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem("hes_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  const themeToggleBtns = document.querySelectorAll(".theme-toggle-btn");
  themeToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("hes_theme", newTheme);
      updateThemeIcon(newTheme);
    });
  });
}

function updateThemeIcon(theme) {
  const icons = document.querySelectorAll(".theme-toggle-icon");
  icons.forEach(icon => {
    icon.textContent = theme === "dark" ? "☀️" : "🌙";
  });
}

/* ==========================================================================
   2. LANGUAGE SWITCHER (English / Urdu with RTL)
   ========================================================================== */
function initLanguage() {
  const savedLang = localStorage.getItem("hes_lang") || "en";
  setLanguage(savedLang);

  const langToggleBtns = document.querySelectorAll(".lang-toggle-btn");
  langToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentLang = document.documentElement.getAttribute("lang") || "en";
      const nextLang = currentLang === "en" ? "ur" : "en";
      setLanguage(nextLang);
    });
  });
}

function setLanguage(lang) {
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "ur" ? "rtl" : "ltr");
  localStorage.setItem("hes_lang", lang);

  // Update button label
  const labelSpans = document.querySelectorAll(".lang-label");
  labelSpans.forEach(span => {
    span.textContent = lang === "ur" ? "English" : "اردو";
  });

  // Apply translations for nodes with data-i18n attributes
  const translatableElements = document.querySelectorAll("[data-en][data-ur]");
  translatableElements.forEach(el => {
    el.innerHTML = lang === "ur" ? el.getAttribute("data-ur") : el.getAttribute("data-en");
  });
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
