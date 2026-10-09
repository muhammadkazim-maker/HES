# Hadi Education System (HES) — Redesigned Website

A complete, production-ready website for **Hadi Education System (HES)**, established in 2017 and located on Pipli Road in Balkasar, District Chakwal, Punjab, Pakistan.

The visual identity uses the supplied neutral palette: white (`#FFFFFF`), light gray (`#E5E5E5`), navy (`#14213D`), and black (`#000000`). These colors are shared across page backgrounds, navigation, buttons, cards, and forms. The current website presentation is English and light mode, with responsive navigation.

---

## 📁 Project Architecture & Deliverables

```
HES/
├── index.html              # Home Page (Hero, Trust Bar, Why Choose Us, Timeline, Video, Testimonials, CTA)
├── about.html              # About Us (Story, Vision & Mission, Core Values, Principal Message, Faculty, Milestones)
├── academics.html          # Academics (Dual-Track, Grade Tabs, Global Online LMS, Daily Schedule, Assessment)
├── facilities.html         # Facilities (Interactive Lightbox, Classrooms, Science & IT Labs, Library, Mosque, Sports)
├── admission.html          # Admissions 2026 (Roadmap, Documents Checklist, Fee Table, Online Form, FAQs)
├── contact.html            # Contact (Inquiry Form, Map Embed, Direct WhatsApp, Phone, Address, Hours)
├── assets/
│   ├── css/
│   │   └── main.css        # Unified Design System, Variables, Dark/Light Mode, RTL, Animations
│   ├── js/
│   │   ├── siteContent.js  # SINGLE Centralized Editable Content Store (English & Urdu)
│   │   └── app.js          # Global Logic (English/Light Defaults, Drawer, Counters, AI Bot, Forms)
│   └── images/             # Vector Logos, SVG Geometries, and Drop-in Photo Slots
└── README.md               # Setup, Customization, Image Swapping & Deployment Guide
```

---

## 🎨 Brand Design Tokens

| Role | Color Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary** | Navy | `#14213D` | Brand, headings, navigation, and primary surfaces |
| **Accent** | Navy | `#14213D` | Calls to action, highlights, and active states |
| **Light Surface** | White | `#FFFFFF` | Cards, forms, and content surfaces |
| **Base Light** | Light Gray | `#E5E5E5` | Light-mode page and section backgrounds |
| **Base Dark** | Black | `#000000` | Dark-mode page background and footer |
| **Dark Surface** | Navy | `#14213D` | Dark-mode cards, controls, and sections |

Display headings use **Lora** and interface text uses **DM Sans**. Arabic and Urdu use **Amiri** and **Noto Nastaliq Urdu**.

---

## 📝 How to Edit All Content in One Place

All website text, phone numbers, fee tables, statistics, testimonials, faculty members, and translations are located in **one file**:

👉 `assets/js/siteContent.js`

You can change:
1. **School Info:** `siteContent.info` (Phone, WhatsApp, Email, Address, Office Timings).
2. **Statistics:** `siteContent.stats` (Years of excellence, students enrolled, teachers, Huffaz).
3. **Faculty Members:** `siteContent.faculty` (Names, roles, bios).
4. **Fee Structure:** `siteContent.feeStructure` (Monthly fees, admission charges, annual fees).
5. **Admissions FAQs:** `siteContent.faqs` (Questions and answers in English and Urdu).
6. **AI Assistant Answers:** `siteContent.chatbotQA` (Predefined chatbot responses).

---

## 🖼️ How to Swap Image Placeholders with Real Photos

Image placeholders identify where to add real campus photos and show the recommended dimensions. To replace them:

1. Copy your photos into `assets/images/`.
2. Open the respective HTML file (e.g. `facilities.html` or `about.html`).
3. Replace the `.image-slot` div with an `<img>` tag pointing to your photo.

The school logo is saved as `assets/images/hadi-education-logo.jpg` and is used in the header, mobile navigation, and footer across all website pages. A school representative portrait is included at `assets/images/school-representative.jpg` and displayed in the homepage hero banner.

The home-page hero uses the school portrait as a full banner background. Interior page headers currently use remote Unsplash sample images, which can be replaced by updating their page-specific `.hero::before` URLs in `assets/css/main.css`.

### Image Dimensions Reference:
- **Campus Documentary Video (Home Page):** `1920x1080` (16:9 ratio) MP4
- **Smart Classrooms (`facilities.html`):** `800x600` (4:3 ratio) JPG/WebP
- **Science Laboratories (`facilities.html`):** `800x600` (4:3 ratio) JPG/WebP
- **High-Speed Computer Lab (`facilities.html`):** `800x600` (4:3 ratio) JPG/WebP
- **Islamic & Reference Library (`facilities.html`):** `800x600` (4:3 ratio) JPG/WebP
- **Campus Mosque & Hifz Sanctuary (`facilities.html`):** `800x600` (4:3 ratio) JPG/WebP
- **Sports Complex & Cricket Grounds (`facilities.html`):** `800x600` (4:3 ratio) JPG/WebP
- **Principal Muhammad Ali Hamdani (`about.html`):** `600x600` (1:1 ratio) JPG/WebP
- **Faculty Member Portraits (`about.html`):** `400x400` (1:1 ratio) JPG/WebP

---

## 🚀 How to Run Locally

You can run the website locally using Python's built-in web server:

```powershell
# Open terminal in project directory
python -m http.server 3000
```
Then visit: `http://localhost:3000` in your web browser.

---

## 🌐 Deployment Options

### Option 1: cPanel / Apache / Traditional Web Hosting
1. Compress all files in the `HES` folder into a `.zip` archive (ensure `index.html` is at the root of the zip).
2. Log in to your cPanel -> **File Manager** -> navigate to `public_html`.
3. Upload and extract the zip file.
4. Your website is live immediately at `https://www.hes.com.pk/` with zero server configuration or build steps.

### Option 2: Netlify (Free, Instant SSL)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the `HES` folder onto the page.
3. Done! Netlify assigns an instant URL and handles free SSL.

### Option 3: Vercel
1. Run `npx vercel` inside the project folder, or connect your Git repository to Vercel.
2. Set Framework Preset to **Other** (static).
3. Click **Deploy**.

---

## 📋 Assumptions & Items for You to Provide

1. **Real School Photos:** We created stylized placeholder slots with dimensions. When ready, drop campus photos into `assets/images/`. The school logo is already included there.
2. **Official Video File:** Replace the video slot on `index.html` with your official school video in MP4 format.
3. **Contact Details & WhatsApp:** We configured phone `+92 300 1234567` and address `Pipli Road, Balkasar, District Chakwal`. Update these with your real SIM numbers in `assets/js/siteContent.js`.
4. **Fee Table Adjustments:** Editable in `assets/js/siteContent.js` and `admission.html`.

---
© 2026 Hadi Education System. All rights reserved.