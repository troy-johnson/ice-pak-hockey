// Script for the mockups. Add ?theme=home, ?theme=away, or ?theme=third to a page address to set the Theme.
(function () {
  var root = document.documentElement;
  var themes = ["home", "away", "third"];
  var fromAddress = new URLSearchParams(location.search).get("theme");
  var stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch (error) {}
  var choice = themes.indexOf(fromAddress) >= 0 ? fromAddress : themes.indexOf(stored) >= 0 ? stored : null;
  // With no choice, the device setting selects Home or Away.
  root.dataset.theme = choice || (matchMedia("(prefers-color-scheme: light)").matches ? "away" : "home");

  document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll("[data-theme-choice]");
    function show() {
      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.themeChoice === root.dataset.theme));
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

    // Views: one panel for each button. Add ?view=<name> to the address to open that view.
    var views = document.querySelectorAll("[data-view]");
    var panels = document.querySelectorAll("[data-panel]");
    var wanted = new URLSearchParams(location.search).get("view");
    views.forEach(function (view) {
      view.addEventListener("click", function () {
        views.forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === view));
        });
        panels.forEach(function (panel) {
          panel.hidden = panel.dataset.panel !== view.dataset.view;
        });
      });
      if (view.dataset.view === wanted) view.click();
    });

    // Stats: the season list opens the season panel.
    var pick = document.querySelector("[data-view-select]");
    if (pick) {
      var all = document.querySelector("[data-view='all']");
      pick.addEventListener("change", function () {
        all.setAttribute("aria-pressed", "false");
        pick.classList.add("on");
        panels.forEach(function (panel) {
          panel.hidden = panel.dataset.panel !== "ls";
        });
      });
      all.addEventListener("click", function () {
        pick.classList.remove("on");
        pick.selectedIndex = 0;
      });
      if (wanted === "ls") {
        pick.selectedIndex = 1;
        pick.dispatchEvent(new Event("change"));
      }
    }

    // Video: a Recap or a Short plays in the page. The visitor stays on the site.
    document.querySelectorAll("[data-yt]").forEach(function (frame) {
      frame.addEventListener("click", function () {
        if (frame.classList.contains("playing")) return;
        frame.classList.add("playing");
        // The artifact viewer does not allow an embedded player, so it shows a mockup player.
        var local = location.protocol === "file:" || location.hostname === "localhost";
        if (local) {
          var player = document.createElement("iframe");
          player.src = "https://www.youtube-nocookie.com/embed/" + frame.dataset.yt + "?autoplay=1&rel=0";
          player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
          player.title = "Video player";
          frame.appendChild(player);
        } else {
          var bar = document.createElement("span");
          bar.className = "fake-player";
          bar.innerHTML = "<span>❚❚</span><i></i><span>0:12 / 1:04</span>";
          frame.appendChild(bar);
        }
      });
    });

    // Schedule calendar: one panel for each month.
    var months = Array.prototype.slice.call(document.querySelectorAll("[data-month]"));
    var prev = document.querySelector("[data-step='-1']");
    var next = document.querySelector("[data-step='1']");
    function month(index) {
      months.forEach(function (panel, i) {
        panel.hidden = i !== index;
      });
      prev.disabled = index === 0;
      next.disabled = index === months.length - 1;
      prev.dataset.at = next.dataset.at = index;
      document.querySelector("[data-month-name]").textContent = months[index].dataset.name;
    }
    if (months.length) {
      [prev, next].forEach(function (button) {
        button.addEventListener("click", function () {
          month(Number(button.dataset.at) + Number(button.dataset.step));
        });
      });
      var start = months.findIndex(function (panel) {
        return panel.dataset.month === (new URLSearchParams(location.search).get("month") || "current");
      });
      month(start < 0 ? months.length - 1 : start);
    }
  });
})();
