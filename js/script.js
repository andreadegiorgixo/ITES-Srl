document.addEventListener("DOMContentLoaded", function () {
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
    function syncNavbarOnScroll() {
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
});
