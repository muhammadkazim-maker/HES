# MOBILE-FIRST QA, PERFORMANCE & ACCESSIBILITY AUDIT REPORT
**Target System:** Hadi Education System (HES) — Balkasar, Chakwal  
**Audit Date:** October 19, 2026  
**Auditor:** Senior Mobile Web QA & Performance/Accessibility Engineering Specialist  
**Test Environment:** macOS Darwin, Local Static Preview Server (`server.py` on Python 3.12 / ThreadingHTTPServer)  
**Target User Persona:** Parents in Pakistan browsing on low-end to mid-range Android devices (e.g., Samsung Galaxy A03, Infinix Smart 7, Tecno Spark) and iPhones over unstable 3G / 4G cellular data connections.

---

## PAGES & ROUTES AUDITED
1. **Home:** `index.html` (`/`)
2. **About Us:** `about.html` (`/about.html`)
3. **Academics & Hifz:** `academics.html` (`/academics.html`)
4. **Admissions 2026:** `admission.html` (`/admission.html`)
5. **Campus Life:** `campus-life.html` (`/campus-life.html`)
6. **Contact Administration:** `contact.html` (`/contact.html`)
7. **Privacy Policy:** `privacy.html` (`/privacy.html`)
8. **Custom 404 Error Page:** `404.html` (`/404.html` via HTTP 404 status)
9. **Interactive Components Audited:**
   - Page Gateway Intro & Skip overlays across variants
   - Mobile Navigation Drawer (`.mobile-drawer`)
   - Toast notification engine (`assets/js/toast.js`, `#hes-toast-container`)
   - Inquiry & Admission Submission Forms (Contact & Admission pages)
   - Performance mode toggle (`#perfToggleBtn`)
   - Carousel & Accordion widgets (Campus moments, faculty profiles, learning pathways)

---

## 1. EXECUTIVE SUMMARY

### Overall Score: **68 / 100** (Grade: D+ / High Latency Mobile Risk)

### One-Paragraph Verdict
While the Hadi Education System website presents a visually disciplined, culturally resonant identity with strong typography, valid semantic meta tags, and robust server-side sanitization on forms, it is **not yet fully optimized for real parents on low-end Android smartphones on Pakistani mobile networks**. On simulated 3G/4G connections, first-time visitors face excessive Largest Contentful Paint (LCP) delays ranging from **4.9s to 8.1s**, caused by uncompressed 260 KB CSS files, render-blocking web fonts, and animated Page Gateway overlays that conceal the hero content until exit animations finish. Critical mobile UX gaps—including mobile hamburger touch targets measuring only 34×34 px, carousel controls measuring 8×8 px, the absence of direct click-to-call or WhatsApp actions in the mobile navigation drawer, missing fee structure details, and unconfigured iOS safe-area insets—threaten user conversion and accessibility for Pakistani parents with limited connectivity and modest hardware.

### Top 10 Problems Identified
1. **Excessive LCP under Cellular Throttling (4.9s – 8.1s):** The Page Gateway animation hides critical hero text (`.hero-stagger-item` has `opacity: 0`) until `gateway:done` triggers at ~900–1200ms. Combined with 260 KB uncompressed CSS and remote font stylesheets, LCP stretches to 7.5s on Home and 8.1s on Campus Life.
2. **Massive Network Payloads on Slow Mobile Connections:** Initial load transfer reaches **5.6 MB** on Home (due to eager YouTube iframe scripts) and **6.8 MB** on Campus Life (due to heavy image assets and videos), creating severe data drain on limited mobile data packages in Pakistan.
3. **Sub-Standard Primary Mobile Tap Targets (< 44×44 px):** The primary mobile hamburger menu button (`.menu-toggle-btn`) is forced via CSS `!important` to **34×34 px** at viewports $\le 768\text{px}$, and the close button (`.drawer-close`) is **26×38 px**. Timeline and faculty pagination dots are **8×8 px**, violating WCAG 2.5.5 and 2.5.8.
4. **No Quick Call or WhatsApp Actions in Mobile Drawer:** Opening the mobile navigation drawer displays page links and an "Apply" button, but completely omits telephone and WhatsApp links, requiring parents to make 3–4 extra navigation steps to reach a phone link.
5. **Missing Transparent Fee Structure Data:** Multiple pages advertise "fee structure" (e.g., Academics line 594, AI chatbot quick chip line 637), but no actual tuition, hostel, or admission fee tables exist anywhere on the site.
6. **No Gzip / Brotli Compression & Strict `no-store` Caching:** The HTTP preview server emits `Cache-Control: no-cache, no-store, must-revalidate` with zero transfer compression, forcing phones to re-download 260 KB CSS and heavy assets on every page transition.
7. **Root Font-Size Lock Overrides Device Accessibility Preferences:** `html { font-size: 16px; }` in `main.css:191` overrides the user's OS-level font scale (Android "Large/Huge text" or iOS Dynamic Type).
8. **Missing iOS / Android Safe-Area Insets:** The viewport meta tag lacks `viewport-fit=cover`, and the sticky navbar, mobile drawer, and bottom containers lack `env(safe-area-inset-*)` padding, causing overlap with home indicator bars and display cutouts.
9. **Android Hardware Back-Button Trapping in Mobile Drawer:** Opening `.mobile-drawer` locks background scrolling but does not manipulate browser history (`history.pushState`). Pressing Android's back gesture navigates off the site entirely instead of closing the drawer.
10. **Axe WCAG Violation — Label-in-Name Mismatch (`#perfToggleBtn`):** The visible text is `"Reduce animations"`, but the button specifies `aria-label="Toggle reduced animations mode"`, failing WCAG 2.5.3 Level AA for speech-to-text navigation.

### Top 5 Strengths
1. **Flawless Horizontal Responsiveness:** Zero horizontal scroll or clipping across all 8 pages across all tested viewports (320px, 360px, 390px, 412px, 768px, and 1366px).
2. **Hardened Server-Side Form Security:** `/api/inquiry` enforces strict honeypot traps, per-IP rate limiting (429 on abuse), email header injection cleansing, and regex phone/email validation.
3. **Graceful `noscript` Fallback:** All Page Gateway overlays default to `display: none;` in CSS and only mount if JS runs; `html:not(.js)` cleanly renders all hero content and timeline cards immediately.
4. **Semantic SEO Architecture:** Every audited page features strictly **one `<h1>`**, custom parent-focused titles (44–58 chars), unique meta descriptions (136–157 chars), and sub-100 KB Open Graph share images.
5. **Low Cumulative Layout Shift (CLS):** Measured CLS scores are exceptionally low (0.000 to 0.038), ensuring layout stability during asset rendering.

---

## 2. SCORECARD TABLE

| # | Quality Attribute | Score (0–5) | Key Evaluative Rationale |
|---|---|:---:|---|
| 1 | **Performance** | **2.5 / 5** | High LCP (4.9s–8.1s), uncompressed 260 KB CSS bundle, and heavy initial payloads (5.6 MB Home, 6.8 MB Campus Life). |
| 2 | **Responsiveness & Layout** | **3.8 / 5** | Excellent overflow protection at 320px, but uses legacy `100vh`, lacks safe-area insets, and locks root `font-size: 16px`. |
| 3 | **Touch & Interaction** | **2.8 / 5** | Hamburger button is 34×34 px, carousel dots are 8×8 px; drawer lacks back-button and focus trap management. |
| 4 | **Animation & Motion** | **3.5 / 5** | Snappy transitions exist, but gateway and hero staggers actively delay First Meaningful Paint / LCP for first-time visitors. |
| 5 | **Accessibility (WCAG 2.2 AA)** | **3.7 / 5** | High overall Lighthouse A11y (97–100), but fails WCAG 2.5.3 (Label in Name), WCAG 2.5.8 (Target Size), and scrollable keyboard focus. |
| 6 | **Forms & Input** | **4.3 / 5** | Excellent validation, honeypot, rate limiting, and auto-reply; lacks client-side offline draft persistence (`localStorage`). |
| 7 | **Network Resilience & Reliability** | **2.2 / 5** | No Service Worker; external Unsplash fallbacks fail offline; 3G connection interruptions yield browser network error screens. |
| 8 | **Content & UX Clarity** | **3.2 / 5** | Clear brand identity and bilingual support, but fee structure is missing, and drawer lacks click-to-call / WhatsApp shortcuts. |
| 9 | **SEO & Shareability** | **4.6 / 5** | Single H1 per page, valid meta descriptions, optimized OG images under 100 KB, clean JSON-LD structured data. |
| 10 | **Security & Privacy** | **4.2 / 5** | Strict native security headers, no client secrets, robust input sanitization; CSP remains Report-Only; HSTS commented out. |
| 11 | **Compatibility** | **4.0 / 5** | Chromium, WebKit, and Gecko compatible; full `noscript` resilience; automatic low-end device detection via `data-perf="lite"`. |
| 12 | **Code & Maintainability** | **2.7 / 5** | Monolithic 11,923-line `main.css` (260 KB), hundreds of inline styles, dead CSS rules, duplicate theme overrides. |

---

## 3. PAGE-BY-PAGE METRICS TABLE

*All metrics measured using emulated mobile viewports (360×640), 3 independent runs per profile, reporting the median value. Lighthouse simulated on Moto G Power profile.*

| Page Route | Profile 1: Slow 4G (4x CPU)<br>Median LCP / FCP / TTFB | Profile 2: Fast 3G (6x CPU)<br>Median LCP / FCP / TTFB | CLS | Total KB | JS KB | LH Perf | LH A11y | LH SEO | LH BestPrac |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Home (`/`)** | 3.74s / 3.74s / 12ms | 5.20s / 5.20s / 14ms | 0.009 | 5,603.5 | 3,640.5 | **68** | **98** | **100** | **96** |
| **About Us (`about.html`)** | 3.90s / 3.90s / 12ms | 4.66s / 4.66s / 10ms | 0.003 | 875.3 | 163.0 | **70** | **97** | **100** | **100** |
| **Academics (`academics.html`)** | 3.51s / 3.51s / 4ms | 4.05s / 4.05s / 14ms | 0.001 | 770.7 | 163.0 | **73** | **100** | **100** | **100** |
| **Admissions (`admission.html`)** | 3.63s / 3.63s / 5ms | 4.02s / 4.02s / 5ms | 0.003 | 1,219.5 | 247.7 | **67** | **98** | **100** | **100** |
| **Campus Life (`campus-life.html`)** | 4.52s / 4.52s / 10ms | 5.45s / 5.45s / 8ms | 0.038 | 6,837.8 | 163.0 | **67** | **100** | **100** | **100** |
| **Contact (`contact.html`)** | 4.14s / 4.14s / 4ms | 5.30s / 5.30s / 4ms | 0.003 | 3,050.0 | 1,976.9 | **68** | **100** | **100** | **100** |
| **Privacy (`privacy.html`)** | 3.34s / 3.34s / 4ms | 4.29s / 4.29s / 26ms | 0.010 | 772.1 | 150.4 | **76** | **98** | **100** | **100** |
| **Custom 404 (`404.html`)** | 3.33s / 3.33s / 5ms | 4.24s / 4.24s / 7ms | 0.006 | 769.0 | 150.4 | **76** | **98** | **63** | **100** |

---

## 4. FINDINGS LIST

### [FIND-01] Critical: Page Gateway & Hero Stagger Blocks Largest Contentful Paint (LCP)
- **Attribute:** Performance / Animation
- **Severity:** Critical
- **Page(s):** All inner pages and Home (`index.html`, `about.html`, `academics.html`, `admission.html`, `campus-life.html`, `contact.html`)
- **Evidence:** `assets/js/page-gateway.js:69-98` (`document.addEventListener('gateway:done', triggerHero)`) and `page-gateway.css:32-35`. In `main.css`, `.hero-stagger-item` defaults to `opacity: 0; transform: translateY(14px)`.
- **Why it matters for a mobile parent:** The parent stares at an animated gateway arch or a blank viewport while their battery and 3G data connection churn. The primary school title and value proposition remain hidden for over 4–7 seconds on low-end hardware.
- **Suggested Fix:** Render the hero heading and primary action immediately (`opacity: 1`) on mobile; let the gateway arch operate as an unobtrusive ambient background element or skip entirely on mobile viewports ($\le 768\text{px}$).
- **Effort:** M

### [FIND-02] Critical: Primary Mobile Hamburger Button Sub-Target Sizing
- **Attribute:** Touch & Interaction / Accessibility
- **Severity:** High
- **Page(s):** All pages (`index.html`, `about.html`, etc.)
- **Evidence:** `assets/css/main.css:5995-5999`:
  ```css
  @media (max-width: 768px) {
    .menu-toggle-btn {
      width: 34px !important;
      height: 34px !important;
      font-size: 1.05rem !important;
    }
  }
  ```
  Measured bounding rect: **34×34 px**.
- **Why it matters for a mobile parent:** Primary navigation is the single most important control on mobile. At 34×34 px, parents with one-handed phone grip or larger fingers frequently suffer mis-taps.
- **Suggested Fix:** Increase `.menu-toggle-btn` to minimum `44px x 44px` (or `48px x 48px`) with an expanded hit area.
- **Effort:** S

### [FIND-03] Critical: Carousel & Timeline Pagination Dots are 8×8 px
- **Attribute:** Accessibility / Touch & Interaction
- **Severity:** High
- **Page(s):** `about.html` (`.mv-dot`, `.yr-dot`, `.faculty-dot`)
- **Evidence:** Axe violation `target-size` on `about.html`: `<button class="mv-dot" data-index="1">` and `<button class="yr-dot">` have computed bounding boxes of **8×8 px**.
- **Why it matters for a mobile parent:** Fails WCAG 2.2 AA (Success Criterion 2.5.8 Target Size Minimum - 24×24 px) and WCAG AAA (44×44 px). Parents cannot reliably select specific slides or years on a phone touchscreen.
- **Suggested Fix:** Add `min-width: 24px; min-height: 24px;` with transparent hit padding (`::after` pseudo-element padding).
- **Effort:** S

### [FIND-04] High: Mobile Drawer Lacks Android Back-Button Handling
- **Attribute:** Touch & Interaction / Responsiveness
- **Severity:** High
- **Page(s):** All pages (`initMobileDrawer` in `assets/js/app.js:430-500`)
- **Evidence:** `app.js` listens to click events on `.menu-toggle-btn` and `.drawer-close`, but makes no call to `history.pushState({ drawer: 'open' })` and registers no `window.onpopstate` listener.
- **Why it matters for a mobile parent:** On Android, users instinctively swipe from the screen edge or tap the hardware back button to dismiss an overlay. Without history integration, doing so navigates the user away from the school site completely.
- **Suggested Fix:** Push a history entry when the drawer opens; close the drawer on `popstate`.
- **Effort:** S

### [FIND-05] High: Mobile Drawer Lacks Direct Phone & WhatsApp CTAs
- **Attribute:** Content & UX Clarity
- **Severity:** High
- **Page(s):** All pages (`.mobile-drawer` in all 8 HTML files)
- **Evidence:** Inspection of lines 215–245 across all HTML files reveals only text navigation links (`Home`, `About`, `Academics`, `Campus Life`, `Admission`, `Contact`) and an "Apply for Admission" button. No `<a href="tel:...">` or `<a href="https://wa.me/...">` exists inside the drawer.
- **Why it matters for a mobile parent:** In Pakistan, phone call and WhatsApp are the dominant conversion channels. Forcing a parent to navigate to the Contact page or scroll to the footer creates unnecessary friction.
- **Suggested Fix:** Add two prominent buttons at the bottom of `.mobile-drawer`: "Call Administration (+92 314 5075399)" and "Chat on WhatsApp".
- **Effort:** S

### [FIND-06] High: No Transfer Compression (Gzip / Brotli) & Overly Restrictive Caching
- **Attribute:** Performance / Network Resilience
- **Severity:** High
- **Page(s):** Global (`server.py:48-52`)
- **Evidence:** Server emits `Cache-Control: no-cache, no-store, must-revalidate` on all static assets (`assets/css/main.css`, `assets/js/app.js`, images). `curl -sI` confirms no `Content-Encoding: gzip` or `br`.
- **Why it matters for a mobile parent:** Every internal page click forces a fresh 260 KB CSS and 150 KB JS download across metered cellular networks, increasing data bills and lag.
- **Suggested Fix:** For staging/production hosting (Nginx / Netlify / Cloudflare), serve assets with Brotli/Gzip and long-term immutable cache headers (`Cache-Control: public, max-age=31536000, immutable`) paired with the existing query-string cache busters (`?v=133`).
- **Effort:** S

### [FIND-07] High: External Unsplash Fallback Images in Academic & Admission Heroes
- **Attribute:** Performance / Network Resilience
- **Severity:** High
- **Page(s):** `academics.html:230` and `admission.html:220`
- **Evidence:**
  - `academics.html:230`: `<img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1920&q=80">`
  - `admission.html:220`: `<img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80">`
- **Why it matters for a mobile parent:** Downloads an un-cached 1920px wide external image from a foreign CDN requiring extra TLS handshakes. If the parent is offline or on a restricted Pakistani ISP route, the image breaks.
- **Suggested Fix:** Replace Unsplash fallbacks with local WebP assets under 100 KB.
- **Effort:** S

### [FIND-08] Medium: WCAG Label-in-Name Mismatch on Performance Toggle Button
- **Attribute:** Accessibility
- **Severity:** Medium
- **Page(s):** All 8 pages (`.footer-bottom #perfToggleBtn`)
- **Evidence:** HTML:
  ```html
  <button type="button" class="perf-toggle-btn" id="perfToggleBtn" aria-pressed="false" aria-label="Toggle reduced animations mode">
    <span class="perf-toggle-icon" aria-hidden="true">⚡</span>
    <span class="perf-toggle-text">Reduce animations</span>
  </button>
  ```
  Axe-core automated failure: `label-content-name-mismatch`.
- **Why it matters for a mobile parent:** Speech recognition users (e.g., Android Voice Access) who say "Click Reduce animations" will experience command failure because the accessible name begins with "Toggle".
- **Suggested Fix:** Change `aria-label` to `"Reduce animations"` or remove `aria-label` entirely and allow the visible text to serve as the accessible name.
- **Effort:** S

### [FIND-09] Medium: Absence of Safe-Area Inset Handling and `viewport-fit=cover`
- **Attribute:** Responsiveness & Layout
- **Severity:** Medium
- **Page(s):** Global (`<head>` and `assets/css/main.css`)
- **Evidence:** Viewport meta is `<meta name="viewport" content="width=device-width, initial-scale=1.0">`. Grep reveals `env(safe-area-inset-*)` only exists in `page-gateway.css` for `.gw-skip`.
- **Why it matters for a mobile parent:** On modern Android devices with pill gesture navigation bars and iPhones with Home indicators or Dynamic Islands, fixed bottom CTAs or toasts risk being occluded by native OS chrome.
- **Suggested Fix:** Add `viewport-fit=cover` to meta viewport and apply `padding-bottom: env(safe-area-inset-bottom)` to fixed containers.
- **Effort:** S

### [FIND-10] Medium: Root Font-Size Lock (`html { font-size: 16px; }`)
- **Attribute:** Responsiveness / Accessibility
- **Severity:** Medium
- **Page(s):** Global (`assets/css/main.css:191`)
- **Evidence:** `html { font-size: 16px; ... }` hardcodes the base rem conversion ratio.
- **Why it matters for a mobile parent:** Parents with vision impairment who increase their operating system font size to 120% or 140% will find that rem-based typography fails to scale up.
- **Suggested Fix:** Replace `font-size: 16px;` with `font-size: 100%;` in `main.css:191`.
- **Effort:** S

### [FIND-11] Medium: Missing Fee Structure Transparency
- **Attribute:** Content & UX Clarity
- **Severity:** Medium
- **Page(s):** `academics.html`, `admission.html`, `index.html`
- **Evidence:** Academics line 594 promises "Step-by-step admissions, eligibility criteria, and fee structure." Link navigates to `admission.html`. On `admission.html`, only a 4-step process and merit waiver mention exist; no tuition fee table or fee ranges are published.
- **Why it matters for a mobile parent:** Pakistani parents evaluating private Islamic schools prioritize fee affordability. Not finding transparent numbers leads to immediate drop-off.
- **Suggested Fix:** Add a clean, mobile-responsive fee breakdown table or downloadable PDF link on `admission.html`.
- **Effort:** M

### [FIND-12] Medium: Unfocused Scrollable Spaces Track on Campus Life
- **Attribute:** Accessibility
- **Severity:** Medium
- **Page(s):** `campus-life.html`
- **Evidence:** Axe violation `scrollable-region-focusable`: `<div class="cl-spaces-track-viewport" id="clSpacesViewport">` has scrollable overflow without `tabindex="0"`.
- **Why it matters for a mobile parent:** Keyboard or switch-device users cannot scroll through the facility photos horizontally.
- **Suggested Fix:** Add `tabindex="0"` and an `aria-label="Campus spaces gallery"`.
- **Effort:** S

### [FIND-13] Low: Monolithic CSS Architecture (11,923 Lines, 260 KB)
- **Attribute:** Code & Maintainability
- **Severity:** Low
- **Page(s):** Global (`assets/css/main.css`)
- **Evidence:** File contains 11,923 lines with legacy overrides, unused theme rules (`.floating-actions`), and repeated media query blocks.
- **Why it matters for a mobile parent:** Increases CSS parser evaluation time on budget low-memory phone chipsets (MediaTek Helio / Snapdragon 400 series).
- **Suggested Fix:** Run PurgeCSS during build step to strip unreferenced classes and split into critical above-the-fold CSS vs deferred.
- **Effort:** L

---

## 5. WHAT WORKS WELL
- **Zero Horizontal Overflow:** Rigorous layout checks across 320px, 360px, 390px, 412px, 768px, and 1366px show 0 horizontal overflow defects.
- **Form Hardening:** Honeypot field silently discards bot submissions; rate limiting prevents flood attacks; strict sanitization blocks HTML/header injection.
- **No Client Secrets:** Audit confirmed no API keys, private tokens, or admissions credentials are leaked in client-side bundles.
- **Bilingual Ur/En Architecture:** Consistent `data-en` and `data-ur` attributes enable instantaneous in-memory language switching without page reloads.
- **Accessible Toast Component:** Employs `role="status"` and `role="alert"` with live region announcements and auto-dismiss keyboard listeners.
- **True HTTP 404 Status:** The server serves `404.html` with a legitimate 404 response status and `noindex, nofollow` headers.

---

## 6. NOT VERIFIED
1. **Cloudflare Turnstile Captcha Production Verification:** Verified with staging test credentials (`1x00000000000000000000AA`). Live production site verify requires the live domain and production keys.
2. **Resend Email Delivery to Real Admissions Inbox:** Staging server uses dummy credentials (`re_your_key_here`). Email delivery to `admissions@hes.com.pk` cannot be confirmed until an active Resend API key is provisioned.
3. **Real Cellular Packet Drop Rates:** Tested using emulated network throttling profiles; physical packet loss and cell tower handoff jitter must be verified with on-site Pakistani SIMs (Jazz/Zong/Telenor).
4. **Third-Party Video Player Frame Drops on Physical Mali GPUs:** Emulated on headless desktop Chromium with CPU throttling; physical low-end Android GPU memory exhaustion must be field-tested.

---

## 7. MANUAL TEST CHECKLIST FOR REAL DEVICES

### On Budget Android (e.g. Samsung Galaxy A03 / Infinix / Tecno with Chrome):
- [ ] **Android Back Gesture:** Open the mobile navigation drawer. Swipe from the left screen edge. Verify whether the drawer closes or the browser navigates back to the previous website.
- [ ] **Data Saver Mode:** Turn on "Data Saver" in Android settings. Load Home. Verify whether `data-perf="lite"` activates automatically and suppresses heavy animations.
- [ ] **Menu Button Tap Accuracy:** Try tapping the hamburger menu button with your thumb while walking or holding the phone with one hand.
- [ ] **Form Input & Keyboard Resize:** Tap into the "Phone" field on `admission.html`. Verify that numeric keypad opens (`tel` inputmode) and the viewport does not distort or break layout when the virtual keyboard pops up.
- [ ] **Audio/Video Playback:** Tap the YouTube campus video on Home. Verify that audio plays cleanly without locking up the UI thread.

### On iPhone (e.g. iPhone 13/14/15 Safari):
- [ ] **Safe Area Collision:** Scroll to the very bottom of the page in portrait. Verify that the footer copyright and performance toggle are not covered by the iOS Home bar indicator.
- [ ] **Landscape Notch:** Rotate the phone to landscape mode. Verify that text on the left is not clipped by the camera notch / Dynamic Island.
- [ ] **Form Auto-Zoom:** Tap into each text input field. Verify Safari does NOT force-zoom the page (requires font size $\ge 16\text{px}$).

---

## 8. RAW DATA APPENDIX

### 1. Lighthouse Scores & Core Metrics Summary (Mobile Moto G Power Emulation)
| Page | Perf | A11y | SEO | BestPrac | FCP | LCP | TBT | CLS | Speed Index |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `index.html` | 68 | 98 | 100 | 96 | 3.6s | 7.5s | 0ms | 0.009 | 4.8s |
| `about.html` | 70 | 97 | 100 | 100 | 3.5s | 6.0s | 100ms | 0.003 | 4.5s |
| `academics.html` | 73 | 100 | 100 | 100 | 3.3s | 5.6s | 20ms | 0.001 | 4.2s |
| `admission.html` | 67 | 98 | 100 | 100 | 2.6s | 7.1s | 270ms | 0.003 | 4.3s |
| `campus-life.html` | 67 | 100 | 100 | 100 | 3.5s | 8.1s | 110ms | 0.038 | 5.1s |
| `contact.html` | 68 | 100 | 100 | 100 | 3.0s | 7.1s | 200ms | 0.003 | 4.6s |
| `privacy.html` | 76 | 98 | 100 | 100 | 3.2s | 4.9s | 80ms | 0.010 | 3.9s |
| `404.html` | 76 | 98 | 63 | 100 | 3.2s | 4.9s | 70ms | 0.006 | 3.8s |

### 2. Network Payload Breakdown
| Resource Category | Home | About | Academics | Admission | Campus Life | Contact | Privacy | 404 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **HTML** | 38.7 KB | 49.5 KB | 38.4 KB | 45.4 KB | 61.8 KB | 30.3 KB | 15.9 KB | 14.0 KB |
| **CSS** | 838.2 KB | 300.7 KB | 300.7 KB | 300.7 KB | 300.7 KB | 383.1 KB | 300.7 KB | 300.7 KB |
| **JavaScript** | 3,640.5 KB | 163.0 KB | 163.0 KB | 247.7 KB | 163.0 KB | 1,976.9 KB | 150.4 KB | 150.4 KB |
| **Images** | 793.6 KB | 229.2 KB | 135.4 KB | 219.2 KB | 2,042.1 KB | 258.6 KB | 216.8 KB | 216.8 KB |
| **Fonts** | 129.7 KB | 118.4 KB | 118.4 KB | 118.4 KB | 118.4 KB | 118.4 KB | 73.0 KB | 73.0 KB |
| **Media (Video)** | 0.0 KB | 0.0 KB | 0.0 KB | 0.0 KB | 4,280.0 KB | 0.0 KB | 0.0 KB | 0.0 KB |
| **Total Transfer**| **5,603.5 KB** | **875.3 KB** | **770.7 KB** | **1,219.5 KB** | **6,837.8 KB** | **3,050.0 KB** | **772.1 KB** | **769.0 KB** |

### 3. Key Failing Tap Targets on Mobile (360×640 Viewport)
| Selector / Identifier | Dimensions | Location / File | WCAG Criterion |
|---|:---:|---|---|
| `.menu-toggle-btn` | 34×34 px | Header Navbar (All pages) | WCAG 2.5.5 / 2.5.8 |
| `.drawer-close` | 26×38 px | Mobile Drawer (All pages) | WCAG 2.5.5 / 2.5.8 |
| `.header-cta` ("Apply Now") | 110×36 px | Header Navbar (All pages) | WCAG 2.5.5 / 2.5.8 |
| `.social-btn` (Facebook, YT, Email) | 40×40 px | Footer (All pages) | WCAG 2.5.5 / 2.5.8 |
| `.mv-dot` | 8×8 px | Mission Carousel (`about.html`) | WCAG 2.5.8 Level AA |
| `.faculty-dot` | 8×8 px | Faculty Carousel (`about.html`) | WCAG 2.5.8 Level AA |
| `.yr-dot` | 8×8 px | Journey Timeline (`about.html`) | WCAG 2.5.8 Level AA |
| `.bd-segment` | 36×54 px | Day in Life (`academics.html`) | WCAG 2.5.8 Level AA |
| `#perfToggleBtn` | 148×32 px | Footer Bottom (All pages) | WCAG 2.5.5 / 2.5.8 |

---
*Report generated and cross-verified via automated Chrome CDP, Lighthouse, Axe-Core, and Python test suites. All visual artifacts and raw audits archived in `audit-artifacts/`.*
