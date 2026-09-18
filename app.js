/* ==========================================================================
   Govt. Special Education Centre, Jalalpur Pirwala
   Interactive Application JavaScript - Production Ready
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAccessibilitySuite();
  initNavigationAndScroll();
  initAdmissionsForm();
  initWingMatcher();
  initGalleryAndLightbox();
  initPwaServiceWorker();
});

/* ==========================================================================
   1. Universal Accessibility Suite (WCAG 2.2 AA)
   ========================================================================== */
function initAccessibilitySuite() {
  const body = document.body;
  const btnContrast = document.getElementById('btn-contrast');
  const btnDyslexic = document.getElementById('btn-dyslexic');
  const btnFontDec = document.getElementById('btn-font-dec');
  const btnFontReset = document.getElementById('btn-font-reset');
  const btnFontInc = document.getElementById('btn-font-inc');
  const btnTTS = document.getElementById('btn-tts');
  const ttsLabel = document.getElementById('tts-label');

  // --- A. High Contrast Mode ---
  const savedContrast = localStorage.getItem('gsec_high_contrast');
  if (savedContrast === 'enabled') {
    body.classList.add('high-contrast');
    btnContrast?.classList.add('active');
    btnContrast?.setAttribute('aria-pressed', 'true');
  }

  btnContrast?.addEventListener('click', () => {
    const isContrast = body.classList.toggle('high-contrast');
    btnContrast.classList.toggle('active', isContrast);
    btnContrast.setAttribute('aria-pressed', isContrast ? 'true' : 'false');
    localStorage.setItem('gsec_high_contrast', isContrast ? 'enabled' : 'disabled');
  });

  // --- B. Dyslexia-Friendly Typography ---
  const savedDyslexic = localStorage.getItem('gsec_dyslexic');
  if (savedDyslexic === 'enabled') {
    body.classList.add('dyslexic-font');
    btnDyslexic?.classList.add('active');
    btnDyslexic?.setAttribute('aria-pressed', 'true');
  }

  btnDyslexic?.addEventListener('click', () => {
    const isDyslexic = body.classList.toggle('dyslexic-font');
    btnDyslexic.classList.toggle('active', isDyslexic);
    btnDyslexic.setAttribute('aria-pressed', isDyslexic ? 'true' : 'false');
    localStorage.setItem('gsec_dyslexic', isDyslexic ? 'enabled' : 'disabled');
  });

  // --- C. Font Sizing Controls (-1: small, 0: default, 1: large, 2: xlarge) ---
  let fontLevel = parseInt(localStorage.getItem('gsec_font_level') || '0', 10);
  if (isNaN(fontLevel) || fontLevel < -1 || fontLevel > 2) {
    fontLevel = 0;
  }

  function applyFontScaling() {
    body.classList.remove('font-small', 'font-large', 'font-xlarge');
    if (fontLevel === -1) {
      body.classList.add('font-small');
    } else if (fontLevel === 1) {
      body.classList.add('font-large');
    } else if (fontLevel === 2) {
      body.classList.add('font-xlarge');
    }

    btnFontDec?.classList.toggle('active', fontLevel === -1);
    btnFontReset?.classList.toggle('active', fontLevel === 0);
    btnFontInc?.classList.toggle('active', fontLevel >= 1);

    localStorage.setItem('gsec_font_level', fontLevel.toString());
  }

  // Initialize saved font scaling
  applyFontScaling();

  btnFontInc?.addEventListener('click', () => {
    if (fontLevel < 2) {
      fontLevel++;
      applyFontScaling();
    }
  });

  btnFontDec?.addEventListener('click', () => {
    if (fontLevel > -1) {
      fontLevel--;
      applyFontScaling();
    }
  });

  btnFontReset?.addEventListener('click', () => {
    fontLevel = 0;
    applyFontScaling();
  });

  // --- D. Text-to-Speech (TTS) Reader ---
  let isSpeaking = false;
  const synth = window.speechSynthesis;

  if (btnTTS) {
    if (!('speechSynthesis' in window)) {
      btnTTS.style.display = 'none';
    } else {
      btnTTS.addEventListener('click', () => {
        if (isSpeaking) {
          synth.cancel();
          isSpeaking = false;
          btnTTS.classList.remove('active');
          btnTTS.setAttribute('aria-pressed', 'false');
          if (ttsLabel) ttsLabel.textContent = 'Listen';
        } else {
          synth.cancel(); // Stop any previous utterance
          const speechText = "Welcome to Government Special Education Centre, Jalalpur Pirwala. An institutional public sector facility operating under the Special Education Department, Government of Punjab. Primary specialization wings include Hearing Impaired, Physically Disabled, Visually Impaired, and Slow Learners. For admission inquiries and developmental assessments, please visit our campus or contact our administration.";
          
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.rate = 0.92;
          utterance.pitch = 1.0;
          utterance.lang = 'en-US';

          utterance.onstart = () => {
            isSpeaking = true;
            btnTTS.classList.add('active');
            btnTTS.setAttribute('aria-pressed', 'true');
            if (ttsLabel) ttsLabel.textContent = 'Stop';
          };

          utterance.onend = () => {
            isSpeaking = false;
            btnTTS.classList.remove('active');
            btnTTS.setAttribute('aria-pressed', 'false');
            if (ttsLabel) ttsLabel.textContent = 'Listen';
          };

          utterance.onerror = () => {
            isSpeaking = false;
            btnTTS.classList.remove('active');
            btnTTS.setAttribute('aria-pressed', 'false');
            if (ttsLabel) ttsLabel.textContent = 'Listen';
          };

          synth.speak(utterance);
        }
      });
    }
  }
}

/* ==========================================================================
   2. Navigation, Sticky Header & Scroll Interactivity
   ========================================================================== */
function initNavigationAndScroll() {
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const navLinks = document.getElementById('main-nav-links');
  const navItems = document.querySelectorAll('.nav-link-item, .nav-pill-cta');
  const hamburgerIcon = navToggleBtn?.querySelector('.hamburger-icon');
  const backToTopBtn = document.getElementById('btn-back-to-top');

  // Mobile drawer toggle
  if (navToggleBtn && navLinks) {
    navToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('active');
      navToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (hamburgerIcon) {
        hamburgerIcon.textContent = isOpen ? '✕' : '☰';
      }
    });

    // Close on navigation click
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          navLinks.classList.remove('active');
          navToggleBtn.setAttribute('aria-expanded', 'false');
          if (hamburgerIcon) hamburgerIcon.textContent = '☰';
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggleBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggleBtn.setAttribute('aria-expanded', 'false');
        if (hamburgerIcon) hamburgerIcon.textContent = '☰';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        navToggleBtn.setAttribute('aria-expanded', 'false');
        if (hamburgerIcon) hamburgerIcon.textContent = '☰';
        navToggleBtn.focus();
      }
    });
  }

  // Active link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    
    // Back to top button visibility
    if (backToTopBtn) {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link-item').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

  // Back to top click
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   3. Admission Inquiry Form & Printable Slip Generator
   ========================================================================== */
function initAdmissionsForm() {
  const form = document.getElementById('admission-inquiry-form');
  const slipContainer = document.getElementById('admission-slip-output');
  const printBtn = document.getElementById('btn-print-slip');
  const resetBtn = document.getElementById('btn-reset-inquiry');
  const submitBtn = document.getElementById('btn-submit-inquiry');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnSpinner = submitBtn?.querySelector('.btn-spinner');

  // Input elements
  const studentInput = document.getElementById('adm-student-name');
  const fatherInput = document.getElementById('adm-father-name');
  const ageInput = document.getElementById('adm-age');
  const categorySelect = document.getElementById('adm-category');
  const phoneInput = document.getElementById('adm-phone');
  const addressInput = document.getElementById('adm-address');
  const notesInput = document.getElementById('adm-notes');

  // Field validation helpers
  function validateField(input, errorId, errorMsg) {
    const errSpan = document.getElementById(errorId);
    if (!input || !input.value.trim()) {
      if (errSpan) errSpan.textContent = errorMsg;
      input?.classList.add('is-invalid');
      return false;
    }
    if (errSpan) errSpan.textContent = '';
    input.classList.remove('is-invalid');
    return true;
  }

  // Clear errors on blur
  studentInput?.addEventListener('blur', () => validateField(studentInput, 'err-student-name', 'Student full name is required'));
  fatherInput?.addEventListener('blur', () => validateField(fatherInput, 'err-father-name', 'Father / Guardian name is required'));
  ageInput?.addEventListener('blur', () => validateField(ageInput, 'err-age', 'Valid age between 3 and 18 is required'));
  categorySelect?.addEventListener('change', () => validateField(categorySelect, 'err-category', 'Please select a specialization wing'));
  phoneInput?.addEventListener('blur', () => validateField(phoneInput, 'err-phone', 'Contact number is required'));
  addressInput?.addEventListener('blur', () => validateField(addressInput, 'err-address', 'Residential area or address is required'));

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all required fields
      const isStudentValid = validateField(studentInput, 'err-student-name', 'Student full name is required');
      const isFatherValid = validateField(fatherInput, 'err-father-name', 'Father / Guardian name is required');
      const isAgeValid = validateField(ageInput, 'err-age', 'Valid child age (3–18) is required');
      const isCategoryValid = validateField(categorySelect, 'err-category', 'Please select a specialization wing');
      const isPhoneValid = validateField(phoneInput, 'err-phone', 'Valid contact phone number is required');
      const isAddressValid = validateField(addressInput, 'err-address', 'Residential address is required');

      if (!isStudentValid || !isFatherValid || !isAgeValid || !isCategoryValid || !isPhoneValid || !isAddressValid) {
        return;
      }

      // Show submitting state
      if (submitBtn && btnText && btnSpinner) {
        submitBtn.disabled = true;
        btnText.textContent = 'Generating Reference Slip...';
        btnSpinner.style.display = 'inline-block';
      }

      setTimeout(() => {
        const studentName = studentInput.value.trim();
        const fatherName = fatherInput.value.trim();
        const age = ageInput.value.trim();
        const gender = document.querySelector('input[name="gender"]:checked')?.value || 'Male';
        const category = categorySelect.value;
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();
        const transport = document.querySelector('input[name="transport"]:checked')?.value || 'Yes';

        // Generate clean Inquiry Reference Number
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const refCode = `INQ-JPP-${randomNum}`;

        const currentDate = new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        // Populate Slip Elements
        const elRef = document.getElementById('slip-ref');
        const elDate = document.getElementById('slip-date');
        const elStudent = document.getElementById('slip-student');
        const elFather = document.getElementById('slip-father');
        const elAgeGender = document.getElementById('slip-age-gender');
        const elWing = document.getElementById('slip-wing');
        const elPhone = document.getElementById('slip-phone');
        const elTransport = document.getElementById('slip-transport');
        const elAddress = document.getElementById('slip-address');

        if (elRef) elRef.textContent = refCode;
        if (elDate) elDate.textContent = currentDate;
        if (elStudent) elStudent.textContent = studentName;
        if (elFather) elFather.textContent = fatherName;
        if (elAgeGender) elAgeGender.textContent = `${age} Years • ${gender}`;
        if (elWing) elWing.textContent = category;
        if (elPhone) elPhone.textContent = phone;
        if (elTransport) elTransport.textContent = transport === 'Yes' ? 'Inquiring for Free Bus Transport' : 'Self Arranged';
        if (elAddress) elAddress.textContent = address;

        // Reset submit button state
        if (submitBtn && btnText && btnSpinner) {
          submitBtn.disabled = false;
          btnText.textContent = 'Generate Inquiry Reference Slip';
          btnSpinner.style.display = 'none';
        }

        // Show result slip and scroll smoothly
        if (slipContainer) {
          slipContainer.classList.add('active');
          slipContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 500);
    });
  }

  // Print button handler
  printBtn?.addEventListener('click', () => {
    window.print();
  });

  // Reset form handler
  resetBtn?.addEventListener('click', () => {
    form?.reset();
    slipContainer?.classList.remove('active');
    document.querySelectorAll('.field-error-msg').forEach(el => el.textContent = '');
    form?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Portal Tab Switcher (Inquiry Form vs Wing Matcher)
  const portalTabBtns = document.querySelectorAll('.portal-tab-btn');
  const portalPanels = document.querySelectorAll('.portal-panel');

  portalTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      portalTabBtns.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      portalPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const targetId = tab.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. Wing & Therapy Matcher Quiz
   ========================================================================== */
function initWingMatcher() {
  const options = document.querySelectorAll('.quiz-card-opt');
  const resultCard = document.getElementById('quiz-result-box');
  const resultTitle = document.getElementById('quiz-result-title');
  const resultDesc = document.getElementById('quiz-result-desc');
  const resultFeatures = document.getElementById('quiz-result-features');
  const btnProceed = document.getElementById('btn-quiz-proceed');
  const categorySelect = document.getElementById('adm-category');

  const wingDataMap = {
    hi: {
      title: 'Hearing Impaired (HI) Specialized Wing',
      selectVal: 'Hearing Impaired (HI) Wing',
      desc: 'Supervised by certified Senior Special Education Teachers (SSET, BS-17). Focuses on Pakistan Sign Language (PSL), auditory-verbal stimulation, speech articulation therapy, and adapted Punjab curriculum.',
      features: [
        'Pakistan Sign Language (PSL) Structured Instruction',
        'Clinical Speech & Language Articulation Sessions',
        'Dedicated Student Transport Bus Support',
        'Government Textbooks & Educational Aids'
      ]
    },
    pd: {
      title: 'Physically Disabled (PD) Specialized Wing',
      selectVal: 'Physically Disabled (PD) Wing',
      desc: 'Equipped with wheelchair ramps, ergonomic adaptive furniture, fine motor development exercises, and tailored physical therapy rehabilitation guidance.',
      features: [
        'Physical Mobility & Motor Assessment Guidance',
        'Barrier-Free Ramp-Accessible Campus Pathways',
        'Ergonomic Classroom Desks & Adaptive Seating',
        'Subsidized Student Welfare & Assisted Transit'
      ]
    },
    vi: {
      title: 'Visually Impaired (VI) Specialized Wing',
      selectVal: 'Visually Impaired (VI) Wing',
      desc: 'Provides Braille literacy training, tactile learning resources, orientation and cane mobility guidance, and audio-assisted educational aids.',
      features: [
        'Braille Reading, Writing & Stylus Instruction',
        'White-Cane Orientation & Mobility Guidance',
        'Tactile Math, Geometry & Sensory Tools',
        'Dedicated Transport & Supervised Boarding'
      ]
    },
    slow: {
      title: 'Slow Learners & Neurodevelopmental Wing',
      selectVal: 'Slow Learners Wing',
      desc: 'Supervised under developmental psychological guidance. Features Individualized Education Plans (IEPs), behavioral reinforcement, and cognitive milestone tracking.',
      features: [
        'Diagnostic Developmental Assessments & Reviews',
        'Custom Individualized Education Plans (IEPs)',
        'Patient, Specially Trained Faculty (JSET / SSET)',
        'Structured Daily Life Skills & Cognitive Training'
      ]
    }
  };

  let selectedWingKey = null;

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => {
        o.classList.remove('selected');
        o.setAttribute('aria-checked', 'false');
      });
      opt.classList.add('selected');
      opt.setAttribute('aria-checked', 'true');

      const wingKey = opt.getAttribute('data-wing');
      selectedWingKey = wingKey;
      const data = wingDataMap[wingKey];

      if (data && resultCard && resultTitle && resultDesc && resultFeatures) {
        resultTitle.textContent = data.title;
        resultDesc.textContent = data.desc;
        resultFeatures.innerHTML = data.features.map(feat => `
          <li>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            <span>${feat}</span>
          </li>
        `).join('');

        resultCard.classList.add('active');
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Keyboard support (Enter / Space)
    opt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        opt.click();
      }
    });
  });

  // Proceed button transitions to Form tab with auto-selected category
  btnProceed?.addEventListener('click', () => {
    const tabForm = document.getElementById('tab-inquiry-form');
    tabForm?.click();

    if (selectedWingKey && wingDataMap[selectedWingKey] && categorySelect) {
      categorySelect.value = wingDataMap[selectedWingKey].selectVal;
    }

    const formElement = document.getElementById('admission-inquiry-form');
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ==========================================================================
   5. Campus Photo Gallery & Accessible Lightbox
   ========================================================================== */
function initGalleryAndLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = Array.from(document.querySelectorAll('.gallery-item-card'));
  const modal = document.getElementById('gallery-lightbox');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.querySelector('.lightbox-close-btn');
  const prevBtn = document.querySelector('.lightbox-prev-btn');
  const nextBtn = document.querySelector('.lightbox-next-btn');

  let currentActiveIndex = 0;
  let visibleCards = [...galleryCards];
  let lastFocusedElement = null;

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      visibleCards = [];
      galleryCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          visibleCards.push(card);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Open Lightbox
  function openLightbox(index) {
    if (!visibleCards[index]) return;
    currentActiveIndex = index;
    const card = visibleCards[index];
    const img = card.querySelector('img');
    const title = card.querySelector('h5')?.innerText || 'Campus Photograph';
    const desc = card.getAttribute('data-caption') || 'Govt. Special Education Centre, Jalalpur Pirwala';

    if (modal && modalImg && modalTitle && modalDesc) {
      modalImg.src = img.src;
      modalImg.alt = title;
      modalTitle.textContent = title;
      modalDesc.textContent = desc;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      closeBtn?.focus();
    }
  }

  // Close Lightbox
  function closeLightbox() {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      lastFocusedElement?.focus();
    }
  }

  // Next / Previous
  function showNextPhoto() {
    if (visibleCards.length === 0) return;
    currentActiveIndex = (currentActiveIndex + 1) % visibleCards.length;
    openLightbox(currentActiveIndex);
  }

  function showPrevPhoto() {
    if (visibleCards.length === 0) return;
    currentActiveIndex = (currentActiveIndex - 1 + visibleCards.length) % visibleCards.length;
    openLightbox(currentActiveIndex);
  }

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      lastFocusedElement = card;
      const index = visibleCards.indexOf(card);
      if (index !== -1) {
        openLightbox(index);
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  nextBtn?.addEventListener('click', showNextPhoto);
  prevBtn?.addEventListener('click', showPrevPhoto);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  // Keyboard navigation inside lightbox
  document.addEventListener('keydown', (e) => {
    if (!modal?.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextPhoto();
    } else if (e.key === 'ArrowLeft') {
      showPrevPhoto();
    }
  });
}

/* ==========================================================================
   6. Progressive Web App (PWA) & Service Worker
   ========================================================================== */
function initPwaServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Graceful ignore for local file protocols or disabled service workers
    });
  }
}
