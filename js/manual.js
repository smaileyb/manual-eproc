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

  /* ---------- destaque da seção atual: estação do trilho e barra de etapas ---------- */
  var secoes = $$("[data-spy]");
  var trilho = $(".timeline"), estacoes = $$(".timeline > li"), idAtual = null;
  function centro(el) { var r = el.getBoundingClientRect(); return r.top + r.height / 2; }
  // o trilho vai da primeira à última estação; o trecho percorrido, até a estação atual
  function medirTrilho() {
    var topo = trilho.getBoundingClientRect().top;
    var nums = estacoes.map(function (li) { return $(".tl-num", li); });
    var ini = centro(nums[0]) - topo, fim = centro(nums[nums.length - 1]) - topo;
    var i = estacoes.findIndex(function (li) { return li.classList.contains("ativo"); });
    var ate = i < 0 ? (idAtual ? fim : ini) : centro(nums[i]) - topo;
    trilho.style.setProperty("--rail-top", ini + "px");
    trilho.style.setProperty("--rail-h", (fim - ini) + "px");
    trilho.style.setProperty("--rail-fill", (ate - ini) + "px");
    var etapa = i < 0 ? "0" : estacoes[i].dataset.etapa;
    trilho.style.setProperty("--rail-c", etapa === "0" ? "var(--petrol)" : "var(--s" + etapa + ")");
  }
  function marcarAtivo(id) {
    idAtual = id;
    var i = estacoes.findIndex(function (li) { var a = $("a.tl", li); return !!a && a.dataset.alvo === id; });
    estacoes.forEach(function (li, k) { li.classList.toggle("ativo", k === i); li.classList.toggle("passou", i >= 0 && k < i); });
    $$(".consulta a").forEach(function (a) { a.classList.toggle("ativo", a.dataset.alvo === id); });
    var barra = $$(".stepper-bar a"), j = barra.findIndex(function (a) { return a.getAttribute("href") === "#" + id; });
    barra.forEach(function (a, k) { a.classList.toggle("ativo", k === j); a.classList.toggle("passou", j >= 0 && k < j); });
    medirTrilho();
  }
  window.addEventListener("resize", medirTrilho);
  medirTrilho();
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

  /* ---------- tema claro/escuro: segue o sistema até a pessoa escolher ---------- */
  var KEY_TEMA = "manual-eproc:tema";
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento: vale só nesta visita */ } }
  var raiz = document.documentElement, temaBtn = $("#tema-btn"), corTema = $('meta[name="theme-color"]');
  var sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)");
  var reduzMov = window.matchMedia("(prefers-reduced-motion: reduce)");
  function temaAtual() { return raiz.dataset.theme || (sistemaEscuro.matches ? "dark" : "light"); }
  function mostrarTema() {
    var escuro = temaAtual() === "dark";
    $(".lbl", temaBtn).textContent = escuro ? "Tema claro" : "Tema escuro";
    temaBtn.title = escuro ? "Mudar para o tema claro" : "Mudar para o tema escuro";
    corTema.content = getComputedStyle(raiz).getPropertyValue("--paper").trim();
  }
  function aplicarTema(t, x, y) {
    function trocar() { raiz.dataset.theme = t; lsSet(KEY_TEMA, t); mostrarTema(); }
    if (!document.startViewTransition || reduzMov.matches) { trocar(); return; }
    // o novo tema se abre em círculo a partir do botão
    raiz.style.setProperty("--vt-x", x + "px");
    raiz.style.setProperty("--vt-y", y + "px");
    document.startViewTransition(trocar);
  }
  temaBtn.addEventListener("click", function () {
    var r = temaBtn.getBoundingClientRect();
    aplicarTema(temaAtual() === "dark" ? "light" : "dark", r.left + r.width / 2, r.top + r.height / 2);
  });
  sistemaEscuro.addEventListener("change", function () { if (!raiz.dataset.theme) mostrarTema(); });
  mostrarTema();

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

  /* ---------- vídeo ausente: avisa em vez de mostrar um quadro vazio ---------- */
  $$(".clipe video source").forEach(function (src) {
    src.addEventListener("error", function () {
      var fr = src.closest(".clipe-frame");
      if (!fr) return;
      fr.innerHTML = '<div class="slot" role="img"><em>Vídeo não carregou</em><span class="play" aria-hidden="true"></span><strong>Vídeo indisponível neste computador</strong><span>Confira se o MP4 está na pasta <code>videos/</code>, ao lado de <code>index.html</code>, e se o navegador reproduz vídeo MP4 (H.264).</span></div>';
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
