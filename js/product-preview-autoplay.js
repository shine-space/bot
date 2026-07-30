/*
 * Allow the WebGL product preview video to autoplay.
 *
 * The vendor player creates a detached <video> for THREE.VideoTexture and calls
 * play() after loadeddata. Browsers reject that asynchronous play request when
 * the media is not muted, so scope a muted/inline/looping policy to local
 * product preview MP4 files only.
 */
(function enableProductPreviewAutoplay() {
  "use strict";

  var mediaPrototype = window.HTMLMediaElement &&
    window.HTMLMediaElement.prototype;

  if (!mediaPrototype || mediaPrototype.__productPreviewAutoplayInstalled) {
    return;
  }

  var nativePlay = mediaPrototype.play;
  var activePreview = null;
  var state = {
    attempts: 0,
    playing: false,
    error: ""
  };

  function report(status, error) {
    document.documentElement.setAttribute(
      "data-product-preview-autoplay",
      status
    );
    document.documentElement.setAttribute(
      "data-product-preview-attempts",
      String(state.attempts)
    );

    if (error) {
      document.documentElement.setAttribute(
        "data-product-preview-error",
        error
      );
    } else {
      document.documentElement.removeAttribute("data-product-preview-error");
    }
  }

  window.__productPreviewAutoplay = state;
  window.__stopProductPreview = function stopProductPreview() {
    if (activePreview) {
      activePreview.pause();
      activePreview.removeAttribute("src");
      activePreview.load();
      activePreview = null;
    }

    state.playing = false;
    report("stopped", "");
  };
  mediaPrototype.__productPreviewAutoplayInstalled = true;

  mediaPrototype.play = function playWithProductPreviewPolicy() {
    var source = this.currentSrc || this.src || "";
    var isProductPreview = source.indexOf("/assets/movie/products/") !== -1;
    var isLocalModal = this.classList.contains("l-localProductVideo");

    if (!isProductPreview || isLocalModal) {
      return nativePlay.apply(this, arguments);
    }

    activePreview = this;
    this.muted = true;
    this.defaultMuted = true;
    this.autoplay = true;
    this.loop = true;
    this.playsInline = true;
    this.setAttribute("muted", "");
    this.setAttribute("autoplay", "");
    this.setAttribute("loop", "");
    this.setAttribute("playsinline", "");

    state.attempts += 1;
    report("attempting", "");

    var result = nativePlay.apply(this, arguments);
    if (result && typeof result.then === "function") {
      return result.then(function onPreviewPlaying() {
        state.playing = true;
        state.error = "";
        report("playing", "");
      }).catch(function onPreviewBlocked(error) {
        state.playing = false;
        state.error = error && error.message ? error.message : String(error);
        report("blocked", state.error);
      });
    }

    state.playing = !this.paused;
    report(state.playing ? "playing" : "paused", "");
    return result;
  };
})();
