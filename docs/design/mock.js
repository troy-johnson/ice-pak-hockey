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

  // Variants for the dev panel: the game bar, and the Manager sign-in. The address wins, then the browser keeps the choice.
  function read(key, fallback) {
    var fromUrl = new URLSearchParams(location.search).get(key);
    if (fromUrl !== null) return fromUrl;
    try {
      var v = localStorage.getItem("mock-" + key);
      if (v !== null) return v;
    } catch (error) {}
    return fallback;
  }
  function save(key, value) {
    try {
      localStorage.setItem("mock-" + key, value);
    } catch (error) {}
  }
  // Recent games: the game bar, cards, a list, or a scoreboard. Only "bar" shows the game bar.
  var legacy = read("bar", null);
  root.dataset.recent = read("recent", legacy === "off" ? "cards" : "bar");
  root.dataset.bar = root.dataset.recent === "bar" ? "on" : "off";
  root.dataset.notice = read("notice", "none");
  root.dataset.auth = read("auth", "out");
  root.dataset.panel = read("panel", "open");

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

    // Video: a click opens a pop-out player over the page. The visitor stays on the site.
    function closePop() {
      var pop = document.querySelector(".player-pop");
      if (pop) pop.remove();
    }
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closePop();
    });
    document.querySelectorAll("[data-yt]").forEach(function (frame) {
      frame.addEventListener("click", function () {
        var pop = document.createElement("div");
        pop.className = "player-pop" + (frame.classList.contains("frame") ? " vertical" : "");
        pop.setAttribute("role", "dialog");
        pop.setAttribute("aria-label", "Video player");
        var box = document.createElement("div");
        box.className = "box";
        var close = document.createElement("button");
        close.type = "button";
        close.className = "close";
        close.textContent = "Close";
        close.addEventListener("click", closePop);
        var title = document.createElement("span");
        title.className = "title";
        title.textContent = frame.getAttribute("aria-label") || "Recap";
        box.appendChild(title);
        box.appendChild(close);
        // The artifact viewer does not allow an embedded player, so it shows a mockup player.
        var local = location.protocol === "file:" || location.hostname === "localhost";
        if (local) {
          var player = document.createElement("iframe");
          player.src = "https://www.youtube-nocookie.com/embed/" + frame.dataset.yt + "?autoplay=1&rel=0";
          player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
          player.title = "Video player";
          box.appendChild(player);
        } else {
          var still = frame.querySelector("img").cloneNode();
          box.appendChild(still);
          var bar = document.createElement("span");
          bar.className = "fake-player";
          bar.innerHTML = "<span>❚❚</span><i></i><span>0:12 / 1:04</span>";
          box.appendChild(bar);
        }
        pop.appendChild(box);
        pop.addEventListener("click", function (event) {
          if (event.target === pop) closePop();
        });
        document.body.appendChild(pop);
        close.focus();
      });
    });

    // Manager: open and close a form.
    document.querySelectorAll("[data-open]").forEach(function (button) {
      button.addEventListener("click", function () {
        document.getElementById(button.dataset.open).hidden = false;
      });
    });
    document.querySelectorAll("[data-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        document.getElementById(button.dataset.close).hidden = true;
      });
    });

    // Manager: drag a row to change the priority inside a tier.
    var dragged = null;
    document.querySelectorAll("table[data-sort] tbody").forEach(function (body) {
      body.addEventListener("dragstart", function (event) {
        dragged = event.target.closest("tr");
        dragged.classList.add("dragging");
      });
      body.addEventListener("dragend", function () {
        if (dragged) dragged.classList.remove("dragging");
        body.querySelectorAll("tr").forEach(function (row, i) {
          row.querySelector(".rank").textContent = i + 1;
        });
        dragged = null;
      });
      body.addEventListener("dragover", function (event) {
        var over = event.target.closest("tr");
        if (!dragged || !over || over === dragged || over.parentNode !== body) return;
        event.preventDefault();
        var box = over.getBoundingClientRect();
        body.insertBefore(dragged, event.clientY > box.top + box.height / 2 ? over.nextSibling : over);
      });
    });

    // Roster Builder: drag a Player to a column. The counts and the fees change.
    var board = document.querySelector(".board");
    if (board) {
      var card = null;
      function recount() {
        board.querySelectorAll("[data-drop]").forEach(function (col) {
          col.querySelector(".count").textContent = col.querySelectorAll(".pcard").length;
        });
        var skaters = function (answer) {
          return board.querySelectorAll("[data-drop='" + answer + "'] .pcard:not([data-pos='G'])").length;
        };
        var ft = skaters("full-time");
        var pt = skaters("part-time");
        var fee = Number(document.getElementById("fee").value) * 100 || 0;
        var full = Math.ceil(fee / Math.max(12, ft + pt / 2));
        var money = function (cents) {
          return "$" + Math.floor(cents / 100).toLocaleString("en-US") + "." + String(cents % 100).padStart(2, "0");
        };
        document.getElementById("fee-full").textContent = money(full);
        document.getElementById("fee-part").textContent = money(Math.ceil(full / 2));
        document.getElementById("fee-count").textContent = ft + " + " + pt + "/2";
        var count = function (pos) {
          return board.querySelectorAll("[data-drop='full-time'] .pcard[data-pos='" + pos + "'], [data-drop='part-time'] .pcard[data-pos='" + pos + "']").length;
        };
        document.getElementById("targets").textContent =
          "Forwards " + count("F") + " of " + document.getElementById("tf").value +
          " · Defense " + count("D") + " of " + document.getElementById("td").value +
          " · Goalies " + count("G") + " of " + document.getElementById("tg").value;
      }
      board.addEventListener("dragstart", function (event) {
        card = event.target.closest(".pcard");
        if (card) card.classList.add("dragging");
      });
      board.addEventListener("dragend", function () {
        if (card) card.classList.remove("dragging");
        board.querySelectorAll(".over").forEach(function (col) { col.classList.remove("over"); });
        card = null;
        recount();
      });
      board.querySelectorAll("[data-drop]").forEach(function (col) {
        col.addEventListener("dragover", function (event) {
          event.preventDefault();
          col.classList.add("over");
        });
        col.addEventListener("dragleave", function () { col.classList.remove("over"); });
        col.addEventListener("drop", function (event) {
          event.preventDefault();
          if (card) col.querySelector("ul").appendChild(card);
        });
      });
      ["fee", "tf", "td", "tg"].forEach(function (id) {
        document.getElementById(id).addEventListener("input", recount);
      });
      recount();
    }

    // Copy the chase message.
    document.querySelectorAll("[data-copy]").forEach(function (button) {
      button.addEventListener("click", function () {
        var text = document.getElementById(button.dataset.copy).textContent;
        var done = function () { button.textContent = "Copied"; };
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
      });
    });

    // Sign-in: the first step asks for the code, the second step signs in.
    document.querySelectorAll("[data-login]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var step2 = form.querySelector(".step2");
        if (step2.hidden) {
          step2.hidden = false;
          step2.querySelector("input").focus();
          return;
        }
        setAuth("in");
        if (/login\.html$/.test(location.pathname)) location.href = "manager.html";
      });
    });
    document.querySelectorAll("[data-signout]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        setAuth("out");
      });
    });
    function setAuth(value) {
      root.dataset.auth = value;
      save("auth", value);
      syncPanel();
    }

    // Dev panel: a bar of mockup settings, as in browser dev tools. It is not part of the design.
    var pages = [["home.html", "Home"], ["schedule.html", "Schedule"], ["stats.html", "Stats"], ["roster.html", "Roster"], ["player.html", "Player"],
      ["game.html", "Game"], ["game-sheet-only.html", "Sheet Only"], ["opponent.html", "Opponent"], ["shop.html", "Shop"], ["login.html", "Sign-in"],
      ["manager.html", "Mgr: Players"], ["manager-season.html", "Mgr: Seasons"], ["manager-jerseys.html", "Mgr: Jerseys"]];
    var here = location.pathname.split("/").pop() || "home.html";
    if (here === "index.html" || here.indexOf(".") < 0) here = "home.html";
    var panel = document.createElement("aside");
    panel.className = "devbar";
    panel.setAttribute("aria-label", "Mockup settings");
    panel.innerHTML =
      '<button type="button" class="dv-toggle" aria-expanded="true" title="Mockup settings">⚙ <span>Mockup</span></button>' +
      '<div class="dv-body">' +
      '<div class="dv-row"><span class="dv-k">page</span><select class="dv-page">' +
      pages.map(function (p) { return '<option value="' + p[0] + '"' + (p[0] === here ? " selected" : "") + ">" + p[1] + "</option>"; }).join("") +
      '</select></div>' +
      '<div class="dv-row"><span class="dv-k">theme</span><span class="dv-seg" data-key="theme"><button value="home">home</button><button value="away">away</button><button value="third">third</button></span></div>' +
      '<div class="dv-row"><span class="dv-k">recent</span><span class="dv-seg" data-key="recent"><button value="bar">bar</button><button value="cards">cards</button><button value="list">list</button><button value="board">scores</button></span></div>' +
      '<div class="dv-row"><span class="dv-k">notice</span><span class="dv-seg" data-key="notice"><button value="none">none</button><button value="info">info</button><button value="alert">alert</button></span></div>' +
      '<div class="dv-row"><span class="dv-k">manager</span><span class="dv-seg" data-key="auth"><button value="out">signed out</button><button value="in">signed in</button></span></div>' +
      '<p class="dv-note"></p>' +
      '</div>';
    document.body.appendChild(panel);
    function syncPanel() {
      panel.querySelectorAll(".dv-seg").forEach(function (seg) {
        seg.querySelectorAll("button").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.value === root.dataset[seg.dataset.key]));
        });
      });
      var notes = {
        bar: "Recent: the game bar on each page. Home has no results section.",
        cards: "Recent: no game bar. Home shows three game cards and Next games.",
        list: "Recent: no game bar. Home shows a results list and Next games.",
        board: "Recent: no game bar. Home shows a scoreboard of four Games and Next games."
      };
      var note = notes[root.dataset.recent];
      note += root.dataset.notice === "none" ? " No notice is active, so no notice bar shows." : " A notice is active, so the notice bar shows below the menu.";
      note += root.dataset.auth === "in"
        ? " Signed in: a Manager strip shows above the header, and the Manager pages open."
        : " Signed out: the Manager pages show the sign-in step.";
      panel.querySelector(".dv-note").textContent = note;
      panel.querySelector(".dv-toggle").setAttribute("aria-expanded", String(root.dataset.panel === "open"));
      show();
    }
    panel.querySelectorAll(".dv-seg").forEach(function (seg) {
      seg.addEventListener("click", function (event) {
        var b = event.target.closest("button");
        if (!b) return;
        var key = seg.dataset.key;
        root.dataset[key] = b.value;
        save(key === "theme" ? "theme-x" : key, b.value);
        if (key === "recent") root.dataset.bar = b.value === "bar" ? "on" : "off";
        if (key === "notice") fillNotice();
        if (key === "theme") {
          try {
            localStorage.setItem("theme", b.value);
          } catch (error) {}
        }
        syncPanel();
      });
    });
    panel.querySelector(".dv-page").addEventListener("change", function (event) {
      location.href = event.target.value;
    });
    panel.querySelector(".dv-toggle").addEventListener("click", function () {
      root.dataset.panel = root.dataset.panel === "open" ? "closed" : "open";
      save("panel", root.dataset.panel);
      syncPanel();
    });
    buttons.forEach(function (button) {
      button.addEventListener("click", syncPanel);
    });
    // Notice bar: it shows only when a notice is active. The text here is an example.
    var notices = {
      info: ["New", "The Recap of Ice Pak at Night Owls is up.", "Watch it", "game.html"],
      alert: ["Changed", "Sun, Nov 22 vs Yetis now starts at 8:15 PM at County Ice Center.", "Schedule", "schedule.html"]
    };
    function fillNotice() {
      var bar = document.querySelector("[data-notice-bar]");
      var n = notices[root.dataset.notice];
      if (!bar || !n) return;
      bar.querySelector(".ntag").textContent = n[0];
      bar.querySelector(".ntext").textContent = n[1];
      bar.querySelector(".nlink").textContent = n[2];
      bar.querySelector(".nlink").href = n[3];
    }
    var nclose = document.querySelector(".nclose");
    if (nclose) nclose.addEventListener("click", function () {
      root.dataset.notice = "none";
      save("notice", "none");
      syncPanel();
    });
    fillNotice();
    syncPanel();

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
