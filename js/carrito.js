/* ============================
   carrito.js — Manejo del Carrito con modal de confirmación
   ============================ */
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

        if (contenedor) {
            contenedor.innerHTML = "";
            let total = 0;

            carrito.forEach((item, i) => {
                const subtotal = item.price * item.cantidad;
                total += subtotal;

                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `
          <div>
            <strong>${item.productName}</strong><br>
            <div class="d-flex align-items-center mt-1">
              <button class="btn btn-sm btn-outline-secondary me-2 btn-decrease" data-index="${i}">-</button>
              <input type="number" class="form-control form-control-sm text-center cart-qty" data-index="${i}" value="${item.cantidad}" min="1" style="width:60px">
              <button class="btn btn-sm btn-outline-secondary ms-2 btn-increase" data-index="${i}">+</button>
            </div>
          </div>
          <div>
            <span>$${subtotal.toLocaleString("es-CL")}</span>
            <button class="btn btn-sm btn-danger ms-2" data-remove="${i}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `;
                contenedor.appendChild(li);
            });

            if (totalEl) totalEl.textContent = `$${total.toLocaleString("es-CL")}`;
            bindCartEvents();
        }

        updateCartCount();
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

        if (existe) {
            existe.cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
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
                });
            });
        }
    }

    // ===== Inicializar
    document.addEventListener("DOMContentLoaded", () => {
        renderCarrito();
    });
})();
