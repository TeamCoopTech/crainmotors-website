(function () {
  "use strict";

  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.pushState) {
        history.pushState(null, "", id);
      }
    });
  });
})();

/* Open now / closed badge from the published hours (Mon-Sat 9 AM to 6 PM, Sunday closed, America/New_York).
   Holidays are not known, so the text never promises a specific holiday schedule. */
(function () {
  "use strict";
  var el = document.getElementById("open-status");
  var txt = document.getElementById("open-text");
  if (!el || !txt || !window.Intl) return;
  try {
    var parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    var get = function (t) { for (var i = 0; i < parts.length; i++) { if (parts[i].type === t) return parts[i].value; } return ""; };
    var day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get("weekday")];
    var mins = (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10);
    var workday = day >= 1 && day <= 6;
    var open = workday && mins >= 540 && mins < 1080;
    var msg;
    if (open) msg = "Open now until 6 PM";
    else if (workday && mins < 540) msg = "Closed now, opens today at 9 AM";
    else if (day === 6 || day === 0) msg = "Closed now, opens Monday at 9 AM";
    else msg = "Closed now, opens tomorrow at 9 AM";
    txt.textContent = msg;
    el.classList.add(open ? "is-open" : "is-closed");
    var row = document.querySelector('#hours-table tr[data-day="' + day + '"]');
    if (row) row.classList.add("is-today");
  } catch (e) { /* keep the static hours text */ }
})();
