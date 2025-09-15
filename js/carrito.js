(function () {
    const KEY_CART = "carrito";
    const j = (x) => JSON.parse(x || "null");
    const $ = (s, r = document) => r.querySelector(s);

    const getCart = () => j(localStorage.getItem(KEY_CART)) || [];
    const setCart = (cart) => localStorage.setItem(KEY_CART, JSON.stringify(cart));

    // ===== Render Carrito
    function renderCarrito() {
        const carrito = getCart();
        const contenedor = $("#carrito-lista");
        const totalEl = $("#carrito-total");
        const subtotalEl = $("#carrito-subtotal");
        const emptyMessageEl = $("#empty-cart-message");
        const emptyCartBtn = $("#empty-cart-btn");
        const btnProceedToPayment = $("#proceed-to-payment");
        const resumenEl = $("#pedido-detalles"); // Contenedor del resumen

        // Obtener los beneficios del usuario
        const user = leerSesion();  // Leer la sesión para obtener los beneficios
        const descuento = user ? user.beneficios.descuento : 0;  // Obtener el descuento, si tiene

        if (carrito.length === 0) {
            // Si el carrito está vacío, mostrar el mensaje y el botón para redirigir
            if (emptyMessageEl) {
                emptyMessageEl.style.display = "block"; // Mostrar mensaje
                emptyMessageEl.textContent = "No tienes artículos en tu carrito.";
            }

            if (emptyCartBtn) {
                emptyCartBtn.style.display = "block"; // Mostrar el botón
            }

            // Limpiar el contenedor de la lista de productos
            if (contenedor) contenedor.innerHTML = ""; // Limpiar la lista de productos

            // Mostrar un mensaje en lugar de total si el carrito está vacío
            if (totalEl) {
                totalEl.innerHTML = "<strong>El carrito está vacío</strong>";
            }

            // Limpiar el desglose cuando el carrito está vacío
            if (subtotalEl) {
                subtotalEl.innerHTML = "";
            }

            // Ocultar la card de resumen si el carrito está vacío
            if (resumenEl && resumenEl.closest('.card')) {
                resumenEl.closest('.card').style.display = 'none';
            }

            // Ocultar el contador cuando el carrito está vacío
            updateCartCount();

            return; // Salir de la función para no intentar renderizar los productos
        }

    // Limpiar el contenedor
    if (contenedor) contenedor.innerHTML = "";
        let total = 0;

        // Renderizar productos en el carrito
        carrito.forEach((item, i) => {
            // Validar precio
            let price = (typeof item.price === 'number' && !isNaN(item.price) && item.price >= 0) ? item.price : 0;
            const subtotal = price * item.cantidad;
            total += subtotal;
            if (contenedor) {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                // Validar cantidad para el input
                let cantidadInput = (typeof item.cantidad === 'number' && !isNaN(item.cantidad) && item.cantidad > 0) ? item.cantidad : 1;
                // Mostrar advertencia si el precio es inválido
                let priceHtml = price > 0 ? `$${price.toLocaleString('es-CL')}` : `<span class='text-danger'>Precio inválido</span>`;
                li.innerHTML = `

                        <div class=\"d-flex align-items-center\" style=\"flex-grow: 1;\">
                                <img src=\"${item.img}\" alt=\"${item.productName}\" class=\"product-img img-fluid rounded-3\">
                                <span class=\"ms-3 text-truncate\" style=\"flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">
                                    ${item.productName}
                                    ${item.mensaje ? `<div class='small text-info mt-1'>Mensaje: <b>${item.mensaje}</b></div>` : ""}
                                    <div class='small'>${priceHtml}</div>
                                </span>
                        </div>

            <!-- Incrementador de cantidad y botón de eliminar alineados a la derecha -->
            <div class=\"d-flex align-items-center ms-auto\">
                <button class=\"btn btn-sm btn-outline-secondary me-2 btn-decrease\" data-index=\"${i}\">-</button>
                <input type=\"number\" class=\"form-control form-control-sm text-center cart-qty\" data-index=\"${i}\" value=\"${cantidadInput}\" min=\"1\" style=\"width:60px\">
                <button class=\"btn btn-sm btn-outline-secondary ms-2 btn-increase\" data-index=\"${i}\">+</button>

                <!-- Botón eliminar -->
                <button class=\"btn btn-sm btn-danger ms-2\" data-remove=\"${i}\">
                    <i class=\"bi bi-trash\"></i>
                </button>
            </div>
        `;
                contenedor.appendChild(li);
            }
        });

        // Calcular despacho (por ejemplo, $5000)
        const despacho = 5000;  // Ejemplo de costo de despacho. Puedes modificarlo según tus necesidades.

        // Mostrar resumen del pedido
        renderResumenPedido(carrito, total, descuento, despacho);

        // Llamar a la función para manejar eventos del carrito
        bindCartEvents();
    }

    // ===== Mostrar resumen del pedido =====
    function renderResumenPedido(carrito, total, descuento, despacho) {
    const resumenEl = $("#pedido-detalles");
    if (!resumenEl) return;
    // Limpiar el contenedor del resumen
    resumenEl.innerHTML = "";

        // Calcular el total con descuento
        const totalConDescuento = total * (1 - descuento / 100);

        // Generar el HTML para el resumen del pedido
        let resumenHTML = `
        <h2 class="mb-4">Resumen del Pedido</h2>
        <div class="d-flex justify-content-between mb-2">
            <span class="text-secondary">Subtotal</span>
            <span>$${total.toLocaleString("es-CL")}</span>
        </div>
        <div class="d-flex justify-content-between mb-3">
            <span class="text-secondary">Despacho</span>
            <span>$${despacho.toLocaleString("es-CL")}</span>
        </div>
    `;

        // Mostrar el descuento solo si existe
        if (descuento > 0) {
            resumenHTML += `
        <div class="d-flex justify-content-between mb-3">
            <span class="text-secondary">Descuento (${descuento}%)</span>
            <span>-$${(total * descuento / 100).toLocaleString("es-CL")}</span>
        </div>
        `;
        }

        // Mostrar total después de aplicar el descuento
        resumenHTML += `
        <div class="d-flex justify-content-between fw-bold fs-5 mb-4">
            <span>Total</span>
            <span>$${(totalConDescuento + despacho).toLocaleString("es-CL")}</span>
        </div>
        <button id="proceed-to-payment" class="btn btn-primary w-100"><i class="bi bi-credit-card"></i> Proceder al pago</button>
        <button id="btnVaciar" class="btn btn-danger w-100 mt-2"><i class="bi bi-trash"></i> Vaciar carrito</button>
    `;

        // Asignar el resumen al contenedor
        resumenEl.innerHTML = resumenHTML;
    }

    // ===== Actualizar contador en el icono
    function updateCartCount() {
        const carrito = getCart();
        const badge = $("#cart-count");
        if (!badge) return;

        const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.remove("d-none");
        } else {
            // Mostrar la card de resumen si hay productos (solo si existe el elemento)
            const resumenEl = $("#pedido-detalles");
            if (resumenEl && resumenEl.closest('.card')) {
                resumenEl.closest('.card').style.display = '';
            }
            badge.classList.add("d-none");
        }
    }

    // ===== Mostrar toast
    function showToast(msg, type = "success") {
        const toastMsg = $("#cart-toast-msg");
        const toastEl = $("#cart-toast");
        if (!toastEl) return;

        toastMsg.textContent = msg;
        toastEl.classList.remove("text-bg-success", "text-bg-danger");
        toastEl.classList.add(type === "error" ? "text-bg-danger" : "text-bg-success");

        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }

    // ===== Mostrar modal de confirmación
    function showConfirm(msg, callback) {
        const modalEl = $("#confirmModal");
        const modalMsg = $("#confirmModalMsg");
        const btnOk = $("#confirmModalOk");

        if (!modalEl || !modalMsg || !btnOk) return;

        modalMsg.textContent = msg;

        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();

        // limpiar eventos previos para no duplicar
        btnOk.replaceWith(btnOk.cloneNode(true));
        const newBtnOk = $("#confirmModalOk");

        newBtnOk.addEventListener("click", () => {
            bsModal.hide();
            callback();
        });
    }

    // ===== Agregar al carrito (usado desde productos.js)

    function addToCarrito(producto) {
        const carrito = getCart();
        const existe = carrito.find((p) => p.code === producto.code);

        // --- Validación y normalización del precio ---
        let price = producto.price;
        if (typeof price === 'undefined' && typeof producto.precio !== 'undefined') {
            price = producto.precio;
        }
        price = Number(price);
        if (isNaN(price) || price <= 0) {
            showToast('❌ Error: El producto no tiene un precio válido', 'error');
            return;
        }

        if (existe) {
            existe.cantidad += 1;
        } else {
            carrito.push({ ...producto, price, cantidad: 1 });
        }

        setCart(carrito);
        renderCarrito();
        showToast(`✅ ${producto.productName} agregado al carrito`);
    }

    // Exponer global
    window.addToCarrito = addToCarrito;
    window.updateCartCount = updateCartCount;

    // ===== Eventos de cantidades y eliminación
    function bindCartEvents() {
        // Cambiar cantidad manualmente
        document.querySelectorAll(".cart-qty").forEach((input) => {
            input.addEventListener("change", (e) => {
                const index = e.target.dataset.index;
                let carrito = getCart();
                let qty = parseInt(e.target.value, 10);

                if (isNaN(qty) || qty < 1) qty = 1;

                carrito[index].cantidad = qty;
                setCart(carrito);
                renderCarrito();
            });
        });

        // Botón aumentar
        document.querySelectorAll(".btn-increase").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = e.currentTarget.dataset.index;
                let carrito = getCart();
                carrito[index].cantidad += 1;
                setCart(carrito);
                renderCarrito();
            });
        });

        // Botón disminuir
        document.querySelectorAll(".btn-decrease").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = e.currentTarget.dataset.index;
                let carrito = getCart();

                if (carrito[index].cantidad === 1) {
                    showConfirm(
                        `¿Seguro que quieres eliminar "${carrito[index].productName}" del carrito?`,
                        () => {
                            carrito.splice(index, 1);
                            setCart(carrito);
                            renderCarrito();
                            showToast("❌ Producto eliminado del carrito", "error");
                        }
                    );
                } else {
                    carrito[index].cantidad -= 1;
                    setCart(carrito);
                    renderCarrito();
                }
            });
        });

        // Botón eliminar directo
        document.querySelectorAll("[data-remove]").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = e.currentTarget.dataset.remove;
                let carrito = getCart();

                showConfirm(
                    `¿Seguro que quieres eliminar "${carrito[index].productName}" del carrito?`,
                    () => {
                        carrito.splice(index, 1);
                        setCart(carrito);
                        renderCarrito();
                        showToast("❌ Producto eliminado del carrito", "error");
                    }
                );
            });
        });

        // Botón vaciar carrito
        const btnClear = $("#btnVaciar");
        if (btnClear) {
            btnClear.addEventListener("click", () => {
                showConfirm("⚠️ ¿Estás seguro que quieres vaciar todo el carrito?", () => {
                    localStorage.removeItem(KEY_CART);
                    renderCarrito();
                    showToast("🗑️ Carrito vaciado", "error");
                    // Mostrar mensaje y botón para redirigir a productos.html
                    $("#empty-cart-message").style.display = "block"; // Mostrar mensaje
                    $("#empty-cart-btn").style.display = "block"; // Mostrar botón
                });
            });
        }

        // Botón para redirigir a productos.html
        const redirectBtn = $("#empty-cart-btn");
        if (redirectBtn) {
            redirectBtn.addEventListener("click", () => {
                window.location.href = "productos.html"; // Redirigir a productos.html
            });
        }

        // Botón proceder al pago
        const btnProceed = $("#proceed-to-payment");
        if (btnProceed) {
            btnProceed.addEventListener("click", (e) => {
                const carrito = getCart();
                if (carrito.length === 0) {
                    e.preventDefault();  // Evitar que se redirija a checkout.html
                    // Mostrar modal indicando que no hay productos
                    const emptyCartModal = new bootstrap.Modal(document.getElementById('emptyCartModal'));
                    emptyCartModal.show();
                } else {
                    window.location.href = "checkout.html";
                }
            });
        }
    }

    // ===== Inicializar
    document.addEventListener("DOMContentLoaded", () => {
        renderCarrito();
    });
})();
