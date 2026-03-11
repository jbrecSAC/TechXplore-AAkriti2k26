document.addEventListener("DOMContentLoaded", () => {
  /* ---- CURSOR GLOW ---- */
  const glow = document.getElementById("cursorGlow");
  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });

  /* ---- NAVBAR SCROLL EFFECT ---- */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  });

  /* ---- MOBILE THEME TOGGLE MOVE ---- */
  const themeSwitcher = document.getElementById("themeSwitcher");
  const navActions = document.querySelector(".nav-actions");
  const navLinksContainer = document.getElementById("navLinks");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  function handleThemeSwitcherPosition() {
    if (window.innerWidth < 768) {
      if (themeSwitcher.parentNode !== navLinksContainer) {
        navLinksContainer.appendChild(themeSwitcher);
      }
    } else {
      if (themeSwitcher.parentNode !== navActions) {
        navActions.insertBefore(themeSwitcher, mobileMenuBtn);
      }
    }
  }
  // Execute on initial render
  handleThemeSwitcherPosition();

  /* ---- MOBILE MENU LOGIC ---- */
  const mobileOverlay = document.getElementById("mobileMenuOverlay");
  const navLinksItems = navLinksContainer.querySelectorAll("a");

  function toggleMenu() {
    mobileMenuBtn.classList.toggle("active");
    navLinksContainer.classList.toggle("active");
    mobileOverlay.classList.toggle("active");

    if (mobileMenuBtn.classList.contains("active")) {
      document.body.style.overflow = "hidden";

      // MOBILE THEME TOGGLE MOVE: Recalculate slider sizing when menu animates open
      setTimeout(() => {
        const active = document.querySelector(".theme-btn.active");
        if (active) updateSliderPosition(active);
      }, 300); // 300ms matches transition
    } else {
      document.body.style.overflow = "";
    }
  }

  mobileMenuBtn.addEventListener("click", toggleMenu);
  mobileOverlay.addEventListener("click", toggleMenu);

  navLinksItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileMenuBtn.classList.contains("active")) {
        toggleMenu();
      }
    });
  });

  /* ---- THEME MANAGEMENT ---- */
  const html = document.documentElement;
  const themeBtns = document.querySelectorAll(".theme-btn");
  const themeSlider = document.getElementById("themeSlider");
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme) {
    if (theme === "system") {
      html.setAttribute("data-theme", mediaQuery.matches ? "dark" : "light");
    } else {
      html.setAttribute("data-theme", theme);
    }
  }

  function updateSliderPosition(activeBtn) {
    themeBtns.forEach((btn) => btn.classList.remove("active"));
    activeBtn.classList.add("active");
    themeSlider.style.width = `${activeBtn.offsetWidth}px`;
    themeSlider.style.transform = `translateX(${activeBtn.offsetLeft - 3}px)`;
  }

  // Init
  const savedTheme = localStorage.getItem("sac-theme") || "dark";
  applyTheme(savedTheme);

  setTimeout(() => {
    const initBtn = Array.from(themeBtns).find(
      (b) => b.dataset.themeVal === savedTheme,
    );
    if (initBtn) updateSliderPosition(initBtn);
  }, 120);

  themeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const theme = e.currentTarget.dataset.themeVal;
      localStorage.setItem("sac-theme", theme);
      applyTheme(theme);
      updateSliderPosition(e.currentTarget);
    });
  });

  mediaQuery.addEventListener("change", () => {
    if (localStorage.getItem("sac-theme") === "system") applyTheme("system");
  });

  window.addEventListener("resize", () => {
    // Relocate Switcher if threshold crossed
    handleThemeSwitcherPosition();

    // Wait for the DOM repainting to update slider accurately
    requestAnimationFrame(() => {
      const active = document.querySelector(".theme-btn.active");
      if (active) updateSliderPosition(active);

      // Prevent stuck menu state on resize
      if (
        window.innerWidth > 768 &&
        mobileMenuBtn.classList.contains("active")
      ) {
        toggleMenu();
      }
    });
  });

  /* ---- SCROLL REVEAL ---- */
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  reveals.forEach((el) => observer.observe(el));

  // Immediate check for in-viewport elements
  setTimeout(() => {
    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add("active");
      }
    });
  }, 100);
});
