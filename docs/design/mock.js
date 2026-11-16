// Script for the mockups. Add ?theme=home, ?theme=away, or ?theme=third to a page address to set the Theme.
(function () {
  var root = document.documentElement;
  var fromAddress = new URLSearchParams(location.search).get("theme");
  var stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch (error) {}
  var choice = fromAddress || stored;
  if (choice) root.dataset.theme = choice;

  // With no choice, the device setting selects Home or Away. The switch shows that Theme as pressed.
  function current() {
    if (root.dataset.theme) return root.dataset.theme;
    return matchMedia("(prefers-color-scheme: light)").matches ? "away" : "home";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll("[data-theme-choice]");
    function show() {
      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.themeChoice === current()));
      });
    }
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        root.dataset.theme = button.dataset.themeChoice;
        try {
          localStorage.setItem("theme", button.dataset.themeChoice);
        } catch (error) {}
        show();
      });
    });
    show();

    // Stats page: one panel for each view.
    var views = document.querySelectorAll("[data-view]");
    var panels = document.querySelectorAll("[data-panel]");
    views.forEach(function (view) {
      view.addEventListener("click", function () {
        views.forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === view));
        });
        panels.forEach(function (panel) {
          panel.hidden = panel.dataset.panel !== view.dataset.view;
        });
      });
    });
  });
})();
