(function installLocalProductPlayer() {
  "use strict";

  var detail = document.querySelector(".l-productMovieDetail");
  var modal = detail && detail.querySelector(".l-productMovieModal");
  var video = modal && modal.querySelector(".l-localProductVideo");
  var currentSource = "";

  if (!detail || !modal || !video) {
    return;
  }

  function closePlayer() {
    video.pause();
    video.removeAttribute("src");
    video.load();
    modal.classList.remove("is-local-active");
    modal.setAttribute("aria-hidden", "true");
  }

  function openPlayer(source) {
    if (!source) {
      return;
    }

    video.src = source;
    video.currentTime = 0;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");
    modal.classList.add("is-local-active");
    modal.setAttribute("aria-hidden", "false");

    var playResult = video.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(function ignoreAutoplayRejection() {
      });
    }
  }

  document.addEventListener("click", function handleProductPlayer(event) {
    var productTrigger = event.target.closest(".js-pdetailMovieBtn");
    if (productTrigger) {
      currentSource = productTrigger.getAttribute("data-mov") || "";
      detail.classList.remove("is-preview-hidden");
      detail.setAttribute("data-current-product-movie", currentSource);
      return;
    }

    var playButton = event.target.closest(".js-movie-play-btn");
    if (playButton && detail.contains(playButton)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openPlayer(
        currentSource ||
        detail.getAttribute("data-current-product-movie") ||
        ""
      );
      return;
    }

    var localClose = event.target.closest(
      ".l-productMovieModal.is-local-active .l-closeBtn-bold"
    );
    if (localClose) {
      event.preventDefault();
      event.stopImmediatePropagation();
      closePlayer();
      return;
    }

    var detailClose = event.target.closest(".l-closeBtn");
    if (detailClose && detailClose.parentElement === detail) {
      detail.classList.add("is-preview-hidden");
      detail.removeAttribute("data-current-product-movie");
      currentSource = "";

      if (typeof window.__stopProductPreview === "function") {
        window.__stopProductPreview();
      }
    }
  }, true);

  document.addEventListener("keydown", function closeLocalPlayerWithEscape(event) {
    if (event.key === "Escape" && modal.classList.contains("is-local-active")) {
      closePlayer();
    }
  });
})();
