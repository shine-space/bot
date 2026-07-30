/*
 * Skip the original loading sound choice.
 *
 * The mirrored bundle pauses at 100% and calls loading.showSound(); its
 * completion callback normally runs only after the visitor chooses ON or OFF.
 * Keep the vendor bundle intact, replace that one pause point, and then use the
 * site's existing sound button handler to select the ON state.
 */
(function installLoadingAutoplay() {
  "use strict";

  var app = window.main;
  var loading = app && app.loading;

  if (!loading) {
    window.requestAnimationFrame(installLoadingAutoplay);
    return;
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

    window.setTimeout(function enableDefaultSound() {
      var soundButton = document.querySelector(".l-fixui_sound");
      if (soundButton) {
        soundButton.click();
      }
    }, 0);
  };
})();
