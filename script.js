// ===========================================
// ORBIT.TIFF PORTFOLIO - MAIN JAVASCRIPT
// Mission Dashboard Interactions
// ===========================================

// --- MOTION PREFERENCE MANAGEMENT ---
function initMotionPreference() {
  const motionToggle = document.getElementById('motionToggle');
  const motionStatus = document.getElementById('motionStatus');

  if (!motionToggle) return;

  // Check system preference first
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Check user's explicit choice in localStorage
  const userChoice = localStorage.getItem('motion-preference');

  // Priority: user's explicit choice > system preference > default (motion on)
  let motionEnabled;
  if (userChoice !== null) {
    motionEnabled = userChoice === 'on';
  } else {
    motionEnabled = !prefersReducedMotion;
  }

  // Apply motion state
  setMotionState(motionEnabled);

  // Update button text
  motionStatus.textContent = motionEnabled ? 'On' : 'Off';

  // Toggle handler
  motionToggle.addEventListener('click', () => {
    motionEnabled = !motionEnabled;
    setMotionState(motionEnabled);
    motionStatus.textContent = motionEnabled ? 'On' : 'Off';
    localStorage.setItem('motion-preference', motionEnabled ? 'on' : 'off');
  });
}

function setMotionState(enabled) {
  if (enabled) {
    document.body.classList.remove('reduce-motion');
  } else {
    document.body.classList.add('reduce-motion');
  }
}

function isMotionReduced() {
  return document.body.classList.contains('reduce-motion');
}

// --- STARFIELD CANVAS BACKGROUND ---
function initStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Set canvas size
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Generate background stars
  const stars = [];
  const numStars = 100;

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.01
    });
  }

  // Animation frame
  let frame = 0;
  function drawStarfield() {
    if (isMotionReduced()) {
      // Static starfield when motion is reduced
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 199, 245, ${star.opacity})`;
        ctx.fill();
      });
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      // Twinkle effect
      const twinkle = Math.sin(frame * star.twinkleSpeed) * 0.3;
      const currentOpacity = star.opacity + twinkle;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 199, 245, ${currentOpacity})`;
      ctx.fill();
    });

    frame++;
    requestAnimationFrame(drawStarfield);
  }

  drawStarfield();
}

// --- ROCKET LAUNCH SEQUENCE ---
function initRocketLaunch() {
  const profileRocket = document.getElementById('profileRocket');
  const easterEggProfile = document.getElementById('easterEggProfile');
  const launchOverlay = document.getElementById('launchOverlay');
  const missionPatch = document.getElementById('missionPatch');
  const countdownText = document.getElementById('countdownText');
  const abortButton = document.getElementById('abortButton');

  if (!launchOverlay) return;

  let countdownInterval = null;
  let launchTimeout = null;

  // Click handler for main profile rocket
  if (profileRocket) {
    profileRocket.addEventListener('click', startLaunchSequence);

    // Keyboard handler (Enter or Space)
    profileRocket.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startLaunchSequence();
      }
    });
  }

  // Easter egg profile also launches
  if (easterEggProfile) {
    easterEggProfile.addEventListener('click', () => {
      alert('🔮 Holographic mode discovered! Initiating secure transmission...');
      setTimeout(startLaunchSequence, 500);
    });

    easterEggProfile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        alert('🔮 Holographic mode discovered! Initiating secure transmission...');
        setTimeout(startLaunchSequence, 500);
      }
    });
  }

  // Abort button handler
  if (abortButton) {
    abortButton.addEventListener('click', abortLaunch);
  }

  // Escape key also aborts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && launchOverlay.classList.contains('active')) {
      abortLaunch();
    }
  });

  function abortLaunch() {
    // Clear timers
    if (countdownInterval) clearInterval(countdownInterval);
    if (launchTimeout) clearTimeout(launchTimeout);

    // Remove active states
    launchOverlay.classList.remove('active');
    missionPatch.classList.remove('launching');

    // Reset countdown text
    countdownText.textContent = 'T-minus 5';

    // Optional: Show brief abort message
    countdownText.textContent = 'Launch Aborted';
    setTimeout(() => {
      countdownText.textContent = 'T-minus 5';
    }, 1000);
  }

  function startLaunchSequence() {
    if (isMotionReduced()) {
      // Skip animation, redirect immediately
      window.location.href = 'about.html';
      return;
    }

    // Show overlay
    launchOverlay.classList.add('active');

    // Countdown from 5
    let countdown = 5;
    countdownText.textContent = `T-minus ${countdown}`;

    countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        countdownText.textContent = `T-minus ${countdown}`;
      } else {
        countdownText.textContent = 'Liftoff! 🚀';
        clearInterval(countdownInterval);

        // Start launch animation
        missionPatch.classList.add('launching');

        // Redirect after animation completes (3 seconds)
        launchTimeout = setTimeout(() => {
          window.location.href = 'about.html';
        }, 3000);
      }
    }, 1000);
  }
}

// --- ROCKET LANDING ON ABOUT PAGE ---
function initRocketLanding() {
  const landingRocket = document.getElementById('landingRocket');
  if (!landingRocket) return;

  if (isMotionReduced()) {
    // Show rocket already landed
    landingRocket.style.opacity = '1';
    landingRocket.style.transform = 'translateY(0)';
    return;
  }

  // Trigger landing animation
  setTimeout(() => {
    landingRocket.classList.add('landing');
  }, 300);
}

// --- TELESCOPE CUSTOM CURSOR ---
function initTelescopeFollower() {
  const telescope = document.getElementById('telescopeFollower');

  // FAILSAFE: if the telescope element is missing, ensure cursor is never hidden
  if (!telescope) {
    document.body.classList.remove('telescope-active');
    return;
  }

  // Restore saved preference (default: on)
  const savedPref = localStorage.getItem('cursor-decoration');
  // Default to OFF for new visitors; only enable when explicitly set to 'on'
  let cursorOn = savedPref === 'on';

  function enableCursor() {
    cursorOn = true;
    document.body.classList.add('telescope-active');
    telescope.style.opacity = '1';
    localStorage.setItem('cursor-decoration', 'on');
  }

  function disableCursor() {
    cursorOn = false;
    document.body.classList.remove('telescope-active');
    telescope.style.opacity = '0';
    localStorage.setItem('cursor-decoration', 'off');
  }

  // Apply saved preference on load
  if (cursorOn) {
    enableCursor();
  } else {
    disableCursor();
  }

  // Expose toggle so the cursor toggle button can call it
  window.toggleCursorDecoration = function () {
    if (cursorOn) disableCursor();
    else enableCursor();
    return cursorOn;
  };

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth animation loop — always running so position is ready when re-enabled
  function animateTelescope() {
    if (isMotionReduced()) {
      telescope.style.left = mouseX + 'px';
      telescope.style.top = mouseY + 'px';
    } else {
      const ease = 0.15;
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;
      telescope.style.left = currentX + 'px';
      telescope.style.top = currentY + 'px';
    }
    requestAnimationFrame(animateTelescope);
  }

  animateTelescope();

  // Scale up on hover over interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .project-card');
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => telescope.classList.add('active'));
    element.addEventListener('mouseleave', () => telescope.classList.remove('active'));
  });
}

// --- CURSOR DECORATION TOGGLE ---
function initCursorToggle() {
  const cursorToggle = document.getElementById('cursorToggle');
  const cursorStatus = document.getElementById('cursorStatus');

  if (!cursorToggle || !cursorStatus) return;

  // Sync button label with saved preference (default: Off)
  const savedPref = localStorage.getItem('cursor-decoration');
  cursorStatus.textContent = savedPref === 'on' ? 'On' : 'Off';

  cursorToggle.addEventListener('click', () => {
    if (typeof window.toggleCursorDecoration === 'function') {
      const isOn = window.toggleCursorDecoration();
      cursorStatus.textContent = isOn ? 'On' : 'Off';
    }
  });
}

// --- PROJECT CARD POPUP ---
function initProjectCardPopup() {
  const projectStars = document.querySelectorAll('.project-star');
  const popup = document.getElementById('projectCardPopup');
  const overlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');

  const popupIcon = document.getElementById('popupIcon');
  const popupTitle = document.getElementById('popupTitle');
  const popupMeta = document.getElementById('popupMeta');
  const popupDescription = document.getElementById('popupDescription');
  const popupTags = document.getElementById('popupTags');
  const popupCTA = document.getElementById('popupCTA');

  if (!popup || !overlay) return;

  // Open popup when hovering over a star
  projectStars.forEach(star => {
    let hoverTimeout;

    star.addEventListener('mouseenter', () => {
      // Delay popup slightly for smoother UX
      hoverTimeout = setTimeout(() => {
        showPopup(star);
      }, 300);
    });

    star.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimeout);
    });

    // Also open on click
    star.addEventListener('click', (e) => {
      e.preventDefault();
      showPopup(star);
    });
  });

  function showPopup(star) {
    const title = star.dataset.title || 'Project';
    const description = star.dataset.description || '';
    const tags = star.dataset.tags ? star.dataset.tags.split(',') : [];
    const icon = star.dataset.icon || '🌟';
    const role = star.dataset.role || '';
    const timeline = star.dataset.timeline || '';
    const projectId = star.dataset.project || '';

    // Populate popup content
    popupIcon.textContent = icon;
    popupTitle.textContent = title;
    popupMeta.textContent = role && timeline ? `${role} • ${timeline}` : (role || timeline);
    popupDescription.textContent = description;

    // Populate tags
    popupTags.innerHTML = '';
    tags.forEach(tag => {
      const tagEl = document.createElement('span');
      tagEl.className = 'tag';
      tagEl.textContent = tag.trim();
      popupTags.appendChild(tagEl);
    });

    // Set CTA link (placeholder for now)
    popupCTA.href = `#project-${projectId}`;

    // Show popup and overlay
    overlay.classList.add('visible');
    popup.classList.add('visible');

    // Focus management for accessibility
    popup.focus();
  }

  function closePopup() {
    overlay.classList.remove('visible');
    popup.classList.remove('visible');
  }

  // Close handlers
  closeBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', closePopup);

  // Keyboard close (Escape key)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('visible')) {
      closePopup();
    }
  });

  // Prevent popup from closing when clicking inside it
  popup.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// --- PROJECT STAR INTERACTIONS (Legacy - kept for fallback) ---
function initProjectStars() {
  // This function is now handled by initProjectCardPopup
  // Kept for backwards compatibility
}

// --- WORKS PAGE FILTERING ---
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-button');
  const missionCards = document.querySelectorAll('.mission-card');

  if (filterButtons.length === 0) return;

  // Function to apply filter
  function applyFilter(filter) {
    // Update active state
    filterButtons.forEach(btn => btn.classList.remove('active'));
    const activeButton = Array.from(filterButtons).find(btn => btn.dataset.filter === filter);
    if (activeButton) {
      activeButton.classList.add('active');
    }

    // Filter cards
    missionCards.forEach(card => {
      if (filter === 'all') {
        card.style.display = 'block';
      } else {
        const tags = card.dataset.tags || '';
        if (tags.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      }
    });
  }

  // Check for URL hash on page load (e.g., works.html#marketing)
  const urlHash = window.location.hash.substring(1); // Remove the #
  if (urlHash && ['marketing', 'digital-art', 'creative'].includes(urlHash)) {
    const filterValue = urlHash === 'creative' ? 'digital-art' : urlHash;
    applyFilter(filterValue);

    // Scroll to top of projects after a brief delay
    setTimeout(() => {
      const projectsGrid = document.querySelector('.projects-grid');
      if (projectsGrid) {
        projectsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      applyFilter(filter);
    });
  });
}

// --- SMOOTH SCROLL FOR ANCHOR LINKS ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#contact') return; // Skip placeholder links

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: isMotionReduced() ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// --- KEYBOARD ACCESSIBILITY ENHANCEMENTS ---
function initA11yEnhancements() {
  // Skip to main content link (optional enhancement)
  const firstHeading = document.querySelector('h1');
  if (firstHeading) {
    firstHeading.setAttribute('tabindex', '-1');
  }

  // Announce page changes for screen readers
  const pageTitle = document.title;
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = `Page loaded: ${pageTitle}`;
  document.body.appendChild(announcement);
}

// --- CONTACT FORM HANDLING ---
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('.contact-submit');
    const originalText = submitButton.textContent;

    // Get form data
    const formData = {
      name: contactForm.querySelector('#name').value,
      email: contactForm.querySelector('#email').value,
      message: contactForm.querySelector('#message').value
    };

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = '🚀 Launching...';

    try {
      // Submit to Formsubmit.co — no account needed.
      // NOTE: The very first submission will send a one-time activation email
      // to texashero3@gmail.com. Click the confirmation link once, then all
      // future submissions will arrive in your inbox automatically.
      const response = await fetch('https://formsubmit.co/ajax/texashero3@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Portfolio contact from ${formData.name}`,
          _captcha: 'false'
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      // Success state
      submitButton.textContent = '✅ Message Sent!';
      submitButton.style.background = 'var(--color-pop-success)';

      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'form-success-message';
      successMsg.textContent = 'Thanks for reaching out! I\'ll get back to you soon.';
      successMsg.style.cssText = `
        background: var(--color-pop-success);
        color: var(--color-bg);
        padding: var(--space-md);
        border-radius: var(--radius-md);
        margin-top: var(--space-md);
        text-align: center;
        font-weight: 600;
      `;
      contactForm.appendChild(successMsg);

      // Reset form
      contactForm.reset();

      // Reset button after 3 seconds
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.style.background = '';
        if (successMsg.parentNode) {
          successMsg.remove();
        }
      }, 3000);

    } catch (error) {
      // Error state
      submitButton.textContent = '❌ Error - Try Again';
      submitButton.style.background = 'rgba(255, 68, 68, 0.6)';

      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.style.background = '';
      }, 3000);

      console.error('Form submission error:', error);
    }
  });
}

// --- PROJECT CAROUSEL ---
function initProjectCarousels() {
  const carousels = document.querySelectorAll('.project-carousel');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const images = carousel.querySelectorAll('.project-image');

    if (!track || images.length === 0) return;

    let currentIndex = 0;
    const totalImages = images.length;

    function updateCarousel(index) {
      // Update track position
      const offset = -index * 100;
      track.style.transform = `translateX(${offset}%)`;

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      currentIndex = index;
    }

    function nextImage() {
      const newIndex = (currentIndex + 1) % totalImages;
      updateCarousel(newIndex);
    }

    function prevImage() {
      const newIndex = (currentIndex - 1 + totalImages) % totalImages;
      updateCarousel(newIndex);
    }

    // Button event listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        prevImage();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        nextImage();
      });
    }

    // Dot event listeners
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateCarousel(index);
      });
    });

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const carouselLink = carousel.closest('a');

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe(e);
    });

    function handleSwipe(e) {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        // Prevent link navigation when swiping
        if (carouselLink) {
          e.preventDefault();
        }
        if (diff > 0) {
          nextImage();
        } else {
          prevImage();
        }
      }
    }
  });
}

// --- AI PARTNERSHIP PAGE STARFIELD ---
function initAIStarfield() {
  const canvas = document.getElementById('ai-starfield-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const stars = [];
  const numStars = 80;

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.01
    });
  }

  let frame = 0;
  function drawStarfield() {
    if (isMotionReduced()) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 199, 245, ${star.opacity})`;
        ctx.fill();
      });
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      const twinkle = Math.sin(frame * star.twinkleSpeed) * 0.3;
      const currentOpacity = star.opacity + twinkle;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 199, 245, ${currentOpacity})`;
      ctx.fill();
    });

    frame++;
    requestAnimationFrame(drawStarfield);
  }

  drawStarfield();
}

// --- AI PROJECTS STARFIELD ---
function initAIProjectsStarfield() {
  const canvas = document.getElementById('ai-projects-starfield-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const stars = [];
  const numStars = 60;

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2 + 0.4,
      opacity: Math.random() * 0.4 + 0.2,
      twinkleSpeed: Math.random() * 0.015 + 0.008
    });
  }

  let frame = 0;
  function drawStarfield() {
    if (isMotionReduced()) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 199, 245, ${star.opacity})`;
        ctx.fill();
      });
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      const twinkle = Math.sin(frame * star.twinkleSpeed) * 0.25;
      const currentOpacity = star.opacity + twinkle;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 199, 245, ${currentOpacity})`;
      ctx.fill();
    });

    frame++;
    requestAnimationFrame(drawStarfield);
  }

  drawStarfield();
}

// --- AI TOOL POPUP ---
function initAIToolPopup() {
  const aiStars = document.querySelectorAll('.ai-star');
  const popup = document.getElementById('aiToolPopup');
  const overlay = document.getElementById('aiPopupOverlay');
  const closeBtn = document.getElementById('aiPopupClose');
  const popupContent = document.getElementById('aiPopupContent');

  if (!popup || !overlay || !popupContent) return;

  const toolData = {
    copilot: {
      title: 'GitHub Copilot',
      description: 'My primary AI pair programmer. Copilot accelerates coding with intelligent autocomplete, helps me learn new APIs faster, and generates boilerplate code so I can focus on architecture.',
      benefits: [
        'Real-time code suggestions and completions',
        'Context-aware function generation',
        'Reduces repetitive coding tasks',
        'Helps explore unfamiliar frameworks quickly'
      ]
    },
    claude: {
      title: 'Claude',
      description: 'Advanced conversational AI for complex problem-solving, architecture planning, and deep debugging. Claude excels at understanding nuanced requirements and providing detailed, thoughtful solutions.',
      benefits: [
        'Complex debugging and error analysis',
        'System architecture design discussions',
        'Code refactoring and optimization suggestions',
        'Natural language explanations of technical concepts'
      ]
    },
    chatgpt: {
      title: 'ChatGPT',
      description: 'Versatile AI assistant for brainstorming, learning new technologies, and rapid prototyping. Perfect for exploring multiple solutions to problems and getting quick answers.',
      benefits: [
        'Rapid idea generation and brainstorming',
        'Learning new frameworks and libraries',
        'Code explanation and documentation',
        'Quick problem-solving and debugging'
      ]
    },
    codespaces: {
      title: 'GitHub Codespaces',
      description: 'Cloud-based development environments that let me code anywhere with zero setup time. Seamless integration with AI tools and instant project deployment.',
      benefits: [
        'Code from any device with full IDE power',
        'Zero-configuration development environments',
        'Integrated AI assistance and collaboration',
        'Consistent setup across all projects'
      ]
    },
    codex: {
      title: 'OpenAI Codex',
      description: 'The AI model powering many coding assistants. I use Codex-based tools for natural language to code translation and complex code generation tasks.',
      benefits: [
        'Natural language to code translation',
        'Multi-language code generation',
        'API integration automation',
        'Complex algorithm implementation'
      ]
    },
    'always-learning': {
      title: 'Continuous Learning',
      description: 'Always expanding my AI toolkit with new tools and workflows. Currently building a custom Adobe Photoshop tool using Claude Sonnet in VS Code, and working on a top-secret aerospace gamification project. Exploring multi-stage AI collaboration across planning, research, and coding phases.',
      benefits: [
        'Multi-tool AI workflows (Claude + Copilot + Claude Sonnet)',
        'Adobe Photoshop extension development in progress',
        'Secret aerospace gamified app (orbit.tiff labs)',
        'Expanding technical expertise across ecosystems'
      ]
    }
  };

  function openPopup(toolKey) {
    const tool = toolData[toolKey];
    if (!tool) return;

    let benefitsHTML = tool.benefits.map(b => `<li>${b}</li>`).join('');

    popupContent.innerHTML = `
      <h3>${tool.title}</h3>
      <p>${tool.description}</p>
      <ul>
        ${benefitsHTML}
      </ul>
    `;

    popup.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    popup.focus();
  }

  function closePopup() {
    popup.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Attach click handlers to AI stars
  aiStars.forEach(star => {
    star.addEventListener('click', () => {
      const toolKey = star.dataset.tool;
      openPopup(toolKey);
    });

    // Keyboard support
    star.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const toolKey = star.dataset.tool;
        openPopup(toolKey);
      }
    });
  });

  // Close handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }

  if (overlay) {
    overlay.addEventListener('click', closePopup);
  }

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
      closePopup();
    }
  });
}

// --- INITIALIZE ALL FEATURES ON PAGE LOAD ---
// --- HAMBURGER MENU ---
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.querySelector('.main-nav');
  const navOverlay = document.getElementById('navOverlay');

  if (!hamburger || !mainNav) return;

  function openMenu() {
    hamburger.setAttribute('aria-expanded', 'true');
    mainNav.classList.add('open');
    if (navOverlay) navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Move focus into the nav
    const firstLink = mainNav.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Close when clicking overlay
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Close when a nav link is clicked (single-page anchor links)
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) closeMenu();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close drawer when resizing back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mainNav.classList.contains('open')) {
      closeMenu();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Core features
  initMotionPreference();
  initHamburgerMenu();       // Mobile nav drawer
  initStarfield();
  initSmoothScroll();
  initA11yEnhancements();
  initContactForm();         // Contact form handling
  initProjectCarousels();    // Project image carousels
  initTelescopeFollower();   // Global custom telescope cursor
  initCursorToggle();        // Cursor decoration toggle button

  // Page-specific features
  initRocketLaunch();        // Home page
  initRocketLanding();       // About page
  initProjectCardPopup();    // Home page - card popups
  initProjectStars();        // Home page - legacy support
  initProjectFilters();      // Works page

  // AI Partnership page features
  initAIStarfield();         // AI tools starfield
  initAIProjectsStarfield(); // AI projects starfield
  initAIToolPopup();         // AI tool popup interactions
  initBizCardFlip();         // Mission Dossier business card tap-to-flip

  console.log('🚀 orbit.tiff mission control initialized');
});

// --- BUSINESS CARD TAP-TO-FLIP (mobile touch support) ---
function initBizCardFlip() {
  document.querySelectorAll('.biz-flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
    // Keyboard: Enter or Space toggles flip
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}


// --- SCREEN READER ONLY CLASS (if needed) ---
// Add this to CSS if not already present:
const style = document.createElement('style');
style.textContent = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;
document.head.appendChild(style);
