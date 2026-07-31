(function enableProductPreviewAutoplay() {
  "use strict";

  var mediaPrototype = window.HTMLMediaElement &&
    window.HTMLMediaElement.prototype;

  if (!mediaPrototype || mediaPrototype.__productPreviewAutoplayInstalled) {
    return;
  }

  var nativePlay = mediaPrototype.play;
  var activePreview = null;

  window.__stopProductPreview = function stopProductPreview() {
    if (activePreview) {
      activePreview.pause();
      activePreview.currentTime = 0;
      activePreview = null;
    }
  };
  mediaPrototype.__productPreviewAutoplayInstalled = true;

  mediaPrototype.play = function playWithProductPreviewPolicy() {
    var source = this.currentSrc || this.src || "";
    var isProductPreview =
      /\/assets\/movie\/(?:t1|s1)\.mp4(?:[?#]|$)/.test(source);
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

    var result = nativePlay.apply(this, arguments);
    if (result && typeof result.catch === "function") {
      return result.catch(function ignorePreviewAutoplayRejection() {
      });
    }

    return result;
  };
})();
