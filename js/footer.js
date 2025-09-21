// js/footer.js
// Inserta el footer estándar en el div con id="footer"
document.addEventListener('DOMContentLoaded', function () {
  var footerHTML = `
    <footer class=\"site-footer mt-auto\">
        <div class=\"container py-4\">
            <div class=\"row gy-4\">
                <div class=\"col-12 col-md-3\">
                    <a class=\"navbar-brand mb-2 d-inline-flex align-items-center\" href=\"index.html\">
                        <img src=\"/img/logos/logo_titulo.png\" alt=\"Pastelería Mil Sabores\" height=\"44\">
                    </a>
                    <div>
                        <div class=\"d-flex align-items-center gap-2\">
                            <span>Síguenos en:</span>
                            <div class=\"d-flex gap-3 social-icons\">
                                <a href=\"#\" aria-label=\"WhatsApp\"><i class=\"bi bi-whatsapp\"></i></a>
                                <a href=\"#\" aria-label=\"Instagram\"><i class=\"bi bi-instagram\"></i></a>
                                <a href=\"#\" aria-label=\"Facebook\"><i class=\"bi bi-facebook\"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class=\"col-6 col-md-2\">
                    <div class=\"footer-col-title\">Pastelería</div>
                    <ul class=\"list-unstyled footer-links\">
                        <li><a href=\"nosotros.html\">Nosotros</a></li>
                        <li><a href=\"blogs.html\">Blog</a></li>
                        <li><a href=\"productos.html?filtro=todosBtn\">Catálogo</a></li>
                        <li><a href=\"blogs.html#recetas\">Recetas</a></li>
                    </ul>
                </div>
                <div class=\"col-6 col-md-2\">
                    <div class=\"footer-col-title\">Ayuda</div>
                    <ul class=\"list-unstyled footer-links\">
                        <li><a href=\"contacto.html\">Contacto</a></li>
                        <li><a href=\"pedidos.html\">Mis pedidos</a></li>
                        <li><a href=\"#\" title=\"Próximamente\">Preguntas frecuentes</a></li>
                    </ul>
                </div>
                <div class=\"col-6 col-md-2\">
                    <div class=\"footer-col-title\">Menú</div>
                    <ul class=\"list-unstyled footer-links\">
                        <li><a href=\"productos.html?filtro=tortasCuadradasBtn\">Tortas Cuadradas</a></li>
                        <li><a href=\"productos.html?filtro=tortasCircularesBtn\">Tortas Circulares</a></li>
                        <li><a href=\"productos.html?filtro=postresIndividualesBtn\">Postres Individuales</a></li>
                        <li><a href=\"productos.html?filtro=sinAzucarBtn\">Sin Azúcar</a></li>
                        <li><a href=\"productos.html?filtro=sinGlutenBtn\">Sin Gluten</a></li>
                    </ul>
                </div>
                <div class=\"col-6 col-md-3\">
                    <div class=\"footer-col-title\">Legal</div>
                    <ul class=\"list-unstyled footer-links\">
                        <li><a href=\"/pages/legal/terminos_y_condiciones.html\">Términos y Condiciones</a></li>
                        <li><a href=\"/pages/legal/politica_de_privacidad.html\">Política de Privacidad</a></li>
                    </ul>
                </div>
            </div>
            <hr class=\"my-4\">
            <div class=\"d-flex flex-column flex-md-row justify-content-between small text-secondary\">
                <div>© <span id=\"year\"></span> Pastelería Mil Sabores. Todos los derechos reservados.</div>
                <div class=\"d-flex gap-3\">
                    <a href=\"#\" class=\"text-decoration-none text-secondary\">Términos</a>
                    <a href=\"#\" class=\"text-decoration-none text-secondary\">Privacidad</a>
                </div>
            </div>
        </div>
    </footer>
  `;
  var footerDiv = document.getElementById('footer');
  if (footerDiv) {
    footerDiv.innerHTML = footerHTML;
    var yEl = document.getElementById('year');
    if (yEl) yEl.textContent = new Date().getFullYear();
  }
});
