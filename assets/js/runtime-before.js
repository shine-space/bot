!function(){"use strict";var e=new URL(".",window.location.href).pathname;e.endsWith("/")||(e+="/"),window.__siteBasePath=e,window.__siteBaseUrl=new URL(e,window.location.origin).href,window.__siteAssetUrl=function(t){return new URL(String(t||"").replace(/^\/+/,""),window.__siteBaseUrl).href};var t=history.pushState.bind(history),i=history.replaceState.bind(history);function n(t){if("string"!=typeof t||"/"===e)return t;var i=new URL(t,window.location.href);return i.origin!==window.location.origin||i.pathname.indexOf(e)===0?t:e+i.pathname.replace(/^\/+/,"")+i.search+i.hash}history.pushState=function(e,i,r){return t(e,i,n(r))},history.replaceState=function(e,t,r){return i(e,t,n(r))}}();
!function(){"use strict";if(!((window.devicePixelRatio||1)<=1))try{Object.defineProperty(window,"devicePixelRatio",{configurable:!0,get:function(){return 1}})}catch(e){}}();
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
    closeMobileMenu(false);
    document.documentElement.classList.add("is-product-detail-open");
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
    document.documentElement.classList.remove("is-product-detail-open");
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
    closeMobileMenu(false);
    document.documentElement.classList.add("is-product-video-open");
    videoModal.setAttribute("aria-hidden", "false");
    window.setTimeout(function () {
      var close = videoModal.querySelector(".l-closeBtn-bold");
      if (isVisible(close)) close.focus();
    }, 100);
  }

  function closeVideo() {
    if (!videoModal) return;
    document.documentElement.classList.remove("is-product-video-open");
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
!function () {
  "use strict";

  var animationFrame = 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobileMedia = window.matchMedia("(max-width: 768px)");

  function easeInOut(value) {
    return value < 0.5
      ? 2 * value * value
      : 1 - Math.pow(-2 * value + 2, 2) / 2;
  }

  function scrollLimit() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function smoothScrollTo(target, onComplete) {
    window.cancelAnimationFrame(animationFrame);
    var start = window.scrollY;
    var end = Math.max(0, Math.min(scrollLimit(), target));
    var distance = end - start;

    if (reduceMotion || Math.abs(distance) < 2) {
      window.scrollTo(0, end);
      if (onComplete) window.requestAnimationFrame(onComplete);
      return;
    }

    var startTime = performance.now();
    animationFrame = window.requestAnimationFrame(function update(time) {
      var progress = Math.min((time - startTime) / 850, 1);
      window.scrollTo(0, start + distance * easeInOut(progress));
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(update);
      } else if (onComplete) {
        window.requestAnimationFrame(onComplete);
      }
    });
  }

  function elementCenterError(element) {
    var rect = element.getBoundingClientRect();
    return rect.top + rect.height / 2 - window.innerHeight / 2;
  }

  function refineCenter(element, attempt) {
    var error = elementCenterError(element);
    if (Math.abs(error) <= 2 || attempt >= 12) return;
    var maximumStep = window.innerHeight * 0.35;
    var correction = error * 0.5;
    var step = Math.max(-maximumStep, Math.min(maximumStep, correction));
    window.scrollTo(0, Math.max(0, Math.min(scrollLimit(), window.scrollY + step)));
    window.setTimeout(function () {
      refineCenter(element, attempt + 1);
    }, 250);
  }

  function centerFirstProduct() {
    var product = document.querySelector(".p-products_content-movie");
    if (!product) return;
    smoothScrollTo(window.scrollY + elementCenterError(product), function () {
      window.setTimeout(function () {
        refineCenter(product, 0);
      }, 250);
    });
  }

  function scrollToSelector(selector) {
    var element = document.querySelector(selector);
    if (element) smoothScrollTo(element.getBoundingClientRect().top + window.scrollY);
  }

  function productsReady() {
    var products = document.querySelector("#products-section");
    var height = document.querySelector(".js-height");
    return Boolean(
      products &&
      height &&
      window.getComputedStyle(products).display !== "none" &&
      window.getComputedStyle(height).display !== "none" &&
      products.offsetHeight > 0
    );
  }

  function whenProductsReady(callback) {
    var frames = 0;
    window.requestAnimationFrame(function wait() {
      frames += 1;
      if (productsReady()) callback();
      else if (frames < 600) window.requestAnimationFrame(wait);
    });
  }

  function showProducts(callback) {
    if (productsReady()) {
      callback();
      return;
    }
    if (window.main && typeof window.main._eClickPager === "function") {
      window.main._eClickPager(0);
      whenProductsReady(callback);
      return;
    }
    var frames = 0;
    window.requestAnimationFrame(function waitForMain() {
      frames += 1;
      if (window.main && typeof window.main._eClickPager === "function") {
        window.main._eClickPager(0);
        whenProductsReady(callback);
      } else if (frames < 180) {
        window.requestAnimationFrame(waitForMain);
      }
    });
  }

  window.addEventListener("click", function (event) {
    var target = event.target;
    var arrow = target && target.closest
      ? target.closest("#products-section > .l-main_ttl .l-scrollAttention")
      : null;
    var about = target && target.closest
      ? target.closest(".l-pager .js-about-nav")
      : null;
    var products = target && target.closest
      ? target.closest(".l-pager .js-products-nav")
      : null;
    var placeholder = target && target.closest
      ? target.closest(".l-pager .is-placeholder")
      : null;
    var consult = target && target.closest
      ? target.closest(".js-t1-consult")
      : null;

    if (arrow) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (mobileMedia.matches) {
        centerFirstProduct();
      } else {
        var height = document.querySelector(".js-height");
        var maximum = height
          ? Math.max(0, height.offsetTop - window.innerHeight)
          : document.documentElement.scrollHeight - window.innerHeight;
        var offset = Math.min(100, 0.12 * window.innerHeight);
        smoothScrollTo(Math.min(maximum, window.innerHeight + offset));
      }
      return;
    }

    if (consult) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (document.querySelector(".p-products .l-contact:not(.is-tmp)")) {
        scrollToSelector(".p-products .l-contact:not(.is-tmp)");
      }
      return;
    }

    if (about) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showProducts(function () { scrollToSelector(".p-about--inline"); });
      return;
    }

    if (products) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showProducts(function () { scrollToSelector("#products-section"); });
      return;
    }

    if (placeholder) event.stopImmediatePropagation();
  }, true);
}();
!function(){"use strict";var e=document.querySelector(".l-loading"),t=document.querySelector(".js-loadingVideo"),i=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(e&&t&&!i){t.muted=!0,t.defaultMuted=!0,t.autoplay=!0,t.loop=!0,t.playsInline=!0,t.setAttribute("muted",""),t.setAttribute("autoplay",""),t.setAttribute("loop",""),t.setAttribute("playsinline",""),t.addEventListener("playing",function(){e.classList.add("is-loading-video-ready")},{once:!0}),t.addEventListener("error",d,{once:!0});var o=t.play();o&&"function"==typeof o.catch&&o.catch(d)}function d(){e.classList.remove("is-loading-video-ready"),t.hidden=!0}}();
!function(){"use strict";var e=document.querySelector(".js-backgroundAudio"),t=document.querySelector(".l-fixui_sound"),n=!document.querySelector(".l-loading"),o=.075,i=0;function a(){document.removeEventListener("pointerdown",s,!0),document.removeEventListener("touchstart",s,!0),document.removeEventListener("keydown",s,!0)}function u(){var t=Date.now();window.cancelAnimationFrame(i),e.volume=0,function n(){var a=Math.min(1,(Date.now()-t)/900);e.volume=o*a,a<1&&(i=window.requestAnimationFrame(n))}()}function r(t){e.muted=!1;var n=e.play();if(!n||"function"!=typeof n.then)return t&&u(),void a();n.then(function(){t?u():e.volume=o,a()}).catch(function(){})}function d(){if(t){var n=e.paused;t.classList.toggle("is-paused",n),t.setAttribute("aria-label",n?"播放背景音乐":"暂停背景音乐"),t.setAttribute("aria-pressed",n?"false":"true")}}function c(t){t.preventDefault(),t.stopImmediatePropagation(),e.paused?r(!0):(window.cancelAnimationFrame(i),e.pause())}function s(o){if(!t||!t.contains(o.target))if(n)r(!0);else{e.volume=0;var i=e.play();i&&"function"==typeof i.catch&&i.catch(function(){})}}e&&(e.loop=!0,e.preload="auto",e.volume=o,document.addEventListener("site:loading-complete",function(){if(!n){if(n=!0,!e.paused)return u(),void a();r(!0)}},{once:!0}),document.addEventListener("pointerdown",s,!0),document.addEventListener("touchstart",s,!0),document.addEventListener("keydown",s,!0),e.addEventListener("play",d),e.addEventListener("pause",d),t&&(t.setAttribute("role","button"),t.setAttribute("tabindex","0"),t.addEventListener("click",c,!0),t.addEventListener("keydown",function(e){"Enter"!==e.key&&" "!==e.key||c(e)},!0)),d(),n&&r(!0))}();
!function(){"use strict";var t=window.HTMLMediaElement&&window.HTMLMediaElement.prototype;if(t&&!t.__productPreviewAutoplayInstalled){var i=t.play,e=null;window.__stopProductPreview=function(){e&&(e.pause(),e.currentTime=0,e=null)},t.__productPreviewAutoplayInstalled=!0,t.play=function(){var t=this.currentSrc||this.src||"",s=/\/assets\/movie\/(?:t1|s1)\.mp4(?:[?#]|$)/.test(t),l=this.classList.contains("l-localProductVideo");if(!s||l)return i.apply(this,arguments);e=this,this.muted=!0,this.defaultMuted=!0,this.autoplay=!0,this.loop=!0,this.playsInline=!0,this.setAttribute("muted",""),this.setAttribute("autoplay",""),this.setAttribute("loop",""),this.setAttribute("playsinline","");var n=i.apply(this,arguments);return n&&"function"==typeof n.catch?n.catch(function(){}):n}}}();
!function(){"use strict";var t=document.querySelector(".l-productMovieDetail"),e=t&&t.querySelector(".l-productMovieModal"),i=e&&e.querySelector(".l-localProductVideo"),o="";function r(){i.pause(),i.removeAttribute("src"),i.load(),e.classList.remove("is-local-active"),e.setAttribute("aria-hidden","true")}function n(t){return window.__siteAssetUrl?window.__siteAssetUrl(t):t}t&&e&&i&&(document.addEventListener("click",function(a){var c=a.target.closest(".js-pdetailMovieBtn");if(c)return o=n(c.getAttribute("data-mov")||""),t.classList.remove("is-preview-hidden"),void t.setAttribute("data-current-product-movie",o);var s=a.target.closest(".js-movie-play-btn");if(s&&t.contains(s))return a.preventDefault(),a.stopImmediatePropagation(),void function(t){if(t){i.src=n(t),i.currentTime=0,i.muted=!0,i.defaultMuted=!0,i.loop=!0,i.playsInline=!0,i.setAttribute("muted",""),i.setAttribute("autoplay",""),i.setAttribute("loop",""),i.setAttribute("playsinline",""),e.classList.add("is-local-active"),e.setAttribute("aria-hidden","false");var o=i.play();o&&"function"==typeof o.catch&&o.catch(function(){})}}(o||t.getAttribute("data-current-product-movie")||"");if(a.target.closest(".l-productMovieModal.is-local-active .l-closeBtn-bold"))return a.preventDefault(),a.stopImmediatePropagation(),void r();var l=a.target.closest(".l-closeBtn");l&&l.parentElement===t&&(t.classList.add("is-preview-hidden"),t.removeAttribute("data-current-product-movie"),o="","function"==typeof window.__stopProductPreview&&window.__stopProductPreview())},!0),document.addEventListener("keydown",function(t){"Escape"===t.key&&e.classList.contains("is-local-active")&&r()}))}();
!function(){"use strict";var t=document.querySelector(".p-about--inline"),e=["js-block","js-fix","js-firstview","js-item","js-attention","js-caption","js-bg","js-text","js-selectText","js-about-bgImage","js-mainTtl","js-txtMainMot","js-txtMot"];if(t){t.querySelectorAll("*").forEach(function(t){e.forEach(function(e){t.classList.remove(e)})});var n=t.querySelector(".p-about-scrollAttention"),i=t.querySelector("#about-card"),o=0,r=window.matchMedia("(prefers-reduced-motion: reduce)").matches,a=t.querySelector("#about-title");!function(){if(a){for(var t=a.textContent.trim(),e=t.split("").map(function(t,e){return e}),n=e.length-1;n>0;n-=1){var i=Math.floor(Math.random()*(n+1)),o=e[n];e[n]=e[i],e[i]=o}a.textContent="",a.setAttribute("aria-label",t),t.split("").forEach(function(t,n){var i=document.createElement("span"),o=e.indexOf(n);i.className="about-title-char",i.setAttribute("aria-hidden","true"),i.style.setProperty("--about-char-delay",.1+.25*o+"s"),i.textContent=t,a.appendChild(i)})}}(),t.classList.add("is-about-motion-ready"),r||!("IntersectionObserver"in window)?(s("is-about-intro-visible"),s("is-about-card-visible")):(c(a,"is-about-intro-visible",.2),c(i,"is-about-card-visible",.16)),n&&i&&n.addEventListener("click",function(t){if(t.preventDefault(),i){window.cancelAnimationFrame(o);var e=window.scrollY,n=i.getBoundingClientRect(),a=(window.innerHeight-n.height)/2,s=Math.max(0,n.top+e-a),c=s-e;if(r||Math.abs(c)<2)return window.scrollTo(0,s),void l();var u=performance.now();o=window.requestAnimationFrame(function t(n){var i=Math.min((n-u)/2e3,1),r=function(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}(i);window.scrollTo(0,e+c*r),i<1?o=window.requestAnimationFrame(t):l()})}})}function s(e){t.classList.add(e)}function c(e,n,i){e&&new IntersectionObserver(function(e){e.forEach(function(e){t.classList.toggle(n,e.isIntersecting)})},{threshold:i,rootMargin:"0px 0px -10% 0px"}).observe(e)}function l(){i.focus({preventScroll:!0})}}();
!function () {
  "use strict";

  var desktop = window.matchMedia("(min-width: 769px)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var frame = 0;
  var locked = false;
  var accumulatedDelta = 0;
  var resetTimer = 0;

  function isOverlayOpen() {
    return Boolean(document.querySelector(
      ".l-productMovieDetail.is-show, " +
      ".l-productMovieDetail.is-active, " +
      ".l-productMovieModal.is-local-active, " +
      "body.is-openMenu"
    ));
  }

  function targets() {
    return Array.prototype.slice.call(document.querySelectorAll(
      "#products-section > .l-main_ttl, " +
      "#products-section > .p-products_content-movie, " +
      ".p-about--inline > .l-main_ttl, " +
      ".p-about--inline > #about-card, " +
      ".p-products > .l-contact:not(.is-tmp)"
    )).filter(function (element) {
      var style = window.getComputedStyle(element);
      return style.display !== "none" && element.getBoundingClientRect().height > 0;
    }).map(function (element) {
      return Math.round(element.getBoundingClientRect().top + window.scrollY);
    }).filter(function (value, index, values) {
      return index === 0 || Math.abs(value - values[index - 1]) > 2;
    });
  }

  function easeInOut(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function animateTo(target) {
    window.cancelAnimationFrame(frame);
    var start = window.scrollY;
    var distance = target - start;

    if (reduceMotion.matches || Math.abs(distance) < 2) {
      window.scrollTo(0, target);
      locked = false;
      return;
    }

    var started = performance.now();
    frame = window.requestAnimationFrame(function update(time) {
      var progress = Math.min((time - started) / 900, 1);
      window.scrollTo(0, start + distance * easeInOut(progress));
      if (progress < 1) {
        frame = window.requestAnimationFrame(update);
      } else {
        window.scrollTo(0, target);
        window.setTimeout(function () {
          locked = false;
        }, 180);
      }
    });
  }

  function adjacentTarget(direction) {
    var positions = targets();
    var current = window.scrollY;
    var tolerance = Math.max(8, window.innerHeight * 0.02);
    var index;

    if (direction > 0) {
      for (index = 0; index < positions.length; index += 1) {
        if (positions[index] > current + tolerance) return positions[index];
      }
      return positions[positions.length - 1];
    }

    for (index = positions.length - 1; index >= 0; index -= 1) {
      if (positions[index] < current - tolerance) return positions[index];
    }
    return positions[0];
  }

  function step(direction) {
    if (locked) return false;
    locked = true;
    animateTo(adjacentTarget(direction));
    return true;
  }

  function onWheel(event) {
    if (!desktop.matches || event.ctrlKey || isOverlayOpen()) return;
    if (!document.querySelector("#products-section")) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    if (locked) return;

    accumulatedDelta += event.deltaY;
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(function () {
      accumulatedDelta = 0;
    }, 140);

    if (Math.abs(accumulatedDelta) < 18) return;
    var direction = accumulatedDelta > 0 ? 1 : -1;
    accumulatedDelta = 0;
    step(direction);
  }

  window.__sectionWheelSnapStep = step;
  window.addEventListener("wheel", onWheel, { passive: false, capture: true });
}();
