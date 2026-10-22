/* Manual do Gabinete — eproc. JavaScript puro, sem dependências. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KEY = "manual-eproc:feito:v1", KEY_FOCO = "manual-eproc:foco:v1";

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento: segue sem salvar */ } }

  var feito;
  try { feito = new Set(JSON.parse(lsGet(KEY) || "[]")); } catch (e) { feito = new Set(); }
  function salvar() { lsSet(KEY, JSON.stringify(Array.from(feito))); }

  /* ---------- rodapé de cada passo: pontos, "Feito" e próximo ---------- */
  $$(".grupo").forEach(function (g) {
    var ps = $$(".passo", g);
    ps.forEach(function (p, i) {
      if (feito.has(p.id)) p.classList.add("feito");
      var foot = document.createElement("div");
      foot.className = "passo-foot";

      var dots = document.createElement("span");
      dots.className = "dots";
      dots.setAttribute("role", "img");
      dots.setAttribute("aria-label", "Passo " + (i + 1) + " de " + ps.length);
      ps.forEach(function (_, k) { var d = document.createElement("i"); if (k === i) d.className = "on"; dots.appendChild(d); });

      var lab = document.createElement("label");
      lab.className = "done-toggle";
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = feito.has(p.id);
      cb.addEventListener("change", function () {
        if (cb.checked) feito.add(p.id); else feito.delete(p.id);
        p.classList.toggle("feito", cb.checked);
        salvar(); atualizarProgresso();
      });
      lab.appendChild(cb); lab.appendChild(document.createTextNode("Feito"));

      var left = document.createElement("span");
      left.style.cssText = "display:inline-flex;align-items:center;gap:18px;flex-wrap:wrap";
      left.appendChild(dots); left.appendChild(lab);
      foot.appendChild(left);

      var alvo = null, rot = null;
      if (i < ps.length - 1) { alvo = "#" + ps[i + 1].id; rot = "Próximo passo"; }
      else if (g.dataset.next) { alvo = g.dataset.next; rot = g.dataset.nextLabel || "Continuar"; }
      if (alvo) { var a = document.createElement("a"); a.className = "next"; a.href = alvo; a.textContent = rot; foot.appendChild(a); }
      p.appendChild(foot);
    });
  });

  /* ---------- progresso ---------- */
  function contar() {
    var total = 0, ok = 0, porEtapa = {};
    $$(".etapa").forEach(function (et) {
      var n = et.dataset.etapa, t = 0, d = 0;
      var alt = {}; // grupos alternativos (A ou B): conta só o maior
      $$(".grupo", et).forEach(function (g) {
        var ps = $$(".passo", g), dd = ps.filter(function (p) { return feito.has(p.id); }).length;
        if (g.dataset.grupo === "e2a" || g.dataset.grupo === "e2b") { alt[g.dataset.grupo] = { t: ps.length, d: dd }; }
        else { t += ps.length; d += dd; }
      });
      var ks = Object.keys(alt);
      if (ks.length) {
        // etapa concluída se o ramo A ou o ramo B estiver completo
        var melhor = ks.map(function (k) { return alt[k]; }).sort(function (x, y) { return (y.d / y.t) - (x.d / x.t) || y.t - x.t; })[0];
        t += melhor.t; d += melhor.d;
      }
      porEtapa[n] = { t: t, d: d }; total += t; ok += d;
    });
    return { total: total, ok: ok, porEtapa: porEtapa };
  }
  function atualizarProgresso() {
    var c = contar(), pct = c.total ? Math.round(100 * c.ok / c.total) : 0;
    $("#prog-txt").textContent = c.ok + " de " + c.total + " passos";
    $("#prog-bar").style.width = pct + "%";
    var m = $(".meter"); if (m) m.setAttribute("aria-valuenow", String(pct));
    $$(".timeline > li[data-etapa]").forEach(function (li) {
      var e = c.porEtapa[li.dataset.etapa];
      li.classList.toggle("completa", !!e && e.t > 0 && e.d >= e.t);
    });
  }
  atualizarProgresso();

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

    /* modo foco: o passo no centro da tela fica em evidência */
    var ioPasso = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle("em-foco", e.isIntersecting); });
    }, { rootMargin: "-38% 0px -38% 0px" });
    $$(".passo").forEach(function (p) { ioPasso.observe(p); });
  }

  /* ---------- modo foco ---------- */
  var focoBtn = $("#foco-btn");
  function setFoco(on) {
    document.body.classList.toggle("foco", on);
    focoBtn.setAttribute("aria-pressed", String(on));
    lsSet(KEY_FOCO, on ? "1" : "0");
  }
  focoBtn.addEventListener("click", function () { setFoco(!document.body.classList.contains("foco")); });
  if (lsGet(KEY_FOCO) === "1") setFoco(true);

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
