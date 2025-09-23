

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    // Obtener catálogo actualizado si existe en localStorage
    let catalogo = [];
    try { catalogo = JSON.parse(localStorage.getItem("catalogo")) || []; } catch {}
    let producto = (catalogo.length ? catalogo : products).find(p => p.code === code);

    if (!producto) {
        document.getElementById("producto-detalle").innerHTML =
            `<p class="text-danger">Producto no encontrado</p>`;
        return;
    }

    // Título
    document.getElementById("titulo").textContent = producto.productName;

    // Badges DEBAJO del título
    const contBadges = document.getElementById("badgesDetalle");
    if (contBadges && typeof window.badgesHTML === "function") {
        contBadges.innerHTML = window.badgesHTML(producto);
    }

    // Resto del detalle
    const img = document.getElementById("imagen");
    img.src = producto.img;
    img.alt = producto.productName;

    document.getElementById("descripcion").textContent =
        producto.desc || "Producto artesanal, hecho con ingredientes frescos.";
    document.getElementById("precio").textContent =
        `$${producto.price.toLocaleString("es-CL")}`;

    // Mostrar casilla de mensaje solo para productos personalizables
    const personalizables = [
        "TC001", // Torta Cuadrada de Chocolate
        "TE001", // Torta Especial de Cumpleaños
        "TE002"  // Torta Especial de Boda
    ];
    if (personalizables.includes(producto.code)) {
        document.getElementById("mensajePersonalizadoContainer").style.display = "";
    } else {
        document.getElementById("mensajePersonalizadoContainer").style.display = "none";
    // Si NO es personalizable, hacer las 3 cards más bajas
    document.getElementById("detalle-layout").classList.add("detalle-bajo");
    }

    // Mostrar stock y lógica contador de cantidad
    const inputQty = document.getElementById("qty");
    const btnMenos = document.getElementById("menos");
    const btnMas = document.getElementById("mas");
    const stockSpan = document.getElementById("stockDetalle");
    let btnAddCart = document.getElementById("addCart");
    let stock = typeof producto.stock === "number" ? producto.stock : 0;
    if (stockSpan) {
        stockSpan.textContent = `Stock: ${stock}`;
        stockSpan.className = stock > 0 ? "badge bg-info text-dark ms-2" : "badge bg-danger text-light ms-2";
    }
    if (inputQty && btnMenos && btnMas) {
        btnMenos.addEventListener("click", () => {
            let val = parseInt(inputQty.value, 10) || 1;
            if (val > 1) inputQty.value = val - 1;
        });
        btnMas.addEventListener("click", () => {
            let val = parseInt(inputQty.value, 10) || 1;
            if (val < stock) inputQty.value = val + 1;
        });
        inputQty.addEventListener("input", () => {
            let val = parseInt(inputQty.value, 10);
            if (isNaN(val) || val < 1) inputQty.value = 1;
            if (val > stock) inputQty.value = stock;
        });
        // Deshabilitar input si no hay stock
        inputQty.disabled = stock === 0;
    }
    // Deshabilitar botón agregar al carrito si no hay stock
    if (btnAddCart) {
        btnAddCart.disabled = stock === 0;
        if (stock === 0) {
            btnAddCart.textContent = "Sin stock";
        }
    }

    // Lógica botón agregar al carrito
    // Solo usar la variable ya definida
    if (btnAddCart) {
        btnAddCart.addEventListener("click", async () => {
            const qtyInput = document.getElementById("qty");
            const qty = parseInt(qtyInput?.value || "1", 10);
            const esPersonalizable = personalizables.includes(producto.code);
            let mensajes = [];
            if (!esPersonalizable) {
                // Producto normal
                const prodCarrito = {
                    code: producto.code,
                    productName: producto.productName,
                    price: Number(producto.price),
                    img: producto.img,
                    cantidad: qty,
                    mensaje: ""
                };
                let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
                let found = false;
                for (let item of carrito) {
                    if (item.code === prodCarrito.code && (item.mensaje || "") === "") {
                        item.cantidad += prodCarrito.cantidad;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    carrito.push(prodCarrito);
                }
                localStorage.setItem("carrito", JSON.stringify(carrito));
                if (window.updateCartCount) window.updateCartCount();
                btnAddCart.textContent = "¡Agregado!";
                setTimeout(() => { btnAddCart.textContent = "Agregar al Carro"; }, 1200);
                return;
            }
            // Producto personalizable: input directo si qty=1, modal si qty>1
            if (qty === 1 && document.getElementById("mensajePersonalizadoContainer").style.display !== "none") {
                mensajes.push(document.getElementById("mensajePersonalizado").value.trim());
            } else {
                // Modal por cada unidad
                let modal = document.getElementById('modalMensajeDetalle');
                if (!modal) {
                    const modalHtml = `
                    <div class="modal fade" id="modalMensajeDetalle" tabindex="-1" aria-labelledby="modalMensajeDetalleLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="modalMensajeDetalleLabel">Mensaje personalizado para la torta <span class='text-secondary small'>(opcional)</span></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                          </div>
                          <div class="modal-body">
                            <input type="text" class="form-control" id="inputMensajeDetalle" maxlength="60" placeholder="Ej: ¡Feliz Cumpleaños, Ana! (opcional)">
                            <div class="form-text">Puedes dejar este campo vacío si no deseas agregar un mensaje.</div>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="btnCancelarMensajeDetalle" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="btnConfirmarMensajeDetalle">Agregar esta torta</button>
                          </div>
                        </div>
                      </div>
                    </div>`;
                    document.body.insertAdjacentHTML('beforeend', modalHtml);
                    modal = document.getElementById('modalMensajeDetalle');
                }
                const inputMensaje = document.getElementById('inputMensajeDetalle');
                const btnConfirmar = document.getElementById('btnConfirmarMensajeDetalle');
                const btnCancelar = document.getElementById('btnCancelarMensajeDetalle');
                function getMensaje() {
                    return new Promise((resolve, reject) => {
                        inputMensaje.value = "";
                        let cerrado = false;
                        const bsModal = new bootstrap.Modal(modal);
                        btnConfirmar.onclick = null;
                        btnCancelar.onclick = null;
                        btnConfirmar.onclick = function() {
                            cerrado = true;
                            resolve(inputMensaje.value.trim());
                            bsModal.hide();
                        };
                        btnCancelar.onclick = function() {
                            cerrado = true;
                            reject('cancel');
                            bsModal.hide();
                        };
                        function onHidden() {
                            modal.removeEventListener('hidden.bs.modal', onHidden);
                            if (!cerrado) reject('cancel');
                        }
                        modal.addEventListener('hidden.bs.modal', onHidden);
                        setTimeout(() => bsModal.show(), 100);
                    });
                }
                for (let i = 0; i < qty; i++) {
                    try {
                        const mensaje = await getMensaje();
                        mensajes.push(mensaje);
                        await new Promise(res => {
                            modal.addEventListener('hidden.bs.modal', function handler() {
                                modal.removeEventListener('hidden.bs.modal', handler);
                                res();
                            });
                        });
                    } catch {
                        return;
                    }
                }
            }
            // Agregar cada torta como ítem separado
            let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
            for (let mensaje of mensajes) {
                const prodCarrito = {
                    code: producto.code,
                    productName: producto.productName,
                    price: Number(producto.price),
                    img: producto.img,
                    cantidad: 1,
                    mensaje: mensaje
                };
                let found = false;
                for (let item of carrito) {
                    if (item.code === prodCarrito.code && (item.mensaje || "") === (prodCarrito.mensaje || "")) {
                        item.cantidad += 1;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    carrito.push(prodCarrito);
                }
            }
            localStorage.setItem("carrito", JSON.stringify(carrito));
            if (window.updateCartCount) window.updateCartCount();
            btnAddCart.textContent = "¡Agregado!";
            setTimeout(() => { btnAddCart.textContent = "Agregar al Carro"; }, 1200);
            // Restablecer el contador a 1 después de agregar
            if (qtyInput) qtyInput.value = 1;
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // FUENTE: usa products si existe; si no, lee localStorage.catalogo
    let fuente = (Array.isArray(window.products) && window.products.length)
        ? window.products
        : JSON.parse(localStorage.getItem("catalogo") || "[]");

    const producto = (fuente || []).find(p => p.code === code);

    // Productos relacionados aleatorios
    const relatedContainer = document.getElementById("related-products");
    if (relatedContainer && Array.isArray(fuente)) {
        // Filtrar el producto actual
        const otros = fuente.filter(p => p.code !== code);
        // Mezclar aleatoriamente
        for (let i = otros.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [otros[i], otros[j]] = [otros[j], otros[i]];
        }
        // Tomar hasta 4 productos
        const sugeridos = otros.slice(0, 4);
        relatedContainer.innerHTML = sugeridos.map(prod => `
            <div class="col">
                <div class="card-products text-start" tabindex="0" role="link" style="cursor: pointer;">
                    <img src="${prod.img}" alt="${prod.productName}">
                    <h3 class="mb-1">${prod.productName}</h3>
                    <p class="code text-muted mb-1">Código: ${prod.code}</p>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="price fw-semibold">$${prod.price.toLocaleString('es-CL')}</span>
                        <div class="badges-inline d-flex gap-1 flex-wrap justify-content-end px-3">
                            ${typeof window.badgesHTML === 'function' ? window.badgesHTML(prod) : ''}
                        </div>
                    </div>
                    <button data-code="${prod.code}" class="btn btn-outline-secondary btn-sm">
                        <i class="bi bi-eye"></i> Ver detalle
                    </button>
                </div>
            </div>
        `).join('');

        // Agregar funcionalidad de click a la card y botón para ver detalle
        relatedContainer.querySelectorAll('.card-products').forEach(card => {
            card.addEventListener('click', function(e) {
                if (e.target.closest('button')) return;
                const code = this.querySelector('button[data-code]').getAttribute('data-code');
                window.location.href = `detalle.html?code=${encodeURIComponent(code)}`;
            });
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const code = this.querySelector('button[data-code]').getAttribute('data-code');
                    window.location.href = `detalle.html?code=${encodeURIComponent(code)}`;
                }
            });
            const btn = card.querySelector('button[data-code]');
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const code = btn.getAttribute('data-code');
                window.location.href = `detalle.html?code=${encodeURIComponent(code)}`;
            });
        });
    }
});

