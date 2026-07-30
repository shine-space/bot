/**
 * Keep the two retired pager entries as visual "#" links.
 *
 * The original pager binds every `.item` to its three-page transition logic.
 * Register before the bundle and stop only placeholder clicks from reaching
 * that handler. The anchor's default `href="#"` action remains intact.
 */
(function keepRetiredPagerEntriesAsEmptyLinks() {
  "use strict";

  window.addEventListener(
    "click",
    function stopRetiredPageTransition(event) {
      var target = event.target;
      var placeholder =
        target && target.closest
          ? target.closest(".l-pager .is-placeholder")
          : null;

      if (placeholder) {
        event.stopImmediatePropagation();
      }
    },
    true
  );
})();
