/* ==========================================================================
   Govt. Special Education Centre, Jalalpur Pirwala
   Interactive Application JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAccessibility();
  initNavigation();
  initGallery();
  initAdmissionForm();
  initProgramFinder();
  initNoticeBoard();

  // Register service worker for offline functionality
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Ignored if file:// protocol
    });
  }
});

/* ==========================================================================
   1. Accessibility Enhancements (TTS, High Contrast, Font Scaling)
   ========================================================================== */
function initAccessibility() {
  const body = document.body;
  const btnContrast = document.getElementById('btn-contrast');
  const btnFontDec = document.getElementById('btn-font-dec');
  const btnFontReset = document.getElementById('btn-font-reset');
  const btnFontInc = document.getElementById('btn-font-inc');
  const btnDyslexic = document.getElementById('btn-dyslexic');
  const btnTTS = document.getElementById('btn-tts');

  // Contrast toggle
  if (btnContrast) {
    btnContrast.addEventListener('click', () => {
      body.classList.toggle('high-contrast');
      btnContrast.classList.toggle('active');
    });
  }

  // Font size adjustments
  let fontLevel = 0; // -1: small, 0: normal, 1: large, 2: xlarge
  function applyFontLevel() {
    body.classList.remove('font-large', 'font-xlarge');
    if (fontLevel === 1) {
      body.classList.add('font-large');
    } else if (fontLevel >= 2) {
      body.classList.add('font-xlarge');
    }
    btnFontDec?.classList.toggle('active', fontLevel < 0);
    btnFontReset?.classList.toggle('active', fontLevel === 0);
    btnFontInc?.classList.toggle('active', fontLevel > 0);
  }

  btnFontInc?.addEventListener('click', () => {
    if (fontLevel < 2) fontLevel++;
    applyFontLevel();
  });

  btnFontDec?.addEventListener('click', () => {
    if (fontLevel > 0) fontLevel--;
    applyFontLevel();
  });

  btnFontReset?.addEventListener('click', () => {
    fontLevel = 0;
    applyFontLevel();
  });

  // Dyslexic font
  btnDyslexic?.addEventListener('click', () => {
    body.classList.toggle('dyslexic-font');
    btnDyslexic.classList.toggle('active');
  });

  // Web Speech API Text-to-Speech
  let isSpeaking = false;
  let synth = window.speechSynthesis;

  if (btnTTS && 'speechSynthesis' in window) {
    btnTTS.addEventListener('click', () => {
      if (isSpeaking) {
        synth.cancel();
        isSpeaking = false;
        btnTTS.classList.remove('active');
        btnTTS.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg> Read Aloud`;
      } else {
        const textToRead = "Welcome to Government Special Education Centre, Jalalpur Pirwala. A public sector institution offering 100 percent free specialized education, therapy, psychological assessments, and free student transport under the Special Education Department, Government of Punjab. Primary specialization wings include Hearing Impaired, Physically Disabled, Visually Impaired, and Slow Learners.";
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        
        utterance.onend = () => {
          isSpeaking = false;
          btnTTS.classList.remove('active');
          btnTTS.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg> Read Aloud`;
        };

        synth.speak(utterance);
        isSpeaking = true;
        btnTTS.classList.add('active');
        btnTTS.innerHTML = `<span class="tts-active-indicator"></span> Stop Reading`;
      }
    });
  }
}

/* ==========================================================================
   2. Navigation & Smooth Scroll
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.main-header');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  mobileToggle?.addEventListener('click', () => {
    mainNav?.classList.toggle('mobile-active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav?.classList.remove('mobile-active');
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

/* ==========================================================================
   3. Campus Photo Gallery & Lightbox
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const modal = document.getElementById('gallery-lightbox');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.querySelector('.lightbox-close-btn');

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal open
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('h5')?.innerText || 'Campus Photo';
      const desc = card.getAttribute('data-caption') || 'Govt. Special Education Centre Jalalpur Pirwala';

      if (modal && modalImg && modalTitle && modalDesc) {
        modalImg.src = img.src;
        modalImg.alt = title;
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        modal.classList.add('active');
      }
    });
  });

  // Modal close
  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('active');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* ==========================================================================
   4. Admission Inquiry & Printable Slip Generator
   ========================================================================== */
function initAdmissionForm() {
  const form = document.getElementById('admission-inquiry-form');
  const slipContainer = document.getElementById('admission-slip-output');
  const printBtn = document.getElementById('btn-print-slip');
  const resetBtn = document.getElementById('btn-reset-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const studentName = document.getElementById('adm-student-name').value;
      const fatherName = document.getElementById('adm-father-name').value;
      const age = document.getElementById('adm-age').value;
      const gender = document.querySelector('input[name="gender"]:checked')?.value || 'Not specified';
      const category = document.getElementById('adm-category').value;
      const phone = document.getElementById('adm-phone').value;
      const address = document.getElementById('adm-address').value;
      const transport = document.querySelector('input[name="transport"]:checked')?.value || 'Yes';
      const notes = document.getElementById('adm-notes').value || 'None';

      const refNumber = 'GSEC-JPP-' + Math.floor(100000 + Math.random() * 900000);
      const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Populate slip data
      document.getElementById('slip-ref').innerText = refNumber;
      document.getElementById('slip-date').innerText = currentDate;
      document.getElementById('slip-student').innerText = studentName;
      document.getElementById('slip-father').innerText = fatherName;
      document.getElementById('slip-age-gender').innerText = `${age} Years / ${gender}`;
      document.getElementById('slip-wing').innerText = category;
      document.getElementById('slip-phone').innerText = phone;
      document.getElementById('slip-transport').innerText = transport === 'Yes' ? 'Free Govt. Bus Required' : 'Self Arranged';
      document.getElementById('slip-address').innerText = address;

      // Show slip
      if (slipContainer) {
        slipContainer.classList.add('active');
        slipContainer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  printBtn?.addEventListener('click', () => {
    window.print();
  });

  resetBtn?.addEventListener('click', () => {
    form?.reset();
    slipContainer?.classList.remove('active');
  });
}

/* ==========================================================================
   5. Interactive Eligibility & Program Finder Quiz
   ========================================================================== */
function initProgramFinder() {
  const options = document.querySelectorAll('.quiz-option-card');
  const resultCard = document.getElementById('quiz-result-card');
  const resultTitle = document.getElementById('quiz-result-title');
  const resultDesc = document.getElementById('quiz-result-desc');
  const resultBenefits = document.getElementById('quiz-result-benefits');

  const wingData = {
    hi: {
      title: 'Hearing Impaired (HI) Specialized Wing',
      desc: 'Supervised by Senior Teachers (such as In-Charge Principal Mr. Muhammad Tayyab, BS-17). Focuses on Pakistan Sign Language (PSL), auditory verbal therapy, speech therapy, and standard curriculum adaptation.',
      benefits: ['Free Speech Therapy & Audiology Tracking', 'Free Hearing Aids Coordination', 'Free Bus Pick & Drop with Attendants', '100% Free Books & Uniforms']
    },
    pd: {
      title: 'Physically Disabled (PD) Specialized Wing',
      desc: 'Equipped with wheelchair ramps, ergonomic adaptive furniture, physical therapy modules, motor rehabilitation, and assistive walking aids.',
      benefits: ['Free Physical Therapy & Motor Assessment', 'Barrier-Free Accessible Infrastructure', 'Free Assisted Transport Service', 'Stipend & Government Welfare Support']
    },
    vi: {
      title: 'Visually Impaired (VI) Specialized Wing',
      desc: 'Provides Braille literacy, auditory orientation, mobility cane training, assistive digital readers, and tactile learning.',
      benefits: ['Free Braille Books & Stylus Kits', 'Mobility & Orientation Guidance', 'Individualized Special Attention', 'Free Daily Transport Support']
    },
    slow: {
      title: 'Slow Learners & Neurodevelopmental Wing',
      desc: 'Supervised under certified developmental psychologists and specialized faculty. Features Individualized Educational Plans (IEPs), behavioral therapy, and cognitive milestones.',
      benefits: ['Professional Behavioral Assessment Modules', 'Individualized Education Plan (IEP)', 'Caring Patient Faculty (JSET/SSET)', 'Free Transport & Nutritional Support']
    }
  };

  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      const wingKey = option.getAttribute('data-wing');
      const data = wingData[wingKey];

      if (data && resultCard && resultTitle && resultDesc && resultBenefits) {
        resultTitle.innerText = data.title;
        resultDesc.innerText = data.desc;
        resultBenefits.innerHTML = data.benefits.map(b => `<li><svg width="14" height="14" viewBox="0 0 24 24" fill="#0b6623"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> ${b}</li>`).join('');
        resultCard.classList.add('active');
        resultCard.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Switch between Tools Tab
  const tabBtns = document.querySelectorAll('.tool-tab-btn');
  const panels = document.querySelectorAll('.tool-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. Notice Board Interactions
   ========================================================================== */
function initNoticeBoard() {
  // Can be extended for dynamic notice filtering if required
}
