(function installLoadingVideo() {
  "use strict";

  var loading = document.querySelector(".l-loading");
  var video = document.querySelector(".js-loadingVideo");
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!loading || !video || reduceMotion) {
    return;
  }

  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("loop", "");
  video.setAttribute("playsinline", "");

  function showVideo() {
    loading.classList.add("is-loading-video-ready");
  }

  function keepFallback() {
    loading.classList.remove("is-loading-video-ready");
    video.hidden = true;
  }

  video.addEventListener("playing", showVideo, { once: true });
  video.addEventListener("error", keepFallback, { once: true });

  var playResult = video.play();
  if (playResult && typeof playResult.catch === "function") {
    playResult.catch(keepFallback);
  }
})();
