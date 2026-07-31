(function installLoadingAutoplay() {
  "use strict";

  var app = window.main;
  var loading = app && app.loading;

  if (!loading) {
    window.requestAnimationFrame(installLoadingAutoplay);
    return;
  }

  var soundAnimator = loading.bg;

  if (window.TweenMax && soundAnimator && soundAnimator._soundLine) {
    window.TweenMax.killTweensOf(soundAnimator._soundLine);

    if (typeof soundAnimator._soundLine.get === "function") {
      window.TweenMax.killTweensOf(soundAnimator._soundLine.get(0));
    }
  }

  if (soundAnimator) {
    soundAnimator._setLineAnm = function disabledSoundLineAnimation() {};
  }

  loading.showSound = function skipSoundChoice() {
    if (this.__autoContinueStarted) {
      return;
    }

    this.__autoContinueStarted = true;

    this.setActive(false);
    this.el().addClass("none");

    var complete = this.onComplete;
    if (typeof complete === "function") {
      complete();
    }

    if (
      soundAnimator &&
      !soundAnimator._soundLine &&
      window.jQuery
    ) {
      soundAnimator._soundLine = window.jQuery();
    }

    window.setTimeout(function enableDefaultSound() {
      var soundButton = document.querySelector(".l-fixui_sound");
      if (soundButton) {
        soundButton.click();
      }
    }, 0);
  };
})();
