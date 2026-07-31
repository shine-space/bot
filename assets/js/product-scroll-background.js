(function installProductScrollBackgrounds() {
  "use strict";

  var blocks = Array.prototype.slice.call(
    document.querySelectorAll(".p-products_content-movie")
  );
  var detail = document.querySelector(".l-productMovieDetail");
  var background = document.querySelector(".l-productScrollBg");
  var frameRequested = false;
  var trackUntil = 0;
  var activeId = -2;
  var layerAnimations = [];
  var layers = background
    ? Array.prototype.slice.call(background.querySelectorAll(":scope > .inner"))
    : [];

  if (!blocks.length || !detail || layers.length < blocks.length) {
    return;
  }

  function disableLegacyHover() {
    if (!window.jQuery) {
      return;
    }

    window.jQuery(".js-pdetailMovieBtn").off("mouseenter mouseleave");
  }

  function transitionToBackground(nextActiveId) {
    if (nextActiveId === activeId) {
      return;
    }

    activeId = nextActiveId;

    layers.forEach(function animateLayer(layer, id) {
      var currentOpacity = Number(window.getComputedStyle(layer).opacity);
      var targetOpacity = id === activeId ? 1 : 0;

      if (layerAnimations[id]) {
        layerAnimations[id].cancel();
      }

      layerAnimations[id] = layer.animate(
        [
          { opacity: currentOpacity },
          { opacity: targetOpacity }
        ],
        {
          duration: 1500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards"
        }
      );

      layerAnimations[id].onfinish = function finishLayerTransition() {
        layer.style.opacity = String(targetOpacity);
        layerAnimations[id].cancel();
        layerAnimations[id] = null;
      };
    });
  }

  function updateActiveBackground() {
    frameRequested = false;

    var viewportHeight = window.innerHeight;
    var activationTop = viewportHeight * 0.15;
    var activationBottom = viewportHeight * 0.85;
    var activeId = -1;
    var largestOverlap = 0;

    blocks.forEach(function findMostVisibleProduct(block) {
      var rect = block.getBoundingClientRect();
      var overlap = Math.max(
        0,
        Math.min(rect.bottom, activationBottom) -
          Math.max(rect.top, activationTop)
      );

      if (overlap > largestOverlap) {
        var trigger = block.querySelector(".js-pdetailMovieBtn");
        largestOverlap = overlap;
        activeId = trigger ? Number(trigger.getAttribute("data-id")) : -1;
      }
    });

    transitionToBackground(activeId);

    if (Date.now() < trackUntil) {
      frameRequested = true;
      window.requestAnimationFrame(updateActiveBackground);
    }
  }

  function queueBackgroundUpdate() {
    if (frameRequested) {
      return;
    }

    frameRequested = true;
    window.requestAnimationFrame(updateActiveBackground);
  }

  function trackSmoothScroll() {
    trackUntil = Date.now() + 1500;
    queueBackgroundUpdate();
  }

  function initializeWhenLayersExist() {
    var legacyLayers = Array.prototype.slice.call(
      detail.querySelectorAll(":scope > .bg > .inner")
    );

    if (legacyLayers.length < blocks.length) {
      window.requestAnimationFrame(initializeWhenLayersExist);
      return;
    }

    document.documentElement.classList.add("product-scroll-bg-enabled");
    disableLegacyHover();
    window.addEventListener("scroll", trackSmoothScroll, {
      passive: true
    });
    window.addEventListener("resize", trackSmoothScroll);
    updateActiveBackground();
  }

  initializeWhenLayersExist();
})();
