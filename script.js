// ============================================================
// Quiz + finale + accordion. Nessuna dipendenza esterna.
// ============================================================
(function () {
  "use strict";

  // Domande: per modificarle basta cambiare questo elenco.
  var DOMANDE = [
    "Chi sono i più affidabili?",
    "Chi non si droga/fuma?",
    "Quindi, per chi voterai?"
  ];

  var RIGHT_DELAY = 1000;  // ms prima di passare avanti dopo "BRAVO"
  var WRONG_DELAY = 1100;  // ms prima di tornare alla stessa domanda

  var $ = function (id) { return document.getElementById(id); };

  var quiz = $("quiz");
  var questionEl = $("question");
  var feedbackEl = $("feedback");
  var btnYes = $("btnYes");
  var btnNo = $("btnNo");
  var dots = document.querySelectorAll("#progress .dot");
  var finale = $("finale");
  var accBtn = $("accBtn");
  var accPanel = $("accPanel");
  var list = $("motiviList");
  var confettiBox = $("confetti");

  var current = 0;
  var locked = false;
  var timer = null;

  // ---------- Elenco dei 100 motivi ----------
  (function buildList() {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < MOTIVI.length; i++) {
      var li = document.createElement("li");
      li.textContent = MOTIVI[i];
      frag.appendChild(li);
    }
    list.appendChild(frag);
  })();

  // ---------- Quiz ----------
  function showQuestion() {
    questionEl.textContent = DOMANDE[current];
    questionEl.classList.remove("pop");
    void questionEl.offsetWidth; // riavvia l'animazione
    questionEl.classList.add("pop");
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === current);
      dots[i].classList.toggle("done", i < current);
    }
    clearFeedback();
    setLocked(false);
  }

  function setLocked(v) {
    locked = v;
    btnYes.disabled = v;
    btnNo.disabled = v;
  }

  function clearFeedback() {
    feedbackEl.className = "feedback";
    feedbackEl.textContent = "";
  }

  function showFeedback(text, kind) {
    feedbackEl.textContent = text;
    feedbackEl.className = "feedback show " + kind;
  }

  function onRight() {
    if (locked) return;
    setLocked(true);
    showFeedback("BRAVO! 👑", "good");
    burst(22);
    timer = setTimeout(function () {
      current++;
      if (current >= DOMANDE.length) {
        showFinale();
      } else {
        showQuestion();
      }
    }, RIGHT_DELAY);
  }

  function onWrong() {
    if (locked) return;
    setLocked(true);
    showFeedback("RISPOSTA SBAGLIATA! ❌", "bad");
    quiz.classList.remove("shake-card");
    void quiz.offsetWidth;
    quiz.classList.add("shake-card");
    timer = setTimeout(function () {
      quiz.classList.remove("shake-card");
      showQuestion(); // stessa domanda, current non cambia
    }, WRONG_DELAY);
  }

  btnYes.addEventListener("click", onRight);
  btnNo.addEventListener("click", onWrong);

  // ---------- Finale ----------
  function showFinale() {
    quiz.hidden = true;
    finale.hidden = false;
    burst(70);
    setTimeout(function () { burst(40); }, 700);
    finale.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- Accordion ----------
  accBtn.addEventListener("click", function () {
    var open = accBtn.getAttribute("aria-expanded") === "true";
    accBtn.setAttribute("aria-expanded", open ? "false" : "true");
    accPanel.classList.toggle("open", !open);
  });

  // ---------- Confetti leggeri (max ~110 elementi, poi si rimuovono) ----------
  var COLORS = ["#c1121f", "#0a1a5c", "#ffffff", "#f6e7c1"];
  function burst(n) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (var i = 0; i < n; i++) {
      var el = document.createElement("i");
      var isStar = Math.random() < 0.3;
      if (isStar) {
        el.className = "star";
        el.textContent = "★";
        el.style.color = Math.random() < 0.5 ? "#c1121f" : "#0a1a5c";
      } else {
        el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
        el.style.border = "1px solid rgba(10,26,92,.35)";
      }
      el.style.left = Math.random() * 100 + "vw";
      var dur = 1.8 + Math.random() * 1.6;
      el.style.animationDuration = dur + "s";
      el.style.animationDelay = Math.random() * 0.4 + "s";
      confettiBox.appendChild(el);
      (function (node, d) {
        setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, (d + 0.6) * 1000);
      })(el, dur);
    }
  }

  // Avvio
  showQuestion();
})();
