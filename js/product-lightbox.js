/**
 * product-lightbox.js
 * Lightbox para imágenes de producto (.prod-card-img).
 * Incluir con: <script src="js/product-lightbox.js"></script>
 * Compatible con todas las páginas de categoría de Virexa Exports.
 */
(function () {
  "use strict";

  /* ── Estilos ── */
  var style = document.createElement("style");
  style.textContent = [
    ".prod-card-img { cursor: zoom-in; }",
    ".prod-card-img img { transition: opacity .2s; }",
    ".prod-card-img:hover img { opacity: .88; }",
    "#plb-overlay { display:none; position:fixed; inset:0; z-index:9999;",
    "  background:rgba(0,0,0,.88); align-items:center; justify-content:center;",
    "  cursor:zoom-out; }",
    "#plb-overlay.plb-open { display:flex; }",
    "#plb-img { max-width:92vw; max-height:90vh; object-fit:contain;",
    "  border-radius:6px; box-shadow:0 8px 40px rgba(0,0,0,.6); cursor:default; }",
    "#plb-close { position:absolute; top:1rem; right:1.2rem;",
    "  background:none; border:none; color:#fff; font-size:2rem;",
    "  cursor:pointer; line-height:1; padding:.2rem .5rem; }",
  ].join("\n");
  document.head.appendChild(style);

  /* ── Markup ── */
  var overlay = document.createElement("div");
  overlay.id = "plb-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Vista ampliada");

  var closeBtn = document.createElement("button");
  closeBtn.id = "plb-close";
  closeBtn.setAttribute("aria-label", "Cerrar");
  closeBtn.innerHTML = "&#x2715;";

  var img = document.createElement("img");
  img.id = "plb-img";
  img.src = "";
  img.alt = "";

  overlay.appendChild(closeBtn);
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  /* ── Lógica ── */
  function openLb(src, alt) {
    img.src = src;
    img.alt = alt || "";
    overlay.classList.add("plb-open");
    document.body.style.overflow = "hidden";
  }

  function closeLb() {
    overlay.classList.remove("plb-open");
    img.src = "";
    document.body.style.overflow = "";
  }

  // Clic en cualquier imagen de producto (presentes en el DOM al cargar)
  [].forEach.call(document.querySelectorAll(".prod-card-img"), function (wrap) {
    wrap.addEventListener("click", function () {
      var i = wrap.querySelector("img");
      // currentSrc = URL que el navegador realmente cargó (WebP si <picture> lo eligió)
      // fallback a src por si la imagen aún no se ha cargado (lazy)
      if (i) openLb(i.currentSrc || i.src, i.alt);
    });
  });

  // Cerrar con botón X
  closeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    closeLb();
  });

  // Cerrar clicando el fondo
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeLb();
  });

  // Cerrar con Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLb();
  });
})();
