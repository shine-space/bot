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
