/* Manual do Gabinete — eproc. JavaScript puro, sem dependências. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- rodapé de cada passo: pontos e "próximo passo" ---------- */
  $$(".grupo").forEach(function (g) {
    var ps = $$(".passo", g);
    ps.forEach(function (p, i) {
      var foot = document.createElement("div");
      foot.className = "passo-foot";

      var dots = document.createElement("span");
      dots.className = "dots";
      dots.setAttribute("role", "img");
      dots.setAttribute("aria-label", "Passo " + (i + 1) + " de " + ps.length);
      ps.forEach(function (_, k) { var d = document.createElement("i"); if (k === i) d.className = "on"; dots.appendChild(d); });
      foot.appendChild(dots);

      var alvo = null, rot = null;
      if (i < ps.length - 1) { alvo = "#" + ps[i + 1].id; rot = "Próximo passo"; }
      else if (g.dataset.next) { alvo = g.dataset.next; rot = g.dataset.nextLabel || "Continuar"; }
      if (alvo) { var a = document.createElement("a"); a.className = "next"; a.href = alvo; a.textContent = rot; foot.appendChild(a); }
      p.appendChild(foot);
    });
  });

  /* ---------- destaque da seção atual (painel lateral e barra de etapas) ---------- */
  var secoes = $$("[data-spy]");
  function marcarAtivo(id) {
    $$(".timeline > li").forEach(function (li) {
      var a = $("a.tl", li);
      li.classList.toggle("ativo", !!a && a.dataset.alvo === id);
    });
    $$(".consulta a").forEach(function (a) { a.classList.toggle("ativo", a.dataset.alvo === id); });
    $$(".stepper-bar a").forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("ativo", on);
      if (on && a.scrollIntoView) { try { a.scrollIntoView({ block: "nearest", inline: "center" }); } catch (e) {} }
    });
  }
  if ("IntersectionObserver" in window) {
    var visiveis = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { visiveis[e.target.id] = e.isIntersecting; });
      for (var i = 0; i < secoes.length; i++) { if (visiveis[secoes[i].id]) { marcarAtivo(secoes[i].id); break; } }
    }, { rootMargin: "-30% 0px -60% 0px" });
    secoes.forEach(function (s) { io.observe(s); });
  }

  /* ---------- gaveta (celular) ---------- */
  var menuBtn = $("#menu-btn");
  function gaveta(on) { document.body.classList.toggle("drawer-open", on); menuBtn.setAttribute("aria-expanded", String(on)); }
  menuBtn.addEventListener("click", function () { gaveta(!document.body.classList.contains("drawer-open")); });
  $$("#lateral a").forEach(function (a) { a.addEventListener("click", function () { gaveta(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") gaveta(false); });
  document.addEventListener("click", function (e) { if (document.body.classList.contains("drawer-open") && !e.target.closest("#lateral, #menu-btn")) gaveta(false); });

  /* ---------- filtro da tabela da Secretaria ---------- */
  function norm(t) { return (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim(); }
  var filtro = $("#filtro-sec");
  if (filtro) {
    var linhas = $$("#tab-sec tbody tr"), cont = $("#filtro-sec-n");
    filtro.addEventListener("input", function () {
      var q = norm(filtro.value), n = 0;
      linhas.forEach(function (tr) { var ok = !q || norm(tr.textContent).indexOf(q) !== -1; tr.classList.toggle("oculta", !ok); if (ok) n++; });
      cont.textContent = q ? n + " de " + linhas.length : "";
    });
  }

  /* ---------- vídeo ausente: mostra o espaço reservado ---------- */
  $$(".clipe video source").forEach(function (src) {
    src.addEventListener("error", function () {
      var fr = src.closest(".clipe-frame"), fig = src.closest(".clipe");
      if (!fr) return;
      var id = fig.dataset.clipe || "";
      fr.innerHTML = '<div class="slot" role="img"><em>Não foi possível carregar · ' + id + '</em><span class="play" aria-hidden="true"></span><strong>Vídeo indisponível neste computador</strong><span>Confira se o MP4 está na pasta <code>videos/</code>, ao lado de <code>index.html</code>, e se o navegador reproduz vídeo MP4 (H.264).</span></div>';
    });
  });

  /* ---------- impressão ---------- */
  var abertos = [];
  window.addEventListener("beforeprint", function () {
    abertos = $$("details").filter(function (d) { return !d.open; });
    abertos.forEach(function (d) { d.open = true; });
  });
  window.addEventListener("afterprint", function () { abertos.forEach(function (d) { d.open = false; }); abertos = []; });
  $("#print-btn").addEventListener("click", function () { window.print(); });
})();
