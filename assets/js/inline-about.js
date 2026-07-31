(function prepareInlineAbout() {
  "use strict";

  var about = document.querySelector(".p-about--inline");
  var retiredMotionClasses = [
    "js-block",
    "js-fix",
    "js-firstview",
    "js-item",
    "js-attention",
    "js-caption",
    "js-bg",
    "js-text",
    "js-selectText",
    "js-about-bgImage",
    "js-mainTtl",
    "js-txtMainMot",
    "js-txtMot",
  ];

  if (!about) {
    return;
  }

  about.querySelectorAll("*").forEach(function isolateAboutElement(element) {
    retiredMotionClasses.forEach(function removeRetiredMotionClass(className) {
      element.classList.remove(className);
    });
  });

  var scrollAttention = about.querySelector(".p-about-scrollAttention");
  var card = about.querySelector("#about-card");
  var scrollFrame = 0;
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var aboutTitle = about.querySelector("#about-title");

  function prepareTitleFlip() {
    if (!aboutTitle) {
      return;
    }

    var titleText = aboutTitle.textContent.trim();
    var characterOrder = titleText.split("").map(function makeIndex(_, index) {
      return index;
    });

    for (var index = characterOrder.length - 1; index > 0; index -= 1) {
      var randomIndex = Math.floor(Math.random() * (index + 1));
      var currentIndex = characterOrder[index];

      characterOrder[index] = characterOrder[randomIndex];
      characterOrder[randomIndex] = currentIndex;
    }

    aboutTitle.textContent = "";
    aboutTitle.setAttribute("aria-label", titleText);

    titleText.split("").forEach(function appendCharacter(character, index) {
      var characterElement = document.createElement("span");
      var revealOrder = characterOrder.indexOf(index);

      characterElement.className = "about-title-char";
      characterElement.setAttribute("aria-hidden", "true");
      characterElement.style.setProperty(
        "--about-char-delay",
        0.1 + revealOrder * 0.25 + "s"
      );
      characterElement.textContent = character;
      aboutTitle.appendChild(characterElement);
    });
  }

  prepareTitleFlip();
  about.classList.add("is-about-motion-ready");

  function revealSection(sectionClass) {
    about.classList.add(sectionClass);
  }

  function observeToggleSection(element, sectionClass, threshold) {
    if (!element) {
      return;
    }

    var observer = new IntersectionObserver(
      function toggleWhenVisible(entries) {
        entries.forEach(function toggleEntry(entry) {
          about.classList.toggle(sectionClass, entry.isIntersecting);
        });
      },
      {
        threshold: threshold,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(element);
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealSection("is-about-intro-visible");
    revealSection("is-about-card-visible");
  } else {
    observeToggleSection(aboutTitle, "is-about-intro-visible", 0.2);
    observeToggleSection(card, "is-about-card-visible", 0.16);
  }

  function easePower2InOut(progress) {
    return progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  }

  function focusCard() {
    card.focus({ preventScroll: true });
  }

  function scrollToCard(event) {
    event.preventDefault();

    if (!card) {
      return;
    }

    window.cancelAnimationFrame(scrollFrame);

    var start = window.scrollY;
    var cardRect = card.getBoundingClientRect();
    var centeredOffset = (window.innerHeight - cardRect.height) / 2;
    var end = Math.max(0, cardRect.top + start - centeredOffset);
    var distance = end - start;

    if (reduceMotion || Math.abs(distance) < 2) {
      window.scrollTo(0, end);
      focusCard();
      return;
    }

    var duration = 2000;
    var startedAt = performance.now();

    function updateScroll(now) {
      var progress = Math.min((now - startedAt) / duration, 1);
      var easedProgress = easePower2InOut(progress);

      window.scrollTo(0, start + distance * easedProgress);

      if (progress < 1) {
        scrollFrame = window.requestAnimationFrame(updateScroll);
        return;
      }

      focusCard();
    }

    scrollFrame = window.requestAnimationFrame(updateScroll);
  }

  if (scrollAttention && card) {
    scrollAttention.addEventListener("click", scrollToCard);
  }
})();
