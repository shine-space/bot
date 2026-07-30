/**
 * Local performance policy.
 *
 * The original animation bundle renders every WebGL scene at up to 2× the CSS
 * pixel density. On a high-DPI display that quadruples the number of pixels for
 * each of the many canvas layers, including scenes that are currently hidden.
 *
 * Keep this policy separate from the mirrored vendor bundle so the optimization
 * is easy to audit, tune, or remove without editing minified third-party code.
 */
(function configureRenderingBudget() {
  "use strict";

  var nativePixelRatio = window.devicePixelRatio || 1;
  var maximumPixelRatio = 1;
  var effectivePixelRatio = Math.min(nativePixelRatio, maximumPixelRatio);

  window.CLONE_PERFORMANCE = Object.freeze({
    nativePixelRatio: nativePixelRatio,
    maximumPixelRatio: maximumPixelRatio,
    effectivePixelRatio: effectivePixelRatio
  });

  if (nativePixelRatio <= maximumPixelRatio) {
    return;
  }

  try {
    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      get: function getOptimizedPixelRatio() {
        return effectivePixelRatio;
      }
    });
  } catch (error) {
    // Older browsers may expose a non-configurable property. In that case the
    // original renderer remains functional and simply keeps its native ratio.
  }
})();
