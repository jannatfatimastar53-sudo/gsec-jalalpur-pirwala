/* ==========================================================================
   Govt. Special Education Centre, Jalalpur Pirwala
   Interactive Application JavaScript - Animations, Micro-interactions & A11y
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollEffects();
  initScrollReveal();
  initCounters();
  initRippleEffects();
  initNavigation();
  initGallery();
  initAdmissionForm();
  initProgramFinder();
  initNoticeBoard();
  initAccessibility();

  // Register service worker for offline functionality if supported
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Offline caching fallback
    });
  }
});

/* ==========================================================================
   1. Branded Preloader Screen
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('site-preloader');
  if (!preloader) return;

  const hidePreloader = () => {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 550);
  };

  // Smooth fade-out on window load or max fallback of 1.2s
  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 350));
    setTimeout(hidePreloader, 1200); // Safety fallback
  }
}

/* ==========================================================================
   2. Scroll Effects: Progress Bar, Sticky Header & Circular Back-to-Top
   ========================================================================== */
function initScrollEffects() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.querySelector('.progress-ring-circle');
  const header = document.querySelector('.main-header');

  const circleRadius = 19;
  const circumference = 2 * Math.PI * circleRadius; // ~119.38

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;
  }

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;

    // 1. Update top scroll progress bar
    if (progressBar) {
      progressBar.style.width = `${Math.min(scrollPercent * 100, 100)}%`;
    }

    // 2. Sticky Header Elevation
    if (header) {
      if (scrollTop > 35) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // 3. Back to Top Button & Circular SVG Progress
    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }

      if (progressCircle) {
        const offset = circumference - (scrollPercent * circumference);
        progressCircle.style.strokeDashoffset = `${Math.max(0, offset)}`;
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   3. IntersectionObserver Scroll Reveal Engine
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const delay = target.getAttribute('data-delay') || 0;

        setTimeout(() => {
          target.classList.add('revealed');
        }, parseInt(delay, 10));

        observer.unobserve(target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   4. Animated Number Counters
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const countUp = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
    const prefix = counter.getAttribute('data-prefix') || '';
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo function
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * target);

      counter.innerText = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => counterObserver.observe(c));
}

/* ==========================================================================
   5. Button Ripple Micro-Interaction
   ========================================================================== */
function initRippleEffects() {
  const rippleBtns = document.querySelectorAll('.ripple-btn');

  rippleBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-circle';
      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${e.clientX - rect.left - radius}px`;
      ripple.style.top = `${e.clientY - rect.top - radius}px`;

      const existingRipple = this.querySelector('.ripple-circle');
      if (existingRipple) {
        existingRipple.remove();
      }

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* ==========================================================================
   6. Navigation, Scrollspy & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const allInternalLinks = document.querySelectorAll('a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  // Toggle mobile menu
  mobileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = mainNav?.classList.toggle('mobile-active');
    mobileToggle.classList.toggle('active', isActive);
    mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mainNav?.classList.contains('mobile-active') && !mainNav.contains(e.target) && !mobileToggle?.contains(e.target)) {
      mainNav.classList.remove('mobile-active');
      mobileToggle?.classList.remove('active');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // Smooth scroll handler for ALL internal hash links
  allInternalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetSection = document.querySelector(href);
        if (targetSection) {
          e.preventDefault();

          // Close mobile menu if open
          mainNav?.classList.remove('mobile-active');
          mobileToggle?.classList.remove('active');
          mobileToggle?.setAttribute('aria-expanded', 'false');

          // If clicking to admission form tools, switch to form panel
          if (href === '#tools' || href === '#admission-form-panel') {
            const formTabBtn = document.querySelector('[data-target="admission-form-panel"]');
            formTabBtn?.click();
          }

          const headerHeight = document.querySelector('.main-header')?.offsetHeight || 70;
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight + 5;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Sync nav link active state if this was a nav link
          if (link.classList.contains('nav-link')) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      }
    });
  });

  // Scrollspy: Sync active nav link based on scroll position
  const syncScrollspy = () => {
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  };

  window.addEventListener('scroll', syncScrollspy, { passive: true });
}

/* ==========================================================================
   7. Campus Photo Gallery & Interactive Lightbox
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const modal = document.getElementById('gallery-lightbox');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.querySelector('.lightbox-close-btn');

  // Category filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Open Lightbox
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('h5')?.innerText || 'Campus Photography';
      const desc = card.getAttribute('data-caption') || 'Govt. Special Education Centre Jalalpur Pirwala';

      if (modal && modalImg && modalTitle && modalDesc && img) {
        modalImg.src = img.src;
        modalImg.alt = title;
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background scroll
      }
    });
  });

  // Close Lightbox
  const closeModal = () => {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-backdrop')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. Online Admission Form & Printable Slip Generator
   ========================================================================== */
function initAdmissionForm() {
  const form = document.getElementById('admission-inquiry-form');
  const slipContainer = document.getElementById('admission-slip-output');
  const printBtn = document.getElementById('btn-print-slip');
  const resetBtn = document.getElementById('btn-reset-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const studentName = document.getElementById('adm-student-name').value.trim();
      const fatherName = document.getElementById('adm-father-name').value.trim();
      const age = document.getElementById('adm-age').value.trim();
      const gender = document.querySelector('input[name="gender"]:checked')?.value || 'Not specified';
      const category = document.getElementById('adm-category').value;
      const phone = document.getElementById('adm-phone').value.trim();
      const address = document.getElementById('adm-address').value.trim();
      const transport = document.querySelector('input[name="transport"]:checked')?.value || 'Yes';

      const refNumber = 'GSEC-JPP-' + Math.floor(100000 + Math.random() * 900000);
      const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Populate printable slip
      document.getElementById('slip-ref').innerText = refNumber;
      document.getElementById('slip-date').innerText = currentDate;
      document.getElementById('slip-student').innerText = studentName;
      document.getElementById('slip-father').innerText = fatherName;
      document.getElementById('slip-age-gender').innerText = `${age} Years / ${gender}`;
      document.getElementById('slip-wing').innerText = category;
      document.getElementById('slip-phone').innerText = phone;
      document.getElementById('slip-transport').innerText = transport === 'Yes' ? 'Free Daily Govt. Bus Service' : 'Self-Arranged Commute';
      document.getElementById('slip-address').innerText = address;

      // Reveal slip
      if (slipContainer) {
        slipContainer.classList.add('active');
        slipContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  printBtn?.addEventListener('click', () => {
    window.print();
  });

  resetBtn?.addEventListener('click', () => {
    form?.reset();
    slipContainer?.classList.remove('active');
    form?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ==========================================================================
   9. Interactive Wing Matcher Quiz & Tabs
   ========================================================================== */
function initProgramFinder() {
  const options = document.querySelectorAll('.quiz-option-card');
  const resultCard = document.getElementById('quiz-result-card');
  const resultTitle = document.getElementById('quiz-result-title');
  const resultDesc = document.getElementById('quiz-result-desc');
  const resultBenefits = document.getElementById('quiz-result-benefits');

  const wingData = {
    hi: {
      title: 'Hearing Impairment (HI) Specialized Wing',
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
      desc: 'Supervised under the clinical psychological expertise of Headmistress Ms. Fozia Hamid (M.Phil in Psychology). Features Individualized Educational Plans (IEPs), behavioral therapy, and cognitive milestones.',
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
        resultBenefits.innerHTML = data.benefits.map(b => `
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#059669"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> 
            <span>${b}</span>
          </li>
        `).join('');

        resultCard.classList.add('active');
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Switch between Tools Tabs (Admission Form / Wing Matcher)
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
   10. Notice Board Interactions
   ========================================================================== */
function initNoticeBoard() {
  // Notice board hover and interactive effects handled via CSS
}

/* ==========================================================================
   11. Universal Accessibility (TTS, High Contrast, Font Scaling, Dyslexic)
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
  btnContrast?.addEventListener('click', () => {
    body.classList.toggle('high-contrast');
    btnContrast.classList.toggle('active');
  });

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
  const synth = window.speechSynthesis;

  if (btnTTS && 'speechSynthesis' in window) {
    btnTTS.addEventListener('click', () => {
      if (isSpeaking) {
        synth.cancel();
        isSpeaking = false;
        btnTTS.classList.remove('active');
        btnTTS.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg> Read Aloud`;
      } else {
        const textToRead = "Welcome to Government Special Education Centre, Jalalpur Pirwala. A public sector institution offering 100 percent free specialized education, clinical therapy, psychological assessments, and free daily student transport under the Special Education Department, Government of Punjab. Head of Institution: Ms. Fozia Hamid, Headmistress and Drawing and Disbursing Officer. Specialized wings include Hearing Impaired, Physically Disabled, Visually Impaired, and Slow Learners. 100 percent free admissions are open.";
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
