(function configureRenderingBudget() {
  "use strict";

  var nativePixelRatio = window.devicePixelRatio || 1;
  if (nativePixelRatio <= 1) {
    return;
  }

  try {
    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      get: function getOptimizedPixelRatio() {
        return 1;
      }
    });
  } catch (error) {
  }
})();
