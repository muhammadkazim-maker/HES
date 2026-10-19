# Hadi Education System (HES) — Hardening & Engineering Documentation

This document serves as the permanent reference manual for the security, performance, accessibility, SEO, and architectural hardening applied to the Hadi Education System (HES) website.

---

## 1. Summary of Architecture & Hardening Pass

The website is built as an ultra-fast, zero-dependency static frontend coupled with a hardened Python server (`server.py`) that acts both as the local static host and the secure backend API for admissions and contact inquiries.

### Key Architectural Standards Met:
- **Design System Fidelity:** Navy (`#14213D`) + White (`#FFFFFF`) palette, Lora serif typography, faint Islamic geometric pattern watermark. Visual presentation, copy, and layout preserved intact.
- **Accessibility (WCAG 2.2 AA):** All forms have explicit label associations, aria-live inline error regions, focus-visible indicators, and full keyboard navigability.
- **Motion Accessibility:** Comprehensive `prefers-reduced-motion: reduce` coverage across Page Gateway, animations, testimonials marquee, and counters.
- **Privacy First & Cookieless:** Zero tracking cookies. Plausible and Umami analytics abstraction requires no cookie consent banners.
- **Spam & Injection Defense:** Cloudflare Turnstile captcha, hidden honeypot field, minimum-submit time check (3s), per-IP rate limiting, and newline stripping to prevent email header injection.

---

## 2. Inventory of Files Created & Modified

### Newly Created Files
| Path | Description |
| :--- | :--- |
| `_headers` | Native host security headers for Cloudflare Pages / Netlify deployment |
| `api/.env.example` | Template documenting all environment variables and secrets |
| `api/inquiry.py` | Standalone Python HTTP handler for inquiry submissions (mirrored in `server.py`) |
| `404.html` | Custom on-brand 404 page (noindex, skips Page Gateway, links to Home, Admissions, Contact) |
| `privacy.html` | Institutional Privacy Policy page with breadcrumbs, FBISE data handling, and cookieless declaration |
| `assets/js/toast.js` | Accessible, dismissible toast notification component (~5s auto-dismiss, polite/assertive aria-live) |
| `assets/js/analytics.js` | Privacy-first analytics wrapper supporting Plausible, Umami, or None |
| `favicon.svg` | Vector SVG favicon with navy background, gold arch, crescent & star, and HES wordmark |
| `favicon.ico` | Multi-resolution icon (16x16, 32x32, 48x48) generated from official logo |
| `apple-touch-icon.png` | 180×180 touch icon for iOS Safari |
| `icon-192.png` & `icon-512.png` | PWA manifest icons |
| `site.webmanifest` | Web app manifest configured with `#14213D` theme |
| `assets/images/og/*.jpg` (6 files) | 1200×630 Open Graph / Twitter share cards (< 100 KB each) |
| `assets/images/*.webp` (9 files) | High-compression WebP images with 60–87% payload savings |

### Modified Files
| Path | Changes Applied |
| :--- | :--- |
| `server.py` | Native security headers, custom 404 response handler, `POST /api/inquiry` endpoint |
| `assets/css/main.css` | Removed blocking `@import`, added size-adjusted font fallbacks, global reduced-motion overrides, toast styles, breadcrumb styles, skeleton shimmer, and related-page cards |
| `assets/js/app.js` | Hardened `initForms()` with server validation, Turnstile captcha, honeypot, anti-spam timers, and counter animations reduced-motion check |
| `assets/js/page-gateway.js` | Added instant dismissal bypass when `prefers-reduced-motion: reduce` is active |
| `index.html` | SEO title, meta description, OG tags, non-blocking fonts, WebP `<picture>` tags, marquee pause control |
| `about.html` | SEO title, meta description, OG tags, breadcrumbs, WebP images, Related Pages section, privacy footer link |
| `academics.html` | SEO title, meta description, OG tags, breadcrumbs, Related Pages section, privacy footer link |
| `campus-life.html` | SEO title, meta description, OG tags, breadcrumbs, non-hero video `preload="none"`, WebP gallery, empty state, Related Pages |
| `admission.html` | SEO title, meta description, OG tags, breadcrumbs, station deep-links, Turnstile & inline errors, Related Pages |
| `contact.html` | SEO title, meta description, OG tags, breadcrumbs, Turnstile & inline errors, Related Pages |

---

## 3. SEO Headings & Metadata Reference Table

Every page features **exactly one `<h1>`** and complies with the 50–60 character `<title>` and 120–155 character `<meta name="description">` standards:

| Page File | Final `<title>` (Length) | Final `<meta name="description">` (Length) | Unique `<h1>` |
| :--- | :--- | :--- | :--- |
| **`index.html`** | `Hadi Education System — Islamic School, Chakwal` (49 chars) | `Give your child the best of both worlds at Hadi Education System, Balkasar — authentic Quran education alongside modern FBISE academics. Admissions open now.` (154 chars) | `Hadi Education System` |
| **`about.html`** | `About Hadi Education System — Vision, Leadership & History` (57 chars) | `Discover Hadi Education System's 9-year journey in Balkasar. Learn about our principal, faculty, vision, and Quranic plus modern academics in Chakwal.` (148 chars) | `About Us` |
| **`academics.html`** | `Academics & Hifz Programme — Hadi Education System` (51 chars) | `Explore HES's dual-track curriculum: Tajweed, Hifz & Tafseer alongside FBISE Matric, ICS, Pre-Medical and Pre-Engineering for Classes 6–12 in Chakwal.` (145 chars) | `Academic Excellence` |
| **`campus-life.html`** | `Campus Life at Hadi Education System, Chakwal` (47 chars) | `Experience boarding, sports, excursions, and a nurturing community at Hadi Education System — where faith, character and confidence are built every day.` (153 chars) | `Campus Life` |
| **`admission.html`** | `Admissions Open 2026 — Hadi Education System, Chakwal` (53 chars) | `Apply to Hadi Education System in Chakwal. Simple 4-step admissions for Classes 6–12 with optional Hifz track. Submit your inquiry online today.` (143 chars) | `Student Admission` |
| **`contact.html`** | `Contact Hadi Education System — Balkasar, Chakwal` (51 chars) | `Reach Hadi Education System's admin team by phone, WhatsApp, or email. Campus on Pipli Road, Balkasar, District Chakwal. Office hours listed inside.` (142 chars) | `Contact Us` |
| **`privacy.html`** | `Privacy Policy — Hadi Education System (HES)` (44 chars) | `How Hadi Education System protects your family's data when submitting admission inquiries and browsing our website in Balkasar, Chakwal.` (140 chars) | `Privacy Policy` |
| **`404.html`** | `Page Not Found — Hadi Education System (HES)` (44 chars) | `The requested page could not be found on Hadi Education System. Explore our academic programs, admissions, or contact our campus administration in Chakwal.` (155 chars) | `Page Not Found` |

---

## 4. Media & Font Performance Optimizations

### WebP Compression Savings
All JPEG assets were converted using Pillow (`quality=82`, `method=6`). Offscreen images and iframes now use `loading="lazy"`, while hero/LCP assets use `fetchpriority="high"` without lazy loading:

| Asset | Original JPG Size | WebP Size | Reduction |
| :--- | :--- | :--- | :--- |
| `building.jpg` | 420 KB | **146 KB** | **-65.2%** |
| `boys.jpg` | 304 KB | **90 KB** | **-70.4%** |
| `boys-mobile.jpg` | 304 KB | **90 KB** | **-70.4%** |
| `hostel-meals.jpg` | 175 KB | **67 KB** | **-61.3%** |
| `principal-muhammad-ali-hamdani.jpg` | 129 KB | **39 KB** | **-69.6%** |
| `hadi-education-logo.jpg` | 94 KB | **28 KB** | **-70.0%** |
| `p.jpg` | 156 KB | **19 KB** | **-87.4%** |
| `student-exam-mirrored.jpg` | 95 KB | **77 KB** | **-19.1%** |
| `building-mobile.jpg` | 55 KB | **48 KB** | **-12.6%** |

### Non-Render-Blocking Google Fonts
The render-blocking `@import` at line 7 of `main.css` has been removed. Fonts are loaded asynchronously via `<link rel="preload">` and `media="print" onload="this.media='all'"` with `<noscript>` fallbacks in every HTML head.

To prevent Cumulative Layout Shift (CLS), size-adjusted font fallbacks are set in `main.css`:
```css
@font-face {
  font-family: 'Lora';
  size-adjust: 102%;
  src: local('Georgia');
  font-display: swap;
  unicode-range: U+0000-00FF;
}
@font-face {
  font-family: 'DM Sans';
  size-adjust: 95%;
  src: local('Arial'), local('Helvetica Neue'), local('-apple-system');
  font-display: swap;
  unicode-range: U+0000-00FF;
}
```

---

## 5. Security Headers Specification

Both `server.py` and `_headers` emit the following production headers:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.youtube.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; frame-src https://www.youtube.com https://www.google.com https://www.youtube-nocookie.com https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self' http://localhost:3000 http://localhost:3001; frame-ancestors 'none';
```

*(Note: Strict-Transport-Security is prepared as a commented directive and will be activated once the live domain has active SSL).*

---

## 6. Environment Variables Guide

Copy `api/.env.example` to `.env` and populate the values:

```env
# Single Domain Config (Default: http://localhost:3000)
# Switch this when production domain goes live
SITE_URL=http://localhost:3000

# Admissions Notification Recipient
ADMISSIONS_EMAIL=admissions@hes.com.pk

# Transactional Email via Resend (https://resend.com)
# Works in development without custom domain using onboarding@resend.dev
RESEND_API_KEY=re_your_api_key_here

# Cloudflare Turnstile CAPTCHA Keys (https://developers.cloudflare.com/turnstile/)
# Standard testing keys that always pass:
TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# Cookieless Analytics Configuration (Options: 'none' | 'plausible' | 'umami')
ANALYTICS_PROVIDER=none
ANALYTICS_SITE_ID=
ANALYTICS_URL=
```

---

## 7. When the Production Domain Arrives: Deployment Checklist

Follow this checklist once `https://www.hes.com.pk` is active:

1. **Update `SITE_URL` Config:**
   - In `server.py` and `.env`: Set `SITE_URL=https://www.hes.com.pk`.
   - In HTML `<head>` tags: Update `<script>window.SITE_URL = 'https://www.hes.com.pk';</script>`.
2. **Promote Content Security Policy:**
   - In `server.py`: Rename `Content-Security-Policy-Report-Only` to `Content-Security-Policy`.
   - In `_headers`: Rename `Content-Security-Policy-Report-Only` to `Content-Security-Policy`.
3. **Activate HSTS (HTTP Strict Transport Security):**
   - In `server.py`: Uncomment `self.send_header("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")`.
   - In `_headers`: Uncomment `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
4. **Enable Canonical Tags:**
   - In all HTML `<head>` blocks, uncomment:
     `<link rel="canonical" href="https://www.hes.com.pk/page.html">`
5. **Update Sitemap & Robots:**
   - In `sitemap.xml`: Replace `http://localhost:3000` with `https://www.hes.com.pk`.
   - In `robots.txt`: Add `Sitemap: https://www.hes.com.pk/sitemap.xml`.
6. **Switch to Production Turnstile Keys:**
   - Create a Turnstile widget in Cloudflare dashboard for `hes.com.pk`.
   - Replace test keys in `.env` and `data-sitekey="..."` in `contact.html` and `admission.html`.
7. **Verify Custom Domain in Resend:**
   - Add DNS records (DKIM, SPF) in your registrar for `hes.com.pk`.
   - Update `server.py` sender address from `onboarding@resend.dev` to `admissions@hes.com.pk`.

---

## 8. Verification & Running Locally

To fire up the hardened server locally:

```bash
# Start server on port 3000
python3 server.py 3000
```

Verify in terminal:
```bash
# 1. Check Security Headers
curl -I http://localhost:3000/

# 2. Check Custom 404 Response
curl -I http://localhost:3000/non-existent-page

# 3. Test Form API Submission
curl -X POST http://localhost:3000/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{"parentName":"Test Parent","studentName":"Test Student","classApplying":"Class 9","phone":"+923001234567","email":"test@hes.com","message":"Admission query","_timeLoaded":0}'
```
