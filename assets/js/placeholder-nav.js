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
