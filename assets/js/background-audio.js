(function installBackgroundAudio() {
  "use strict";

  var audio = document.querySelector(".js-backgroundAudio");
  var loadingComplete = !document.querySelector(".l-loading");
  var targetVolume = 0.075;
  var fadeFrame = 0;

  if (!audio) {
    return;
  }

  audio.loop = true;
  audio.preload = "auto";
  audio.volume = targetVolume;

  function removeUnlockListeners() {
    document.removeEventListener("pointerdown", unlockAudio, true);
    document.removeEventListener("touchstart", unlockAudio, true);
    document.removeEventListener("keydown", unlockAudio, true);
  }

  function fadeIn() {
    var startedAt = Date.now();
    var duration = 900;

    window.cancelAnimationFrame(fadeFrame);
    audio.volume = 0;

    function updateVolume() {
      var progress = Math.min(1, (Date.now() - startedAt) / duration);
      audio.volume = targetVolume * progress;

      if (progress < 1) {
        fadeFrame = window.requestAnimationFrame(updateVolume);
      }
    }

    updateVolume();
  }

  function playAudio(useFade) {
    audio.muted = false;

    var playResult = audio.play();
    if (!playResult || typeof playResult.then !== "function") {
      if (useFade) {
        fadeIn();
      }
      removeUnlockListeners();
      return;
    }

    playResult.then(function onAudioStarted() {
      if (useFade) {
        fadeIn();
      } else {
        audio.volume = targetVolume;
      }
      removeUnlockListeners();
    }).catch(function waitForUserGesture() {});
  }

  function unlockAudio() {
    if (loadingComplete) {
      playAudio(true);
      return;
    }

    audio.volume = 0;
    var playResult = audio.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(function keepUnlockListeners() {});
    }
  }

  function onLoadingComplete() {
    if (loadingComplete) {
      return;
    }

    loadingComplete = true;

    if (!audio.paused) {
      fadeIn();
      removeUnlockListeners();
      return;
    }

    playAudio(true);
  }

  document.addEventListener("site:loading-complete", onLoadingComplete, {
    once: true
  });
  document.addEventListener("pointerdown", unlockAudio, true);
  document.addEventListener("touchstart", unlockAudio, true);
  document.addEventListener("keydown", unlockAudio, true);

  if (loadingComplete) {
    playAudio(true);
  }
})();
