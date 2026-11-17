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
  // Notice: the message (nmsg) sets the kind (notice): info or alert. ?notice=info and ?notice=alert still work.
  var oldNotice = read("notice", "none");
  root.dataset.nmsg = read("nmsg", { info: "recap", alert: "change" }[oldNotice] || "none");
  root.dataset.notice = { recap: "info", event: "info", change: "alert", cancel: "alert" }[root.dataset.nmsg] || "none";
  // Notice style: six options to compare. "slim" is the default.
  root.dataset.nstyle = read("nstyle", "auto");
  // nview is the style that the page shows. In "auto" it changes with the state of the notice.
  root.dataset.nview = root.dataset.nstyle;
  // Auto: choose the style before the page draws, so the notice does not flash as a bar.
  if (root.dataset.nstyle === "auto" && root.dataset.notice !== "none") {
    var nst0 = read("nstate-" + root.dataset.nmsg, "new");
    root.dataset.nview = nst0 === "new" ? (root.dataset.notice === "alert" ? "card" : "toast") : "side";
    root.dataset.ngone = String(nst0 === "closed");
    root.dataset.nread = String(nst0 === "viewed");
  }
  root.dataset.switcher = read("switcher", "buttons");
  root.dataset.auth = read("auth", "out");
  // Manager style: how a signed-in Manager sees the Manager links. "menu" is the default.
  root.dataset.mstyle = read("mstyle", "menu");
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
    var panels = document.querySelectorAll("body [data-panel]");
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

    // Stats: the League list shows the seasons of that League, and the Season list opens the season panel.
    var pick = document.querySelector("[data-view-select]");
    if (pick) {
      var all = document.querySelector("[data-view='all']");
      var lg = document.querySelector("[data-league]");
      var showLeague = function (name) {
        Array.prototype.forEach.call(pick.options, function (o, i) {
          if (i) o.hidden = o.disabled = !!name && o.dataset.lg !== name;
        });
      };
      pick.addEventListener("change", function () {
        if (!pick.value) return;
        all.setAttribute("aria-pressed", "false");
        pick.classList.add("on");
        if (lg) { lg.value = pick.selectedOptions[0].dataset.lg; lg.classList.add("on"); showLeague(lg.value); }
        panels.forEach(function (panel) {
          panel.hidden = panel.dataset.panel !== "ls";
        });
      });
      if (lg) lg.addEventListener("change", function () {
        showLeague(lg.value);
        if (!lg.value) return;
        // A new League opens its newest season.
        var first = Array.prototype.find.call(pick.options, function (o) { return o.dataset.lg === lg.value; });
        pick.value = first.value;
        pick.dispatchEvent(new Event("change"));
      });
      all.addEventListener("click", function () {
        pick.classList.remove("on");
        pick.selectedIndex = 0;
        if (lg) { lg.classList.remove("on"); lg.selectedIndex = 0; showLeague(""); }
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

    // Manager: each position button turns on or off. At least one stays on.
    document.querySelectorAll(".pos-tg").forEach(function (group) {
      group.addEventListener("click", function (event) {
        var b = event.target.closest("button");
        if (!b) return;
        var on = b.getAttribute("aria-pressed") === "true";
        if (on && group.querySelectorAll('[aria-pressed="true"]').length === 1) return;
        b.setAttribute("aria-pressed", String(!on));
      });
    });

    // A dialog sits at the end of the page, so it covers the sticky header too.
    document.querySelectorAll(".modal").forEach(function (m) {
      document.body.appendChild(m);
    });

    // New season dialog: "New League…" in the League list opens the New League dialog.
    document.querySelectorAll("[data-new-league]").forEach(function (sel) {
      sel.addEventListener("change", function () {
        if (sel.value !== "new") return;
        sel.selectedIndex = 0;
        document.getElementById("new-season").hidden = true;
        document.getElementById("new-league").hidden = false;
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
        var n = ft + pt / 2, used = Math.max(12, n);
        document.getElementById("fee-info").textContent = ft + " full-time Players count as 1 each. " + pt + " part-time Players count as half each (" + pt + "/2 = " + pt / 2 + "). " +
          "Goalies pay no fee and are not counted. That is " + n + " Players. " + (n < 12 ? "The minimum count is 12, so the fee uses 12. " : "") +
          "Full-time fee = " + money(fee) + " ÷ " + used + " = " + money(full) + ", rounded up to the next cent.";
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
    // Account menu and floating Manage button: a click opens the list of Manager links. Escape or a click outside closes it.
    document.querySelectorAll(".acct-btn, .mpill-btn, .mgr-dd-btn").forEach(function (btn) {
      var list = document.getElementById(btn.getAttribute("aria-controls"));
      btn.addEventListener("click", function (event) {
        event.stopPropagation();
        var open = list.hidden;
        list.hidden = !open;
        btn.setAttribute("aria-expanded", String(open));
      });
    });
    function closeMgrMenus() {
      document.querySelectorAll(".acct-btn, .mpill-btn, .mgr-dd-btn").forEach(function (btn) {
        document.getElementById(btn.getAttribute("aria-controls")).hidden = true;
        btn.setAttribute("aria-expanded", "false");
      });
    }
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".acct-menu, .mpill-menu")) closeMgrMenus();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMgrMenus();
    });
    // Pencils: each section title on a public page gets an Edit link.
    if (!document.body.classList.contains("mgr-area")) {
      document.querySelectorAll("main .sec-head, .band .title-row, .band > .wrap > h1").forEach(function (head) {
        var pen = document.createElement("a");
        pen.href = "#";
        pen.className = "edit-pen";
        pen.setAttribute("data-auth", "in");
        pen.innerHTML = '<span aria-hidden="true">✎</span> Edit';
        if (head.tagName === "H1") head.insertAdjacentElement("afterend", pen); else head.appendChild(pen);
      });
    }
    // Info button: the explanation shows on hover and on a click or a tap. Escape or a click outside closes it.
    document.querySelectorAll(".info-btn").forEach(function (btn) {
      var pop = document.getElementById(btn.getAttribute("aria-controls"));
      var wrap = btn.closest(".info-wrap");
      var set = function (open) { pop.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
      btn.addEventListener("click", function (event) { event.stopPropagation(); btn.dataset.pinned = btn.dataset.pinned === "1" ? "" : "1"; set(btn.dataset.pinned === "1"); });
      wrap.addEventListener("mouseenter", function () { set(true); });
      wrap.addEventListener("mouseleave", function () { if (btn.dataset.pinned !== "1") set(false); });
      document.addEventListener("click", function (event) { if (!wrap.contains(event.target)) { btn.dataset.pinned = ""; set(false); } });
      document.addEventListener("keydown", function (event) { if (event.key === "Escape") { btn.dataset.pinned = ""; set(false); } });
    });
    // Phone: the game bar sticks below the header, so the page needs the height of the header.
    var siteHead = document.querySelector(".site-head");
    var setHeadH = function () { if (siteHead) root.style.setProperty("--head-h0", siteHead.offsetHeight + "px"); };
    setHeadH();
    addEventListener("resize", setHeadH);
    // The header can change height after the fonts load; measure it again when it does.
    if (siteHead && window.ResizeObserver) new ResizeObserver(setHeadH).observe(siteHead);
    if (document.fonts) document.fonts.ready.then(setHeadH);

    // Game bar: drag with the mouse to scroll. A phone swipes with no script. The bar starts at the next game.
    var track = document.querySelector(".gtrack");
    if (track) {
      var nextTile = track.querySelector(".gtile.next");
      if (nextTile && matchMedia("(max-width: 760px)").matches) track.scrollLeft = nextTile.offsetLeft - track.offsetLeft;
      var drag = null;
      track.addEventListener("pointerdown", function (event) {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        drag = { x: event.clientX, left: track.scrollLeft, moved: false };
      });
      addEventListener("pointermove", function (event) {
        if (!drag) return;
        var dx = event.clientX - drag.x;
        if (!drag.moved && Math.abs(dx) > 5) { drag.moved = true; track.classList.add("dragging"); }
        if (drag.moved) track.scrollLeft = drag.left - dx;
      });
      addEventListener("pointerup", function () {
        if (!drag) return;
        var moved = drag.moved;
        drag = null;
        if (!moved) return;
        // A drag is not a click: the tile under the pointer does not open.
        var stop = function (event) { event.preventDefault(); event.stopPropagation(); };
        track.addEventListener("click", stop, { capture: true, once: true });
        setTimeout(function () { track.removeEventListener("click", stop, { capture: true }); track.classList.remove("dragging"); }, 0);
      });
    }

    function setAuth(value) {
      root.dataset.auth = value;
      save("auth", value);
      syncPanel();
    }

    // Phone menu: one button opens the pages, the Theme, and the Manager link.
    var menuBtn = document.querySelector(".menu-btn");
    var menu = document.getElementById("menu");
    if (menuBtn && menu) {
      var openMenu = function (open) {
        menu.hidden = !open;
        menuBtn.setAttribute("aria-expanded", String(open));
        root.classList.toggle("menu-open", open);
      };
      menuBtn.addEventListener("click", function () { openMenu(menu.hidden); });
      menu.querySelectorAll("[data-theme-choice]").forEach(function (b) {
        b.addEventListener("click", function () { if (typeof syncDd === "function") syncDd(); });
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") openMenu(false);
      });
      matchMedia("(min-width: 761px)").addEventListener("change", function (m) { if (m.matches) openMenu(false); });
    }

    // Jerseys: each slot is one jersey of one Player. A slot opens the dialog for that Player and that jersey.
    var aj = document.querySelector("[data-add-jersey]");
    if (aj) {
      var ajPlayer = aj.querySelector("#aj-player"), ajKit = aj.querySelector("#aj-kit"), ajNo = aj.querySelector("#aj-no");
      var ajSize = aj.querySelector("#aj-size"), ajSt = aj.querySelector("#aj-st"), ajTitle = aj.querySelector("#aj-title");
      var stText = { paid: "Owns · paid", owes: "Owns · owes", loan: "On loan" };
      var kitText = { home: "Home", away: "Away", third: "Heritage" };
      var slotOf = function () {
        var row = Array.prototype.find.call(document.querySelectorAll(".jrow"), function (r) { return r.dataset.player === ajPlayer.value; });
        return row && row.querySelector('.jslot[data-kit="' + ajKit.value + '"]');
      };
      var fillNo = function () {
        var slot = slotOf(), kit = ajKit.value;
        var mine = slot ? slot.dataset.no : "";
        var free = Array.prototype.filter.call(document.querySelectorAll('.nboard[data-kit="' + kit + '"] .nb-grid span'), function (x) { return !x.classList.contains("taken"); })
          .map(function (x) { return x.dataset.no; });
        var list = (mine ? [mine] : []).concat(free);
        ajNo.innerHTML = list.map(function (n) { return "<option>" + n + "</option>"; }).join("");
        // A new jersey starts with the Player's number on another jersey, when that number is free.
        var other = slot && !mine && Array.prototype.map.call(slot.closest(".jrow").querySelectorAll(".jslot"), function (x) { return x.dataset.no; })
          .find(function (n) { return n && free.indexOf(n) >= 0; });
        if (other) ajNo.value = other;
        if (slot) {
          ajSize.value = slot.dataset.size;
          ajSt.value = slot.dataset.st === "none" ? "paid" : slot.dataset.st;
          ajTitle.textContent = slot.dataset.st === "none" ? "Add a jersey" : "Change a jersey";
        }
      };
      ajPlayer.addEventListener("change", fillNo);
      ajKit.addEventListener("change", fillNo);
      document.querySelectorAll("[data-open='add-jersey']").forEach(function (b) {
        b.addEventListener("click", function () {
          if (b.classList.contains("jslot")) {
            ajPlayer.value = b.closest(".jrow").dataset.player;
            ajKit.value = b.dataset.kit;
          }
          fillNo();
        });
      });
      // The counts and the number boards come from the slots.
      var recountJ = function () {
        var c = { paid: 0, owes: 0, loan: 0 };
        document.querySelectorAll(".jslot").forEach(function (x) { if (c[x.dataset.st] !== undefined) c[x.dataset.st]++; });
        document.getElementById("jc-out").textContent = c.paid + c.owes + c.loan;
        document.getElementById("jc-owned").textContent = c.paid + c.owes;
        document.getElementById("jc-loan").textContent = c.loan;
        document.getElementById("jc-owes").textContent = c.owes;
        document.querySelectorAll(".nboard").forEach(function (bd) {
          var who = {};
          document.querySelectorAll('.jslot[data-kit="' + bd.dataset.kit + '"]').forEach(function (x) {
            if (x.dataset.no && x.dataset.st !== "none") who[x.dataset.no] = x.closest(".jrow").dataset.player;
          });
          var n = 0;
          bd.querySelectorAll(".nb-grid span").forEach(function (x) {
            var t = who[x.dataset.no];
            x.classList.toggle("taken", !!t);
            if (t) x.title = t; else { x.removeAttribute("title"); n++; }
          });
          bd.querySelector("[data-free-count]").textContent = n;
        });
      };
      aj.addEventListener("submit", function (event) {
        event.preventDefault();
        var slot = slotOf();
        if (slot) {
          var st = ajSt.value, kit = slot.dataset.kit, name = ajPlayer.value;
          slot.dataset.st = st;
          slot.dataset.size = ajSize.value;
          slot.dataset.no = st === "none" ? "" : ajNo.value;
          if (st === "none") {
            slot.innerHTML = '<span class="js-add">+ ' + kitText[kit] + "</span>";
            slot.setAttribute("aria-label", "Add a " + kitText[kit] + " jersey for " + name);
          } else {
            slot.innerHTML = '<span class="js-kit">' + kitText[kit] + '</span><span class="js-no">' + (ajNo.value || "–") + '</span><span class="js-size">' + ajSize.value + '</span><span class="js-st">' + stText[st] + "</span>";
            slot.setAttribute("aria-label", kitText[kit] + " jersey of " + name + ": number " + ajNo.value + ", size " + ajSize.value + ", " + stText[st] + ". Change it");
          }
          slot.classList.remove("flash"); void slot.offsetWidth; slot.classList.add("flash");
        }
        recountJ();
        aj.closest(".modal").hidden = true;
      });
    }

    // + Payment: the dialog shows what the Player owes, and Save changes the row of the Player.
    var payForm = document.querySelector("[data-add-payment]");
    if (payForm) {
      var payRow = null, payData = null;
      var usd = function (c) { return (c < 0 ? "-" : "") + "$" + (Math.abs(c) / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
      document.querySelectorAll("[data-pay]").forEach(function (b) {
        b.addEventListener("click", function () {
          var p = b.dataset.pay.split("|");
          payRow = b.closest("tr");
          payData = { name: p[0], season: Number(p[1]), all: Number(p[2]), fee: Number(p[3]) };
          payForm.querySelector("[data-pay-name]").textContent = payData.name;
          payForm.querySelector("[data-pay-season]").textContent = usd(payData.season);
          payForm.querySelector("[data-pay-all]").textContent = usd(payData.all);
          payForm.querySelector("#pay-amt").value = (Math.max(payData.season, 0) / 100).toFixed(2);
          payForm.querySelector("#pay-note").value = "";
        });
      });
      payForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var cents = Math.round(parseFloat(payForm.querySelector("#pay-amt").value.replace(/[$,]/g, "")) * 100) || 0;
        if (payRow && payData) {
          var season = payData.season - cents, all = payData.all - cents, paid = payData.fee - season;
          var td = payRow.children;
          td[1].innerHTML = usd(paid) + ' <span class="muted">of ' + usd(payData.fee) + "</span>";
          td[2].textContent = usd(season);
          td[3].className = "n wide-only bal " + (all > 0 ? "owes" : all < 0 ? "credit" : "zero");
          td[3].textContent = all < 0 ? usd(-all) + " credit" : usd(all);
          td[4].innerHTML = season <= 0 ? '<span class="tag win">Paid</span>' : '<span class="tag">Part paid</span>';
          payRow.querySelector("[data-pay]").dataset.pay = [payData.name, season, all, payData.fee].join("|");
          payRow.classList.remove("flash"); void payRow.offsetWidth; payRow.classList.add("flash");
        }
        payForm.closest(".modal").hidden = true;
      });
    }


    // Theme dropdown: one button that opens a list of the three Themes.
    var dd = document.querySelector(".theme-dd");
    if (dd) {
      var ddBtn = dd.querySelector(".dd-btn");
      var ddMenu = dd.querySelector(".dd-menu");
      var names = { home: "Home", away: "Away", third: "Heritage" };
      var syncDd = function () {
        ddBtn.querySelector(".kit-chip").className = "kit-chip " + root.dataset.theme;
        ddBtn.querySelector(".dd-name").textContent = names[root.dataset.theme];
        ddMenu.querySelectorAll("[data-theme-choice]").forEach(function (o) {
          o.setAttribute("aria-selected", String(o.dataset.themeChoice === root.dataset.theme));
        });
      };
      var openDd = function (open) {
        ddMenu.hidden = !open;
        ddBtn.setAttribute("aria-expanded", String(open));
      };
      ddBtn.addEventListener("click", function () { openDd(ddMenu.hidden); });
      ddMenu.querySelectorAll("[data-theme-choice]").forEach(function (o) {
        o.addEventListener("click", function () {
          root.dataset.theme = o.dataset.themeChoice;
          try {
            localStorage.setItem("theme", o.dataset.themeChoice);
          } catch (error) {}
          openDd(false);
          show();
          syncDd();
          if (typeof syncPanel === "function") syncPanel();
        });
      });
      document.addEventListener("click", function (event) {
        if (!dd.contains(event.target)) openDd(false);
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") openDd(false);
      });
      buttons.forEach(function (b) { b.addEventListener("click", syncDd); });
      syncDd();
    }

    // Dev panel: a bar of mockup settings, as in browser dev tools. It is not part of the design.
    var pages = [["home.html", "Home"], ["schedule.html", "Schedule"], ["stats.html", "Stats"], ["roster.html", "Roster"], ["player.html", "Player"],
      ["game.html", "Game"], ["game-next.html", "Next game"], ["game-sheet-only.html", "Sheet Only"], ["opponent.html", "Opponent"], ["shop.html", "Shop"], ["login.html", "Sign-in"],
      ["manager.html", "Mgr: Players"], ["manager-season.html", "Mgr: Seasons"], ["manager-ledger.html", "Mgr: Ledger"], ["manager-jerseys.html", "Mgr: Jerseys"]];
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
      '<div class="dv-row"><span class="dv-k">theme</span><span class="dv-seg" data-key="theme"><button value="home">home</button><button value="away">away</button><button value="third">heritage</button></span></div>' +
      '<div class="dv-row"><span class="dv-k">switch</span><span class="dv-seg" data-key="switcher"><button value="buttons">buttons</button><button value="dropdown">dropdown</button></span></div>' +
      '<div class="dv-row"><span class="dv-k">recent</span><span class="dv-seg" data-key="recent"><button value="bar">bar</button><button value="cards">cards</button><button value="list">list</button><button value="board">scores</button></span></div>' +
      '<div class="dv-row"><span class="dv-k">notice</span><span class="dv-seg" data-key="nmsg"><button value="none">none</button><button value="recap">recap</button><button value="event">event</button><button value="change">change</button><button value="cancel">cancel</button></span></div>' +
      '<div class="dv-row"><span class="dv-k">style</span><span class="dv-seg" data-key="nstyle"><button value="auto">auto</button><button value="slim">slim</button><button value="card">card</button><button value="toast">toast</button><button value="side">side tab</button><button value="bottom">bottom</button><button value="stripes">stripes</button></span></div>' +
      '<div class="dv-row"><span class="dv-k">auto</span><button type="button" class="dv-replay">replay the first visit</button><span class="dv-nstate"></span></div>' +
      '<div class="dv-row"><span class="dv-k">manager</span><span class="dv-seg" data-key="auth"><button value="out">signed out</button><button value="in">signed in</button></span></div>' +
      '<div class="dv-row"><span class="dv-k">mgr style</span><span class="dv-seg" data-key="mstyle"><button value="nav">nav</button><button value="menu">menu</button><button value="pill">button</button><button value="inline">pencils</button><button value="strip">strip</button></span></div>' +
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
      note += root.dataset.notice === "none" ? " No notice is active, so no notice bar shows." : " A notice is active. The style row sets how it shows.";
      note += root.dataset.auth === "in"
        ? " Signed in: the mgr style row sets how the Manager links show, and the Manager pages open."
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
        if (key === "nmsg") { root.dataset.notice = { recap: "info", event: "info", change: "alert", cancel: "alert" }[b.value] || "none"; save("notice", root.dataset.notice); }
        if (key === "nmsg" || key === "nstyle") { root.dataset.nopen = "false"; fillNotice(); startNotice(); }
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
    // Notice: it shows only when a notice is active. The messages are examples: a notice can be about a Game or about anything else.
    // Each message: tag, text, link text, link.
    var notices = {
      recap: ["New Recap", "The Recap of Ice Pak at Night Owls is up.", "Watch it", "game.html"],
      event: ["Team event", "End-of-season party on Sat, Dec 19 at 7 PM. Partners and kids are welcome.", "Details", "#"],
      change: ["Time change", "Sun, Nov 22 vs Yetis now starts at 8:15 PM at County Ice Center.", "Schedule", "schedule.html"],
      cancel: ["Cancelled", "Sun, Dec 6 vs Wild is cancelled. The rink is closed for repairs.", "Schedule", "schedule.html"]
    };
    function fillNotice() {
      var bar = document.querySelector("[data-notice-bar]");
      var n = notices[root.dataset.nmsg];
      if (!bar || !n) return;
      bar.querySelector(".ntag").textContent = n[0];
      bar.querySelector(".ntext").textContent = n[1];
      bar.querySelector(".nlink").textContent = n[2];
      bar.querySelector(".nlink").href = n[3];
      var tab = document.querySelector(".nside-tab");
      if (tab) tab.setAttribute("aria-expanded", String(root.dataset.nopen === "true"));
    }
    // Side tab: the tab opens and closes the notice panel.
    // Side tab and side panel: centred on whole pixels. A half pixel makes the text blurry.
    function placeSide() {
      var tab = document.querySelector(".nside-tab"), panel = document.querySelector("[data-notice-bar]");
      if (tab) tab.style.top = Math.round((innerHeight - 96) / 2) + "px";
      if (panel && root.dataset.nview === "side" && !matchMedia("(max-width: 760px)").matches) {
        panel.style.top = Math.round((innerHeight - panel.offsetHeight) / 2) + "px";
      } else if (panel) {
        panel.style.top = "";
      }
    }
    addEventListener("resize", placeSide);
    // Side tab on a wide screen, bell in the header on a phone: each one opens and closes the notice panel.
    document.querySelectorAll(".nside-tab, .nbell").forEach(function (opener) {
      opener.addEventListener("click", function (event) {
        event.stopPropagation();
        root.dataset.nopen = root.dataset.nopen === "true" ? "false" : "true";
        var bar = document.querySelector(".gamebar");
        var head = bar && bar.offsetParent ? bar : document.querySelector(".site-head");
        if (head) root.style.setProperty("--head-h", head.getBoundingClientRect().bottom + "px");
        fillNotice();
        document.querySelectorAll(".nbell").forEach(function (b) { b.setAttribute("aria-expanded", root.dataset.nopen); });
        placeSide();
      });
    });
    // Auto: announce once, then stay quietly in the side tab.
    // - First visit: a change or a cancellation shows as a card; a recap or an event shows as a toast.
    // - No action: the toast goes to the side tab after 8 seconds. On the next page, the notice is in the side tab with an unread dot.
    // - Viewed (the link): the tab stays, with no dot. Closed (×): the notice is gone on every page.
    // The state of each message is kept for each message, so a new notice starts again with the first visit.
    var nTimer = null;
    function nKey() { return "nstate-" + root.dataset.nmsg; }
    function nState(v) {
      if (v !== undefined) save(nKey(), v);
      return read(nKey(), "new");
    }
    function startNotice() {
      clearTimeout(nTimer);
      root.dataset.nread = "false";
      root.dataset.ngone = "false";
      if (root.dataset.nstyle !== "auto" || root.dataset.notice === "none") {
        root.dataset.nview = root.dataset.nstyle === "auto" ? "toast" : root.dataset.nstyle;
        showState();
        return;
      }
      var st = nState();
      if (st === "closed") root.dataset.ngone = "true";
      if (st === "new") {
        nState("seen");
        if (root.dataset.notice === "alert") {
          root.dataset.nview = "card";
        } else {
          root.dataset.nview = "toast";
          nTimer = setTimeout(dockToast, 8000);
        }
      } else {
        root.dataset.nview = "side";
        root.dataset.nread = String(st === "viewed");
      }
      showState();
    }
    // The toast flies to the right edge and shrinks into the side tab. Then the tab pops out with a short glow.
    function dockToast() {
      var bar = document.querySelector("[data-notice-bar]");
      var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      var finish = function () {
        root.dataset.nview = "side";
        showState();
        var tab = document.querySelector(".nside-tab");
        var bellEl = document.querySelector(".nbell");
        if (bellEl && bellEl.offsetParent && !still && bellEl.animate) {
          bellEl.animate([
            { transform: "scale(1.4) rotate(-14deg)", boxShadow: "0 0 0 10px rgb(245 197 66 / 0.55)" },
            { transform: "scale(1.15) rotate(12deg)", offset: 0.35 },
            { transform: "scale(1) rotate(0)", boxShadow: "0 0 0 0 rgb(245 197 66 / 0)" }
          ], { duration: 700, easing: "ease-out" });
        } else if (tab && !still && tab.animate) {
          tab.animate([
            { transform: "rotate(180deg) scale(1.35)", boxShadow: "0 0 0 10px rgb(245 197 66 / 0.55)" },
            { transform: "rotate(180deg) scale(1)", boxShadow: "0 0 0 0 rgb(245 197 66 / 0)" }
          ], { duration: 650, easing: "cubic-bezier(0.3, 1.6, 0.5, 1)" });
        }
      };
      if (!bar || still || !bar.animate) { finish(); return; }
      var r = bar.getBoundingClientRect();
      // The target: the bell in the header on a phone, the side tab at the right edge on a wide screen.
      var bell = document.querySelector(".nbell");
      var phone = matchMedia("(max-width: 760px)").matches && bell && bell.offsetParent;
      var tx = innerWidth - 18, ty = innerHeight / 2;
      if (phone) { var br = bell.getBoundingClientRect(); tx = br.left + br.width / 2; ty = br.top + br.height / 2; }
      var dx = tx - (r.left + r.width / 2);
      var dy = ty - (r.top + r.height / 2);
      bar.animate([
        { transform: "translate(0, 0) scale(1)", opacity: 1, borderRadius: "0" },
        { transform: "translate(" + dx * 0.55 + "px, " + dy * 0.35 + "px) scale(0.55)", opacity: 0.9, borderRadius: "12px", offset: 0.55 },
        { transform: "translate(" + dx + "px, " + dy + "px) scale(0.08)", opacity: 0, borderRadius: "40px" }
      ], { duration: 700, easing: "cubic-bezier(0.55, 0, 0.35, 1)" }).onfinish = finish;
    }
    function showState() {
      if (typeof placeSide === "function") placeSide();
      var out = document.querySelector(".dv-nstate");
      if (out) out.textContent = root.dataset.nstyle === "auto" && root.dataset.notice !== "none" ? "now: " + (root.dataset.ngone === "true" ? "closed" : root.dataset.nview) : "";
    }
    var nlink = document.querySelector(".notice .nlink");
    if (nlink) nlink.addEventListener("click", function () {
      if (root.dataset.nstyle === "auto") nState("viewed");
    });
    var replay = document.querySelector(".dv-replay");
    if (replay) replay.addEventListener("click", function () {
      ["recap", "event", "change", "cancel"].forEach(function (m) { save("nstate-" + m, "new"); });
      root.dataset.nopen = "false";
      startNotice();
    });
    var nclose = document.querySelector(".nclose");
    if (nclose) nclose.addEventListener("click", function () {
      // Phone: the game bar comes back in the place of the closed card, with a short slide.
      var gbar = document.querySelector(".gamebar");
      if (gbar) { gbar.classList.remove("bar-back"); void gbar.offsetWidth; gbar.classList.add("bar-back"); }
      // The bar was hidden, so it starts again at the next game.
      setTimeout(function () {
        var tr = document.querySelector(".gtrack"), nx = tr && tr.querySelector(".gtile.next");
        if (nx && matchMedia("(max-width: 760px)").matches) tr.scrollLeft = nx.offsetLeft - tr.offsetLeft;
      }, 0);
      if (root.dataset.nstyle === "auto") {
        clearTimeout(nTimer);
        nState("closed");
        root.dataset.ngone = "true";
        showState();
        return;
      }
      root.dataset.notice = root.dataset.nmsg = "none";
      save("notice", "none");
      save("nmsg", "none");
      syncPanel();
    });
    fillNotice();
    startNotice();
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

// Player Bank: a click on a Manager note shows the full text or one line
document.addEventListener("click", (ev) => {
  const b = ev.target.closest(".pnote");
  if (!b) return;
  b.setAttribute("aria-expanded", b.getAttribute("aria-expanded") === "true" ? "false" : "true");
});

// Add a Player: put a new row at the end of the chosen tier, with the Manager note under the name
document.addEventListener("DOMContentLoaded", () => {
  const f = document.getElementById("add-player");
  if (!f) return;
  f.addEventListener("submit", () => {
    const name = `${f.querySelector("#ap-first").value.trim()} ${f.querySelector("#ap-last").value.trim()}`.trim();
    const tier = f.querySelector("#ap-tier").selectedIndex;
    const tb = document.querySelectorAll("table.bank tbody")[tier];
    if (!name || !tb || !tb.rows[0]) return;
    const tr = tb.rows[0].cloneNode(true);
    const no = f.querySelector("#ap-no").value.trim();
    const note = f.querySelector("#ap-note").value.trim();
    tr.querySelector("td.name a").textContent = name;
    tr.querySelector(".av").textContent = no || name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    tr.querySelector(".rank").textContent = tb.rows.length + 1;
    const ni = tr.querySelector(".no-in"); if (ni) ni.value = no;
    tr.querySelectorAll("td.muted").forEach((td) => { td.textContent = "–"; });
    const bal = tr.querySelector(".bal"); if (bal) { bal.textContent = "$0.00"; bal.className = "n bal zero"; }
    tr.querySelector(".pnote")?.remove();
    if (note) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "pnote"; b.title = "Manager note";
      b.setAttribute("aria-expanded", "false"); b.textContent = note;
      tr.querySelector("td.name").append(b);
    }
    tb.append(tr);
    const h = tb.closest("section").querySelector("h2 small"); if (h) h.textContent = `(${tb.rows.length})`;
    tr.classList.add("flash");
    tr.scrollIntoView({ block: "center" });
    f.reset();
  });
});

// Season settings: "Lock the fee" makes the fee final; "Unlock the fee" undoes it in the mockup
document.addEventListener("DOMContentLoaded", () => {
  const b = document.querySelector("[data-lock]");
  if (!b) return;
  const card = b.closest(".settings"), tag = document.getElementById("lock-tag");
  b.addEventListener("click", () => {
    const on = !card.classList.contains("locked");
    card.classList.toggle("locked", on);
    card.querySelectorAll("input").forEach((i) => { i.disabled = on; });
    tag.textContent = on ? "Fee locked Nov 17" : "Fee not locked";
    tag.classList.toggle("locked", on);
    b.textContent = on ? "Unlock the fee" : "Lock the fee";
    b.className = on ? "ghost" : "button";
  });
});
