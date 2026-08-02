!function () {
  "use strict";

  var detail = document.querySelector(".l-productMovieDetail");
  var videoModal = document.querySelector(".l-productMovieModal");
  var detailTrigger = null;
  var videoTrigger = null;
  var mobileMenu = document.querySelector(".l-pager");
  var mobileMenuToggle = document.querySelector(".l-mobileMenuToggle");
  var mobileMenuBackdrop = document.querySelector(".l-mobileMenuBackdrop");
  var mobileMenuMedia = window.matchMedia("(max-width: 768px)");
  var pageBackground = Array.prototype.slice.call(document.querySelectorAll(
    "main, header, nav, .l-fixui_logo, .l-fixui_contact, .l-fixui_sound, .l-mobileMenuToggle"
  ));

  function closeMobileMenu(restoreFocus) {
    if (!mobileMenuToggle) return;
    document.documentElement.classList.remove("is-mobile-menu-open");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenuToggle.setAttribute("aria-label", "打开导航");
    if (restoreFocus) mobileMenuToggle.focus({ preventScroll: true });
  }

  function openMobileMenu() {
    if (!mobileMenuToggle || !mobileMenuMedia.matches) return;
    document.documentElement.classList.add("is-mobile-menu-open");
    mobileMenuToggle.setAttribute("aria-expanded", "true");
    mobileMenuToggle.setAttribute("aria-label", "关闭导航");
  }

  function toggleMobileMenu() {
    if (mobileMenuToggle.getAttribute("aria-expanded") === "true") {
      closeMobileMenu(true);
    } else {
      openMobileMenu();
    }
  }

  if (mobileMenuBackdrop) {
    mobileMenuBackdrop.addEventListener("click", function () {
      closeMobileMenu(true);
    });
  }

  window.addEventListener("click", function (event) {
    var target = event.target;
    var mobileMenuButton = target.closest && target.closest(".l-mobileMenuToggle");
    if (mobileMenuButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleMobileMenu();
      return;
    }
    var mobileMenuLink = target.closest && target.closest("#primary-navigation a[href]");
    if (mobileMenuLink && document.documentElement.classList.contains("is-mobile-menu-open")) {
      closeMobileMenu(false);
    }
  }, true);

  if (mobileMenuMedia.addEventListener) {
    mobileMenuMedia.addEventListener("change", function (event) {
      if (!event.matches) closeMobileMenu(false);
    });
  }

  function setPageInert(value) {
    pageBackground.forEach(function (element) {
      if (value) {
        element.setAttribute("inert", "");
        element.setAttribute("aria-hidden", "true");
      } else {
        element.removeAttribute("inert");
        element.removeAttribute("aria-hidden");
      }
    });
  }

  function isVisible(element) {
    return Boolean(element && element.getClientRects().length && window.getComputedStyle(element).visibility !== "hidden");
  }

  function focusableElements(container) {
    if (!container) return [];
    return Array.prototype.slice.call(container.querySelectorAll(
      'a[href], button, video[controls], [role="button"][tabindex="0"], [tabindex]:not([tabindex="-1"])'
    )).filter(function (element) {
      return !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true" && isVisible(element);
    });
  }

  function setProductInfo(productId) {
    if (!detail) return;
    detail.querySelectorAll(".js-info-list").forEach(function (info) {
      info.setAttribute("aria-hidden", info.getAttribute("data-id") === productId ? "false" : "true");
    });
  }

  function openDetail(trigger) {
    if (!detail) return;
    detailTrigger = trigger;
    detail.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");
    setProductInfo(trigger.getAttribute("data-id"));
    setPageInert(true);
    detail.focus({ preventScroll: true });
    var close = detail.querySelector(":scope > .l-closeBtn");
    if (close) close.focus({ preventScroll: true });
    window.setTimeout(function () {
      var currentClose = detail.querySelector(":scope > .l-closeBtn");
      if (detail.getAttribute("aria-hidden") === "false" && currentClose) {
        detail.focus({ preventScroll: true });
      }
    }, 1800);
  }

  function closeDetail() {
    if (!detail) return;
    detail.setAttribute("aria-hidden", "true");
    setPageInert(false);
    document.querySelectorAll(".js-pdetailMovieBtn[aria-expanded]").forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
    });
    if (detailTrigger && document.contains(detailTrigger)) {
      window.setTimeout(function () { detailTrigger.focus(); }, 250);
    }
  }

  function openVideo(trigger) {
    if (!videoModal) return;
    videoTrigger = trigger;
    videoModal.setAttribute("aria-hidden", "false");
    window.setTimeout(function () {
      var close = videoModal.querySelector(".l-closeBtn-bold");
      if (isVisible(close)) close.focus();
    }, 100);
  }

  function closeVideo() {
    if (!videoModal) return;
    videoModal.setAttribute("aria-hidden", "true");
    if (videoTrigger && document.contains(videoTrigger)) {
      window.setTimeout(function () { videoTrigger.focus(); }, 100);
    }
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && document.documentElement.classList.contains("is-mobile-menu-open")) {
      event.preventDefault();
      closeMobileMenu(true);
      return;
    }

    var button = event.target.closest && event.target.closest('[role="button"], .js-pdetailMovieBtn');
    if (button && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      button.click();
      return;
    }

    var activeDialog = videoModal && videoModal.getAttribute("aria-hidden") === "false"
      ? videoModal
      : detail && detail.getAttribute("aria-hidden") === "false"
        ? detail
        : null;

    if (!activeDialog) return;

    if (event.key === "Escape") {
      event.preventDefault();
      if (activeDialog === videoModal) {
        var videoClose = videoModal.querySelector(".l-closeBtn-bold");
        if (videoClose) videoClose.click();
      } else {
        var detailClose = detail.querySelector(":scope > .l-closeBtn");
        if (detailClose) detailClose.click();
      }
      return;
    }

    if (event.key === "Tab") {
      var focusable = focusableElements(activeDialog);
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  document.addEventListener("keyup", function (event) {
    var productButton = event.target.closest && event.target.closest(".js-pdetailMovieBtn");
    if (!productButton || (event.key !== "Enter" && event.key !== " ")) return;
    if (!detail || detail.getAttribute("aria-hidden") !== "false") return;
    event.preventDefault();
    var close = detail.querySelector(":scope > .l-closeBtn");
    if (close) close.focus({ preventScroll: true });
  }, true);

  document.addEventListener("focusin", function (event) {
    var activeDialog = videoModal && videoModal.getAttribute("aria-hidden") === "false"
      ? videoModal
      : detail && detail.getAttribute("aria-hidden") === "false"
        ? detail
        : null;
    if (!activeDialog || activeDialog.contains(event.target)) return;
    var focusable = focusableElements(activeDialog);
    if (focusable.length) focusable[0].focus();
  }, true);

  document.addEventListener("click", function (event) {
    var target = event.target;
    var homeLogo = target.closest && target.closest(".l-fixui_logo");
    if (homeLogo) {
      event.preventDefault();
      return;
    }

    var productButton = target.closest && target.closest(".js-pdetailMovieBtn");
    if (productButton) {
      openDetail(productButton);
      return;
    }

    var playButton = target.closest && target.closest(".js-movie-play-btn");
    if (playButton) {
      openVideo(playButton);
      return;
    }

    if (target.closest && target.closest(".l-productMovieModal .l-closeBtn-bold")) {
      closeVideo();
      return;
    }

    var detailClose = target.closest && target.closest(".l-productMovieDetail > .l-closeBtn");
    if (detailClose) closeDetail();
  }, true);
}();
