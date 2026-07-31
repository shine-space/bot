(function installLocalPagerLinks() {
  "use strict";

  var scrollFrame = 0;
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var productsPageId = 0;

  function easePower2InOut(progress) {
    return progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  }

  function scrollToPosition(end) {
    window.cancelAnimationFrame(scrollFrame);

    var start = window.scrollY;
    var distance = end - start;

    if (reduceMotion || Math.abs(distance) < 2) {
      window.scrollTo(0, end);
      return;
    }

    var duration = 850;
    var startedAt = performance.now();

    function updateScroll(now) {
      var progress = Math.min((now - startedAt) / duration, 1);

      window.scrollTo(
        0,
        start + distance * easePower2InOut(progress)
      );

      if (progress < 1) {
        scrollFrame = window.requestAnimationFrame(updateScroll);
      }
    }

    scrollFrame = window.requestAnimationFrame(updateScroll);
  }

  function scrollToSection(sectionSelector) {
    var section = document.querySelector(sectionSelector);

    if (!section) {
      return;
    }

    scrollToPosition(section.getBoundingClientRect().top + window.scrollY);
  }

  function scrollToFirstProduct() {
    var heightGuide = document.querySelector(".js-height");
    var maximumScroll = heightGuide
      ? Math.max(0, heightGuide.offsetTop - window.innerHeight)
      : document.documentElement.scrollHeight - window.innerHeight;
    var extraOffset = Math.min(100, window.innerHeight * 0.12);
    var target = Math.min(
      maximumScroll,
      window.innerHeight + extraOffset
    );

    scrollToPosition(target);
  }

  function isProductsPageReady() {
    var products = document.querySelector("#products-section");
    var heightGuide = document.querySelector(".js-height");

    return Boolean(
      products &&
      heightGuide &&
      window.getComputedStyle(products).display !== "none" &&
      window.getComputedStyle(heightGuide).display !== "none" &&
      products.offsetHeight > 0
    );
  }

  function waitForProductsPage(onReady) {
    var attempts = 0;

    function checkProductsPage() {
      attempts += 1;

      if (isProductsPageReady()) {
        onReady();
        return;
      }

      if (attempts < 600) {
        window.requestAnimationFrame(checkProductsPage);
      }
    }

    window.requestAnimationFrame(checkProductsPage);
  }

  function openProductsInPlace(onReady) {
    if (isProductsPageReady()) {
      onReady();
      return;
    }

    var app = window.main;

    if (app && typeof app._eClickPager === "function") {
      app._eClickPager(productsPageId);
      waitForProductsPage(onReady);
      return;
    }

    var attempts = 0;

    function waitForController() {
      attempts += 1;

      if (window.main && typeof window.main._eClickPager === "function") {
        window.main._eClickPager(productsPageId);
        waitForProductsPage(onReady);
        return;
      }

      if (attempts < 180) {
        window.requestAnimationFrame(waitForController);
      }
    }

    window.requestAnimationFrame(waitForController);
  }

  window.addEventListener(
    "click",
    function stopRetiredPageTransition(event) {
      var target = event.target;
      var aboutLink =
        target && target.closest
          ? target.closest(".l-pager .js-about-nav")
          : null;
      var productsLink =
        target && target.closest
          ? target.closest(".l-pager .js-products-nav")
          : null;
      var placeholder =
        target && target.closest
          ? target.closest(".l-pager .is-placeholder")
          : null;
      var consultLink =
        target && target.closest
          ? target.closest(".js-t1-consult")
          : null;
      var productLeadLink =
        target && target.closest
          ? target.closest(
              "#products-section > .l-main_ttl .l-scrollAttention"
            )
          : null;

      if (productLeadLink) {
        event.preventDefault();
        event.stopImmediatePropagation();
        scrollToFirstProduct();
        return;
      }

      if (consultLink) {
        event.preventDefault();
        event.stopImmediatePropagation();

        var contact = document.querySelector(
          ".p-products .l-contact:not(.is-tmp)"
        );

        if (contact) {
          scrollToSection(".p-products .l-contact:not(.is-tmp)");
        }

        return;
      }

      if (aboutLink) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openProductsInPlace(function locateAboutSection() {
          scrollToSection(".p-about--inline");
        });
        return;
      }

      if (productsLink) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openProductsInPlace(function locateProductsSection() {
          scrollToSection("#products-section");
        });
        return;
      }

      if (placeholder) {
        event.stopImmediatePropagation();
      }
    },
    true
  );
})();
