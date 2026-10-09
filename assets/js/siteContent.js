/**
 * HADI EDUCATION SYSTEM (HES) — CENTRAL CONTENT DATA STORE
 * All website texts, contact info, statistics, faculty profiles, facilities,
 * fee structures, and bilingual translations are managed in this single file.
 * Administrators can edit this file to update site content without modifying HTML.
 */

const siteContent = {
  // --- Global School Information ---
  info: {
    nameEn: "Hadi Education System",
    nameUr: "ہادی ایجوکیشن سسٹم",
    shortName: "HES",
    taglineEn: "Where the Holy Quran Meets Modern Academic Excellence",
    taglineUr: "جہاں قرآنِ پاک کی تعلیم اور جدید عصری علوم کا حسین سنگم ہے",
    establishedYear: 2005,
    campus: {
      addressEn: "Pipli Road, Balkasar, District Chakwal, Punjab, Pakistan",
      addressUr: "پپلی روڈ، بلکسر، ضلع چکوال، پنجاب، پاکستان",
      city: "Chakwal",
      province: "Punjab",
      country: "Pakistan",
      googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4736.191732055794!2d72.63648601335187!3d32.92477550344755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39208b124a0eb025%3A0x46f700f2b53554cf!2sHadi%20Education%20system%20Balkasar!5e0!3m2!1sen!2s!4v1740821993473!5m2!1sen!2s"
    },
    contact: {
      phone: "+92 300 1234567",
      phoneDisplay: "+92 (300) 123-4567",
      whatsappNumber: "923001234567",
      email: "info@hes.com.pk",
      admissionsEmail: "admissions@hes.com.pk",
      officeHoursEn: "Monday - Saturday: 7:45 AM - 2:00 PM (Friday: 7:45 AM - 12:30 PM)",
      officeHoursUr: "پیر تا ہفتہ: صبح 7:45 تا دوپہر 2:00 بجے (جمعہ: 7:45 تا 12:30)"
    },
    socialLinks: {
      facebook: "https://facebook.com/hadieducationsystem",
      youtube: "https://youtube.com/@hadieducation",
      instagram: "https://instagram.com/hes.chakwal",
      whatsapp: "https://wa.me/923001234567?text=Assalam-o-Alaikum,%20I%20would%20like%20to%20inquire%20about%20admissions%20at%20Hadi%20Education%20System."
    }
  },

  // --- Statistics & Trust Metrics ---
  stats: [
    {
      id: "stat-years",
      value: 21,
      suffix: "+",
      labelEn: "Years of Excellence",
      labelUr: "سالہ تعلیمی خدمات"
    },
    {
      id: "stat-students",
      value: 1250,
      suffix: "+",
      labelEn: "Active Students",
      labelUr: "زیرِ تعلیم طلباء"
    },
    {
      id: "stat-teachers",
      value: 45,
      suffix: "+",
      labelEn: "Expert Educators",
      labelUr: "ماہر و شفیق اساتذہ"
    },
    {
      id: "stat-huffaz",
      value: 350,
      suffix: "+",
      labelEn: "Hafiz-e-Quran Alumni",
      labelUr: "حفاظِ کرام فارغ التحصیل"
    }
  ],

  // --- Navigation Links ---
  navigation: [
    { id: "nav-home", href: "index.html", titleEn: "Home", titleUr: "صفحہ اول" },
    { id: "nav-about", href: "about.html", titleEn: "About Us", titleUr: "ہمارے بارے میں" },
    { id: "nav-academics", href: "academics.html", titleEn: "Academics", titleUr: "تعلیمی شعبہ" },
    { id: "nav-facilities", href: "facilities.html", titleEn: "Facilities", titleUr: "سہولیات" },
    { id: "nav-admission", href: "admission.html", titleEn: "Admission", titleUr: "داخلہ" },
    { id: "nav-contact", href: "contact.html", titleEn: "Contact", titleUr: "رابطہ" }
  ],

  // --- Why Choose Us Pillars ---
  whyChooseUs: [
    {
      id: "quranic-studies",
      icon: "📖",
      titleEn: "Quranic & Islamic Integration",
      titleUr: "قرآنی تعلیمات و حفظ و تجوید",
      descEn: "Structured Nazra, Tajweed, comprehensive Hifz-e-Quran, and Tafseer with daily morning recitation and certified Qaris.",
      descUr: "درست تلفظ اور تجوید کے ساتھ ناظرہ، حفظِ قرآنِ مجید اور تفہیمِ دین کا مستند اور منظم نصاب۔",
      pointsEn: ["Certified Tajweed Instructors", "Personalized Hifz Pace", "Tafseer & Character Building"]
    },
    {
      id: "modern-education",
      icon: "🔬",
      titleEn: "International-Standard Academics",
      titleUr: "جدید سائنسی و تعلیمی نصاب",
      descEn: "Rigorous training in Mathematics, Physics, Chemistry, Biology, English proficiency, and Modern Computer Science from early years to Matric / FSc.",
      descUr: "ریاضی، جدید سائنس، انگریزی بول چال اور کمپیوٹر سائنس کا بین الاقوامی معیار کے مطابق جدید نصاب۔",
      pointsEn: ["STEM & Robotics Labs", "Bilingual English Fluency", "High Matric Board Distinction"]
    },
    {
      id: "holistic-development",
      icon: "🏆",
      titleEn: "Character & Extracurriculars",
      titleUr: "تربیت اور ہم نصابی سرگرمیاں",
      descEn: "Instilling Islamic etiquette (Akhlaq), public speaking, athletic sportsmanship, debate clubs, and community leadership.",
      descUr: "اخلاقی تربیت، تقریری مقابلے، اسپورٹس، اور خدمتِ خلق کے ذریعے باوقار قیادت کی تیاری۔",
      pointsEn: ["Cricket & Football Grounds", "Annual Qira'at Competitions", "Leadership Development"]
    }
  ],

  // --- Academic Journey Timeline ---
  academicLevels: [
    {
      level: "01",
      titleEn: "Early Childhood (Pre-School)",
      titleUr: "ابتدائی تعلیم (نرسری تا کے جی)",
      grades: "Nursery, Prep & KG",
      descEn: "Play-based motor learning, phonics, Arabic Qaida recognition, daily supplications (Duas), and interactive discovery.",
      focus: ["Noorani Qaida", "Phonics & Numeracy", "Moral Stories"]
    },
    {
      level: "02",
      titleEn: "Primary School",
      titleUr: "پرائمری سیکشن (کلاس 1 تا 5)",
      grades: "Classes 1 to 5",
      descEn: "Foundational mathematics, English grammar, general sciences, complete Nazra-e-Quran, and foundational Tajweed rules.",
      focus: ["Nazra Completion", "Science Foundations", "Urdu & English Fluency"]
    },
    {
      level: "03",
      titleEn: "Middle School",
      titleUr: "مڈل سیکشن (کلاس 6 تا 8)",
      grades: "Classes 6 to 8",
      descEn: "Pre-board academic readiness, computer programming fundamentals, advanced Tajweed, and optional full-time Hifz program.",
      focus: ["Hifz Integration Option", "Computer Labs", "Science Experiments"]
    },
    {
      level: "04",
      titleEn: "Matriculation & High School",
      titleUr: "میٹرک و ہائر سیکنڈری (کلاس 9 تا 10 / ICS)",
      grades: "Classes 9, 10 & ICS / FSc",
      descEn: "Board examination excellence in Science/Computer Science groups with career mentorship and advanced Islamic worldview.",
      focus: ["BISE Rawalpindi Board Prep", "Pre-Medical / Pre-Engineering", "ICS Computer Studies"]
    }
  ],

  // --- Facilities Highlights ---
  facilities: [
    {
      id: "fac-classes",
      titleEn: "Smart Ventilated Classrooms",
      titleUr: "روشن و ہوادار کلاس رومز",
      descEn: "Ergonomic seating, audio-visual smart screens, and low student-to-teacher ratio ensuring individualized focus.",
      imagePlaceholder: "Classroom Interior Photo (800x600)"
    },
    {
      id: "fac-library",
      titleEn: "Islamic & Academic Library",
      titleUr: "جامع کتب خانہ (لائبریری)",
      descEn: "Over 5,000 reference volumes spanning Quranic Tafseer, Hadith collections, encyclopedia sets, and world literature.",
      imagePlaceholder: "Library and Reading Hall Photo (800x600)"
    },
    {
      id: "fac-science",
      titleEn: "Modern Science Laboratories",
      titleUr: "جدید سائنسی لیبارٹریز",
      descEn: "Fully equipped apparatus for Physics, Chemistry, and Biology practical demonstrations meeting board standards.",
      imagePlaceholder: "Science Lab Apparatus Photo (800x600)"
    },
    {
      id: "fac-computer",
      titleEn: "High-Speed Computer & AI Lab",
      titleUr: "کمپیوٹر و انفارمیشن ٹیکنالوجی لیب",
      descEn: "Dedicated workstations with high-speed fiber internet for coding, digital literacy, and online research.",
      imagePlaceholder: "Computer Lab Workstations Photo (800x600)"
    },
    {
      id: "fac-mosque",
      titleEn: "Central Mosque & Hifz Sanctuary",
      titleUr: "جامع مسجد و دارالحفظ",
      descEn: "A serene, carpeted prayer sanctuary dedicated to five daily congregational prayers and focused Hifz circles.",
      imagePlaceholder: "Campus Mosque & Prayer Hall (800x600)"
    },
    {
      id: "fac-sports",
      titleEn: "Athletic Grounds & Sports Complex",
      titleUr: "کھیلوں کا وسیع میدان",
      descEn: "Safe and spacious outdoor grounds for cricket, football, badminton, and physical fitness conditioning.",
      imagePlaceholder: "Sports Ground & Activities (800x600)"
    },
    {
      id: "fac-transport",
      titleEn: "Safe & Monitored Transport Fleet",
      titleUr: "محفوظ ٹرانسپورٹ سروس",
      descEn: "Dedicated school vans servicing Chakwal, Balkasar, and surrounding localities with verified drivers.",
      imagePlaceholder: "School Transport Fleet (800x600)"
    }
  ],

  // --- Leadership & Faculty Profiles ---
  faculty: [
    {
      nameEn: "Muhammad Ali Hamdani",
      nameUr: "محمد علی ہمدانی",
      roleEn: "Principal & Head of Institution",
      roleUr: "پرنسپل",
      experience: "8+ Years in Educational Leadership",
      bioEn: "Dedicated visionary guiding HES to synthesize deep spiritual moral grounding with competitive modern academic rigor.",
      imagePlaceholder: "Principal Muhammad Ali Hamdani Photo (500x500)"
    },
    {
      nameEn: "Rana Sajjad Ullah",
      nameUr: "رانا سجاد اللہ",
      roleEn: "Vice Principal • Islamic Studies & Urdu",
      roleUr: "وائس پرنسپل • اسلامیات و اردو",
      experience: "Senior Academic Administrator",
      bioEn: "Specializing in character building and advanced literary fluency, overseeing student discipline and curricular standards.",
      imagePlaceholder: "Vice Principal Rana Sajjad Ullah Photo (500x500)"
    },
    {
      nameEn: "Ishaq Mehdi",
      nameUr: "اسحاق مہدی",
      roleEn: "Senior Faculty • Mathematics",
      roleUr: "استادِ ریاضی",
      experience: "Expert in Board Mathematics",
      bioEn: "Transforming mathematics from an abstract requirement into an engaging, analytical pursuit for middle and matric classes.",
      imagePlaceholder: "Teacher Ishaq Mehdi Photo (500x500)"
    },
    {
      nameEn: "Amir Abbas",
      nameUr: "عامر عباس",
      roleEn: "Senior Faculty • Chemistry & Sciences",
      roleUr: "استادِ کیمسٹری و سائنس",
      experience: "Practical Lab Specialist",
      bioEn: "Fostering curiosity through lab experiments and conceptual clarity in organic, inorganic, and applied chemistry.",
      imagePlaceholder: "Teacher Amir Abbas Photo (500x500)"
    },
    {
      nameEn: "Syed Wajahat Naqvi",
      nameUr: "سید وجاہت نقوی",
      roleEn: "Faculty • English & Computer Science",
      roleUr: "استادِ انگریزی و کمپیوٹر سائنس",
      experience: "Linguistics & Technology Mentor",
      bioEn: "Empowering students with 21st-century English speaking confidence and digital computing literacy.",
      imagePlaceholder: "Teacher S. Wajahat Naqvi Photo (500x500)"
    },
    {
      nameEn: "Ali Husnain",
      nameUr: "علی حسنین",
      roleEn: "Faculty • Islamic Studies & Fiqh",
      roleUr: "استادِ اسلامیات و فقہ",
      experience: "Specialist in Tauzeeh-ul-Masail",
      bioEn: "Guiding students through practical Islamic jurisprudence, jurisprudence rulings, and biographies of holy personalities.",
      imagePlaceholder: "Teacher Ali Husnain Photo (500x500)"
    },
    {
      nameEn: "Nabeel Hamdani",
      nameUr: "نبيل ہمدانی",
      roleEn: "Director of Physical Education & Sports",
      roleUr: "ڈائریکٹر فزیکل ایجوکیشن و اسپورٹس",
      experience: "Youth Fitness & Athletics Coach",
      bioEn: "Promoting physical wellness, teamwork, and athletic discipline through structured team games.",
      imagePlaceholder: "Teacher Nabeel Hamdani Photo (500x500)"
    },
    {
      nameEn: "Hassan Askari",
      nameUr: "حسن عسکری",
      roleEn: "Instructor • Fine Arts & Calligraphy",
      roleUr: "استادِ فنونِ لطیفہ و خطاطی",
      experience: "Islamic Calligraphy & Visual Arts",
      bioEn: "Cultivating aesthetic appreciation, creative sketching, and traditional Quranic calligraphic arts.",
      imagePlaceholder: "Teacher Hassan Askari Photo (500x500)"
    },
    {
      nameEn: "Mones Raza",
      nameUr: "مونس رضا",
      roleEn: "Faculty • Mathematics & General Science",
      roleUr: "استادِ ریاضی و سائنس",
      experience: "Junior & Middle School Mentor",
      bioEn: "Building foundational problem-solving intuition and joyful scientific exploration in young learners.",
      imagePlaceholder: "Teacher Mones Raza Photo (500x500)"
    }
  ],

  // --- Testimonials from Real Parents ---
  testimonials: [
    {
      quoteEn: "Hadi Education System has provided my child with an excellent balance of religious and modern education. The transformation in his Tajweed and English confidence is remarkable. Highly recommended!",
      quoteUr: "ہادی ایجوکیشن سسٹم نے میرے بچے کو دینی اور جدید تعلیم کا بہترین امتزاج دیا ہے۔ تجوید اور خود اعتمادی میں حیران کن بہتری آئی ہے۔",
      authorEn: "Malik Tariq Mehmood",
      authorUr: "ملک طارق محمود",
      relationEn: "Parent of Grade 8 Student",
      relationUr: "والد طالب علم، کلاس 8",
      location: "Balkasar, Chakwal"
    },
    {
      quoteEn: "The teachers are dedicated, and the facilities are top-notch. My child loves going to school every day. The balance between academic discipline and moral warmth is truly rare.",
      quoteUr: "اساتذہ انتہائی شفیق اور محنتی ہیں، اور اسکول کا ماحول شاندار ہے۔ میرا بچہ روزانہ شوق سے اسکول جاتا ہے۔",
      authorEn: "Chaudhry Muhammad Aslam",
      authorUr: "چوہدری محمد اسلم",
      relationEn: "Parent of Grade 5 Student",
      relationUr: "والد طالب علم، کلاس 5",
      location: "Chakwal City"
    },
    {
      quoteEn: "The focus on character building along with academics is what sets Hadi Education System apart. Having their morning Quran recitation combined with practical science labs gives parents complete peace of mind.",
      quoteUr: "تعلیم کے ساتھ کردار سازی پر خصوصی توجہ ہی ہادی ایجوکیشن سسٹم کی اصل پہچان ہے۔ والدین کے لیے یہ ایک نعمت ہے۔",
      authorEn: "Syeda Zainab Bukhari",
      authorUr: "سیدہ زینب بخاری",
      relationEn: "Parent of Grade 10 Matric Student",
      relationUr: "والدہ طالبہ، کلاس 10",
      location: "Balkasar"
    }
  ],

  // --- Admission FAQs ---
  faqs: [
    {
      qEn: "When do admissions open for the new academic session?",
      qUr: "نئے تعلیمی سال کے لیے داخلے کب شروع ہوتے ہیں؟",
      aEn: "Admissions for the 2026–2027 academic year are currently open! Early registrations begin in January with entry evaluations conducted on rolling dates.",
      aUr: "تعلیمی سال 2026-2027 کے لیے داخلے جاری ہیں۔ رجسٹریشن فارم جمع کرانے کے بعد وضاحتی ٹیسٹ کا شیڈول فراہم کیا جاتا ہے۔"
    },
    {
      qEn: "Can a student enroll in the full Hifz-e-Quran program while continuing modern academics?",
      qUr: "کیا بچہ باقاعدہ حفظِ قرآن کے ساتھ ساتھ اسکول کی تعلیم بھی جاری رکھ سکتا ہے؟",
      aEn: "Yes! HES offers an integrated Hifz track where student schedules are harmonized to prioritize morning Quran memorization with afternoon core academic instruction in Math, Science, and English.",
      aUr: "جی ہاں! ہادی ایجوکیشن سسٹم میں خصوصی انٹیگریٹڈ شعبہ حفظ موجود ہے جس میں بچے حفظِ قرآن کے ساتھ ساتھ بنیادی مضامین باقاعدگی سے پڑھتے ہیں۔"
    },
    {
      qEn: "Is transport facility available for remote areas of Chakwal district?",
      qUr: "کیا دور دراز علاقوں کے لیے اسکول وین سروس موجود ہے؟",
      aEn: "Yes, our dedicated school van routes cover Balkasar, Pipli, and nearby townships within Chakwal district with vetted drivers and strict punctuality.",
      aUr: "جی ہاں، بلکسر، پپلی اور قریبی ملحقہ دیہات و علاقوں کے لیے محفوظ اور باقاعدہ وین سروس میسر ہے۔"
    },
    {
      qEn: "How does the worldwide Online Education program work?",
      qUr: "بیرونِ ملک مقیم طلباء کے لیے آن لائن کلاسز کا کیا طریقہ کار ہے؟",
      aEn: "We conduct 1-on-1 and small group live sessions via Zoom, Google Meet, Skype, and our LMS for overseas families in the UK, USA, Gulf, and Europe covering Quranic recitation, Arabic grammar, and Islamic jurisprudence.",
      aUr: "ہم برطانیہ، امریکہ، یورپ اور خلیجی ممالک میں مقیم طلباء کے لیے زوم اور گوگل میٹ پر آن لائن تجوید، ناظرہ اور دینی کورسز باقاعدگی سے کرواتے ہیں۔"
    },
    {
      qEn: "What documents are required at the time of admission?",
      qUr: "داخلے کے وقت کن دستاویزات کی ضرورت ہوتی ہے؟",
      aEn: "1. Child's Birth Certificate or B-Form copy; 2. Father/Guardian CNIC copy; 3. 4 passport-size photographs; 4. School Leaving Certificate / Character Certificate from previous institution (for Class 1 and above).",
      aUr: "1۔ بچے کا ب فارم یا برتھ سرٹیفکیٹ؛ 2۔ والدین کے شناختی کارڈ کی کاپی؛ 3۔ چار عدد پاسپورٹ سائز تصاویر؛ 4۔ پچھلے اسکول کا اسکول لیونگ سرٹیفکیٹ۔"
    }
  ],

  // --- Fee Structure (Easily Editable) ---
  feeStructure: [
    { classGroup: "Pre-School (Nursery to KG)", admissionFee: "PKR 5,000", monthlyTuition: "PKR 3,500", annualCharges: "PKR 4,000" },
    { classGroup: "Primary (Grades 1 to 5)", admissionFee: "PKR 6,000", monthlyTuition: "PKR 4,200", annualCharges: "PKR 4,500" },
    { classGroup: "Middle (Grades 6 to 8)", admissionFee: "PKR 7,000", monthlyTuition: "PKR 4,800", annualCharges: "PKR 5,000" },
    { classGroup: "Matriculation (Grades 9 & 10)", admissionFee: "PKR 8,000", monthlyTuition: "PKR 5,500", annualCharges: "PKR 6,000" },
    { classGroup: "Dedicated Hifz-e-Quran Track", admissionFee: "PKR 6,000", monthlyTuition: "PKR 4,500", annualCharges: "PKR 4,000" }
  ],

  // --- Predefined AI Knowledge Base Answers ---
  chatbotQA: [
    {
      triggerWords: ["admission", "apply", "register", "eligibility", "date"],
      responseEn: "Admissions for session 2026-2027 are officially OPEN! You can apply directly through our Admissions page, or visit our campus on Pipli Road, Balkasar from 8:00 AM to 1:30 PM.",
      responseUr: "تعلیمی سال 2026-2027 کے داخلے جاری ہیں! آپ آن لائن داخلہ فارم جمع کرا سکتے ہیں یا پپلی روڈ بلکسر کیمپس تشریف لا سکتے ہیں۔"
    },
    {
      triggerWords: ["fee", "tuition", "cost", "expense", "charges"],
      responseEn: "Our fee structure is transparent and affordable, ranging from PKR 3,500 to PKR 5,500/month depending on grade level, with special merit and sibling discounts available upon inquiry.",
      responseUr: "ماہانہ فیس کلاس کے مطابق 3,500 تا 5,500 روپے ہے۔ یتیم اور ہونہار طلباء کے لیے وظائف کی سہولت بھی موجود ہے۔"
    },
    {
      triggerWords: ["quran", "hifz", "tajweed", "tafseer", "islamic"],
      responseEn: "Every student at HES receives certified Quranic education. We offer foundational Nazra with Tajweed, an intensive Hifz-e-Quran track, and Tafseer understanding under certified Qaris.",
      responseUr: "ہادی ایجوکیشن سسٹم میں حفظ و ناظرہ باقاعدہ تجوید کے ساتھ پڑھایا جاتا ہے، اور شعبہ حفظ میں خصوصی توجہ دی جاتی ہے۔"
    },
    {
      triggerWords: ["contact", "phone", "location", "address", "map", "timing"],
      responseEn: "We are located at Pipli Road, Balkasar, District Chakwal. Contact us via phone at +92 300 1234567 or email info@hes.com.pk. Office hours: 7:45 AM - 2:00 PM.",
      responseUr: "ہمارا پتہ: پپلی روڈ، بلکسر، ضلع چکوال۔ رابطہ فون: 0300-1234567، دفتری اوقات: صبح 7:45 تا دوپہر 2:00 بجے۔"
    }
  ]
};

// Export to window object for vanilla JS accessibility
if (typeof window !== "undefined") {
  window.siteContent = siteContent;
}
