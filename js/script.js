document.addEventListener("DOMContentLoaded", function () {
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const logo = document.getElementById("logoBrand");
  const siteNavbar = document.getElementById("siteNavbar");
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptCookiesButton = document.getElementById("acceptCookies");
  const rejectCookiesButton = document.getElementById("rejectCookies");
  const cookieConsentKey = "ites_cookie_consent";
  const jobApplicationForm =
    document.getElementById("jobApplicationForm") ||
    document.getElementById("contactForm");
  const jobApplicationStatus =
    document.getElementById("jobApplicationStatus") ||
    document.getElementById("contactFormStatus");
  const candidateRoleInput = document.getElementById("candidateRole");
  const jobOpportunityModal = document.getElementById("jobOpportunityModal");
  const jobApplicationSection = document.getElementById("jobApplicationSection");
  const parallaxSections = document.querySelectorAll(
    ".titolo-pagina-chiSiamo, .titolo-pagina-servizi, .titolo-pagina-servizi-urbani, .titolo-pagina-servizi-sicurezza, .titolo-pagina-impianti-elettrici, .titolo-paginaCertificazioni, .titolo-paginaLavoraConNoi, .titolo-paginaContatti, .valori, .security-services-benefits"
  );

  function setupScrollReveals() {
    const revealElements = [];

    function registerReveal(element, effect, delay) {
      if (!element || element.dataset.revealConfigured === "true") {
        return;
      }

      element.dataset.reveal = effect || "up";
      element.dataset.revealConfigured = "true";

      if (typeof delay === "number" && delay > 0) {
        element.style.setProperty("--reveal-delay", delay + "ms");
      }

      revealElements.push(element);
    }

    function registerSelector(selector, effect) {
      document.querySelectorAll(selector).forEach(function (element) {
        registerReveal(element, effect, 0);
      });
    }

    function registerGroup(parentSelector, childSelector, effect, stagger) {
      document.querySelectorAll(parentSelector).forEach(function (parent) {
        parent.querySelectorAll(childSelector).forEach(function (child, index) {
          registerReveal(child, effect, (stagger || 0) * index);
        });
      });
    }

    registerGroup(".videoHero__overlay", ".videoHero__line", "up", 90);
    registerGroup(".home-hero", ".titoloPresentazione, .elementor-divider, .testoPresentazione, .heroActions", "up", 100);
    registerGroup(".homeStats", ".statCard", "up", 90);
    registerGroup(".homeGallery__row", ".valueCard", "scale", 100);
    registerGroup(".homeServices__content", ".eyebrowHome, .homeServices__title, .homeServices__divider, .homeServices__text, .homeServices__actions", "up", 90);
    registerGroup(".homeServices__sectors", ".homeServiceSectorCard", "up", 100);

    registerSelector(".titolo-pagina-chiSiamo .about-hero, .titolo-pagina-servizi .col, .titolo-pagina-servizi-urbani .col, .titolo-pagina-servizi-sicurezza .col, .titolo-pagina-impianti-elettrici .col, .titolo-paginaCertificazioni .col, .titolo-paginaLavoraConNoi .col, .titolo-paginaContatti .col", "up");
    registerGroup(".presentazioneITES", ".row:first-child, .elementor-divider-separatorChiSiamo, .row:last-child", "up", 100);
    registerGroup(".timeline--history", ".timeline-item", "left", 70);
    registerGroup(".valori", ".row, .cards-container", "up", 110);
    registerGroup(".cards-container", ".col-12", "up", 90);

    registerSelector(".services-showcase__intro, .contact-showcase__intro, .paragrafo, .contact-map-section, .formContatti, .presentazione-lavoro > .titolo2, .job-board-intro, .job-board-note, .lavora-con-noi-form-section > .titolo2, .application-form-wrapper, .security-services-intro, .urban-services-intro, .electrical-services-intro, .comfort-services-intro, .security-services-benefits__intro, .urban-services-benefits__intro, .electrical-services-benefits__intro, .comfort-services-benefits__intro", "up");
    registerGroup(".services-showcase__grid", ".services-showcase-card", "up", 100);
    registerGroup(".contact-showcase__grid", ".contact-card", "up", 90);
    registerGroup(".job-openings", ".job-opening-card", "up", 100);
    registerGroup(".containerCertificazioni", ".certificazione", "scale", 100);
    registerGroup(".security-services-grid", ".security-service-card", "up", 90);
    registerGroup(".urban-services-grid", ".urban-service-card", "up", 90);
    registerGroup(".electrical-services-grid", ".electrical-service-card", "up", 90);
    registerGroup(".comfort-services-grid", ".comfort-service-card", "up", 90);
    registerGroup(".security-services-benefits__list", ".security-benefit-card", "up", 90);
    registerGroup(".urban-services-benefits__list", ".urban-benefit-card", "up", 90);
    registerGroup(".electrical-services-benefits__list", ".electrical-benefit-card", "up", 90);
    registerGroup(".comfort-services-benefits__list", ".comfort-benefit-card", "up", 90);
    registerGroup(".security-services-cta", ".security-services-cta__eyebrow, .security-services-cta__title, .security-services-cta__text, .security-services-cta__actions", "up", 90);
    registerGroup(".urban-services-cta", ".urban-services-cta__eyebrow, .urban-services-cta__title, .urban-services-cta__text, .urban-services-cta__actions", "up", 90);
    registerGroup(".electrical-services-cta", ".electrical-services-cta__eyebrow, .electrical-services-cta__title, .electrical-services-cta__text, .electrical-services-cta__actions", "up", 90);
    registerGroup(".comfort-services-cta", ".comfort-services-cta__eyebrow, .comfort-services-cta__title, .comfort-services-cta__text, .comfort-services-cta__actions", "up", 90);
    registerGroup(".site-footer__inner", ".site-footer__brand, .site-footer__section", "up", 90);
    registerSelector(".site-footer__divider", "up");

    if (revealElements.length === 0) {
      return;
    }

    document.documentElement.classList.add("reveal-ready");

    if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
      revealElements.forEach(function (element) {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealElements.forEach(function (element) {
      observer.observe(element);
    });
  }

  if (parallaxSections.length > 0) {
    let rafId = null;

    function shouldUseMobileParallax() {
      return window.matchMedia("(max-width: 1199.98px)").matches;
    }

    function updateMobileParallax() {
      rafId = null;

      if (!shouldUseMobileParallax()) {
        parallaxSections.forEach(function (section) {
          section.style.removeProperty("--mobile-parallax-offset");
        });
        return;
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      parallaxSections.forEach(function (section) {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const distanceFromCenter = sectionCenter - viewportCenter;
        const offset = Math.max(Math.min(distanceFromCenter * -0.18, 90), -90);

        section.style.setProperty("--mobile-parallax-offset", offset.toFixed(2) + "px");
      });
    }

    function requestParallaxUpdate() {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(updateMobileParallax);
    }

    updateMobileParallax();
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);
    window.addEventListener("orientationchange", requestParallaxUpdate);
  }

  if (logo) {
    logo.addEventListener("click", function () {
      window.location.pathname = "index.html";
    });
  }

  if (siteNavbar) {
    const disableTransparentNavbar = document.body.classList.contains("policy-page");

    function syncNavbarOnScroll() {
      if (disableTransparentNavbar) {
        siteNavbar.classList.add("navbar-scrolled");
        return;
      }

      siteNavbar.classList.toggle("navbar-scrolled", window.scrollY > 0);
    }

    syncNavbarOnScroll();
    window.addEventListener("scroll", syncNavbarOnScroll, { passive: true });
  }

  if (cookieBanner && acceptCookiesButton && rejectCookiesButton) {
    const savedConsent = localStorage.getItem(cookieConsentKey);

    if (!savedConsent) {
      cookieBanner.hidden = false;
    }

    function saveCookiePreference(choice) {
      localStorage.setItem(cookieConsentKey, choice);
      cookieBanner.hidden = true;
    }

    acceptCookiesButton.addEventListener("click", function () {
      saveCookiePreference("accepted");
    });

    rejectCookiesButton.addEventListener("click", function () {
      saveCookiePreference("rejected");
    });
  }

  if (jobOpportunityModal) {
    const modalTitle = document.getElementById("jobOpportunityModalLabel");
    const modalSummary = document.getElementById("jobModalSummary");
    const modalLocation = document.getElementById("jobModalLocation");
    const modalContract = document.getElementById("jobModalContract");
    const modalActivities = document.getElementById("jobModalActivities");
    const modalRequirements = document.getElementById("jobModalRequirements");
    const modalApplyButton = jobOpportunityModal.querySelector(".job-modal-apply");
    let selectedJobTitle = "";
    let shouldScrollToApplicationForm = false;

    function renderList(targetElement, values) {
      if (!targetElement) {
        return;
      }

      targetElement.innerHTML = "";

      values.forEach(function (value) {
        const listItem = document.createElement("li");
        listItem.textContent = value;
        targetElement.appendChild(listItem);
      });
    }

    jobOpportunityModal.addEventListener("show.bs.modal", function (event) {
      const triggerButton = event.relatedTarget;

      if (!triggerButton) {
        return;
      }

      selectedJobTitle = triggerButton.getAttribute("data-job-title") || "";

      if (modalTitle) {
        modalTitle.textContent = selectedJobTitle || "Posizione aperta";
      }

      if (modalSummary) {
        modalSummary.textContent = triggerButton.getAttribute("data-job-summary") || "";
      }

      if (modalLocation) {
        modalLocation.textContent = triggerButton.getAttribute("data-job-location") || "";
      }

      if (modalContract) {
        modalContract.textContent = triggerButton.getAttribute("data-job-contract") || "";
      }

      renderList(
        modalActivities,
        (triggerButton.getAttribute("data-job-activities") || "")
          .split("|")
          .filter(Boolean)
      );

      renderList(
        modalRequirements,
        (triggerButton.getAttribute("data-job-requirements") || "")
          .split("|")
          .filter(Boolean)
      );

      if (modalApplyButton) {
        modalApplyButton.setAttribute("data-job-title", selectedJobTitle);
      }
    });

    if (modalApplyButton) {
      modalApplyButton.addEventListener("click", function () {
        if (candidateRoleInput && selectedJobTitle) {
          candidateRoleInput.value = selectedJobTitle;
        }

        shouldScrollToApplicationForm = true;
      });
    }

    jobOpportunityModal.addEventListener("hidden.bs.modal", function () {
      if (!shouldScrollToApplicationForm) {
        return;
      }

      shouldScrollToApplicationForm = false;

      if (jobApplicationSection) {
        jobApplicationSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      window.setTimeout(function () {
        if (candidateRoleInput) {
          candidateRoleInput.focus();
        }
      }, 250);
    });
  }

  if (jobApplicationForm) {
    jobApplicationForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(jobApplicationForm);
      const submitButton = jobApplicationForm.querySelector('button[type="submit"]');
      const formEndpoint = (jobApplicationForm.getAttribute("action") || "").trim();
      const successMessage =
        jobApplicationForm.getAttribute("data-success-message") ||
        "Candidatura inviata con successo. Ti contatteremo al piu presto.";

      if (!formEndpoint) {
        if (jobApplicationStatus) {
          jobApplicationStatus.textContent =
            "Configura l'endpoint backend del form.";
          jobApplicationStatus.className = "application-form-status is-error";
        }

        return;
      }

      if (jobApplicationStatus) {
        jobApplicationStatus.textContent = "Invio in corso...";
        jobApplicationStatus.className = "application-form-status is-pending";
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const response = await fetch(formEndpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        let result = null;
        let rawResponseText = "";

        try {
          result = await response.json();
        } catch (parseError) {
          rawResponseText = await response.text();
        }

        if (response.ok) {
          jobApplicationForm.reset();

          if (jobApplicationStatus) {
            jobApplicationStatus.textContent = successMessage;
            jobApplicationStatus.className = "application-form-status is-success";
          }
        } else {
          const errorDetails =
            result && Array.isArray(result.errors) && result.errors.length > 0
              ? result.errors
                  .map(function (errorItem) {
                    return errorItem.message || errorItem.code || "Errore sconosciuto";
                  })
                  .join(" | ")
              : result && result.error
                ? result.error
                : result && result.message
                  ? result.message
                  : rawResponseText
                    ? rawResponseText
                    : "Invio non riuscito.";

          throw new Error(errorDetails);
        }
      } catch (error) {
        if (jobApplicationStatus) {
          jobApplicationStatus.textContent =
            error.message || "Invio non riuscito. Controlla la configurazione del backend e riprova.";
          jobApplicationStatus.className = "application-form-status is-error";
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  setupScrollReveals();
});
