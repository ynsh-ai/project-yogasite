document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------------------------------
     1. Mobile Navigation Menu
     -------------------------------------------------------------------------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const menuText = menuToggle?.querySelector(".menu-text");

  function closeMenu() {
    if (nav?.classList.contains("open")) {
      nav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      if (menuText) menuText.textContent = "Menu";
    }
  }

  function toggleMenu() {
    const isExpanded = menuToggle?.getAttribute("aria-expanded") === "true";
    const nextState = !isExpanded;
    
    nav?.classList.toggle("open", nextState);
    menuToggle?.setAttribute("aria-expanded", String(nextState));
    if (menuText) {
      menuText.textContent = nextState ? "Close" : "Menu";
    }
  }

  menuToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (e) => {
    if (nav?.classList.contains("open") && !nav.contains(e.target) && !menuToggle?.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav?.classList.contains("open")) {
      closeMenu();
      menuToggle?.focus();
    }
  });

  /* --------------------------------------------------------------------------
     2. Interactive WhatsApp Visual Tile Customizer (with Event Delegation)
     -------------------------------------------------------------------------- */
  const customizerState = {
    format: "1-on-1 Private Sessions",
    goal: "Weight Loss & Metabolic Toning",
    time: "Morning (6:30 - 8:30 AM)",
    phone: "919286596103"
  };

  const previewEl = document.getElementById("whatsapp-preview-text");
  const whatsappBtn = document.getElementById("customizer-whatsapp-btn");

  function updateWhatsAppPreview() {
    const message = `Namaste Hansika! I would love to join your ${customizerState.format}. My primary focus is ${customizerState.goal}, and my preferred timing is ${customizerState.time}. Could you please share the details?`;
    
    if (previewEl) {
      previewEl.textContent = `\"${message}\"`;
    }

    if (whatsappBtn) {
      const encodedMessage = encodeURIComponent(message);
      whatsappBtn.href = `https://wa.me/${customizerState.phone}?text=${encodedMessage}`;
    }
  }

  function setupTileGroup(groupId, stateKey) {
    const container = document.getElementById(groupId);
    if (!container) return;

    container.addEventListener("click", (e) => {
      const tile = e.target.closest(".tile-card, .pill");
      if (!tile || !container.contains(tile)) return;

      container.querySelectorAll(".tile-card, .pill").forEach((t) => t.classList.remove("active"));
      tile.classList.add("active");
      customizerState[stateKey] = tile.getAttribute("data-val") || tile.textContent.trim();
      updateWhatsAppPreview();
    });
  }

  setupTileGroup("format-options", "format");
  setupTileGroup("goal-options", "goal");
  setupTileGroup("time-options", "time");

  // Run initial preview setup
  updateWhatsAppPreview();

  /* --------------------------------------------------------------------------
     3. Interactive FAQ Accordion
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const content = item.querySelector(".faq-content");

    trigger?.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      const willExpand = !isExpanded;

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          const otherTrigger = otherItem.querySelector(".faq-trigger");
          const otherContent = otherItem.querySelector(".faq-content");
          otherTrigger?.setAttribute("aria-expanded", "false");
          if (otherContent) otherContent.hidden = true;
        }
      });

      trigger.setAttribute("aria-expanded", String(willExpand));
      if (content) {
        content.hidden = !willExpand;
      }
    });
  });

  /* --------------------------------------------------------------------------
     4. Teacher Slideshow & Photo Showcase (Horizontal Right-to-Left Slide Track)
     -------------------------------------------------------------------------- */
  const slideshowTrack = document.getElementById("teacher-slideshow");
  const slider = document.getElementById("teacher-slider");
  const slides = slideshowTrack ? slideshowTrack.querySelectorAll(".slide-item") : [];
  const prevBtn = document.getElementById("slide-prev-btn");
  const nextBtn = document.getElementById("slide-next-btn");
  const dotsContainer = document.getElementById("slide-dots-container");
  const dots = dotsContainer ? dotsContainer.querySelectorAll(".dot-btn") : [];

  let currentSlideIndex = 0;
  let slideshowTimer = null;
  const SLIDESHOW_INTERVAL = 4200;

  function updateSlide(index) {
    if (!slides.length) return;
    const total = slides.length;
    currentSlideIndex = (index + total) % total;

    // Slide track horizontally from right to left
    if (slider) {
      slider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }

    slides.forEach((slide, i) => {
      const isActive = i === currentSlideIndex;
      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, i) => {
      const isActive = i === currentSlideIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  }

  function nextSlide() {
    updateSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    updateSlide(currentSlideIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideshowTimer = setInterval(nextSlide, SLIDESHOW_INTERVAL);
  }

  function stopAutoPlay() {
    if (slideshowTimer) {
      clearInterval(slideshowTimer);
      slideshowTimer = null;
    }
  }

  if (slides.length > 0) {
    prevBtn?.addEventListener("click", () => {
      prevSlide();
      startAutoPlay();
    });

    nextBtn?.addEventListener("click", () => {
      nextSlide();
      startAutoPlay();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        updateSlide(idx);
        startAutoPlay();
      });
    });

    const slideshowWrapper = document.querySelector(".teacher-slideshow-wrap");
    slideshowWrapper?.addEventListener("mouseenter", stopAutoPlay);
    slideshowWrapper?.addEventListener("mouseleave", startAutoPlay);
    slideshowWrapper?.addEventListener("focusin", stopAutoPlay);
    slideshowWrapper?.addEventListener("focusout", startAutoPlay);

    // Keyboard navigation (Left / Right Arrow)
    slideshowWrapper?.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
        startAutoPlay();
      } else if (e.key === "ArrowRight") {
        nextSlide();
        startAutoPlay();
      }
    });

    // Touch Swipe Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slideshowTrack?.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    slideshowTrack?.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diffX = touchStartX - touchEndX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoPlay();
    }, { passive: true });

    startAutoPlay();
  }

  /* --------------------------------------------------------------------------
     5. Certificate Lightbox Modal
     -------------------------------------------------------------------------- */
  const openCertBtn = document.getElementById("open-cert-btn");
  const certModal = document.getElementById("cert-modal");
  const closeCertBtn = document.getElementById("cert-modal-close");
  const certBackdrop = document.getElementById("cert-modal-backdrop");

  function openCertificateModal() {
    if (!certModal) return;
    certModal.hidden = false;
    document.body.style.overflow = "hidden";
    closeCertBtn?.focus();
  }

  function closeCertificateModal() {
    if (!certModal) return;
    certModal.hidden = true;
    document.body.style.overflow = "";
    openCertBtn?.focus();
  }

  openCertBtn?.addEventListener("click", openCertificateModal);
  closeCertBtn?.addEventListener("click", closeCertificateModal);
  certBackdrop?.addEventListener("click", closeCertificateModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && certModal && !certModal.hidden) {
      closeCertificateModal();
    }
  });
});

