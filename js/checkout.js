const getCart = () => JSON.parse(localStorage.getItem("carrito") || "[]");

const renderCart = () => {
    const carrito = getCart();
    const cont = document.getElementById("checkout-carrito");

    if (!carrito.length) {
        cont.innerHTML = `<div class="alert alert-warning">Tu carrito está vacío.</div>`;
        return false;
    }

    cont.innerHTML = `
    <table class="table">
      <thead>
        <tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr>
      </thead>
      <tbody>
        ${carrito.map(p => `
          <tr>
            <td>${p.productName}</td>
            <td>${p.cantidad}</td>
            <td>$${p.price.toLocaleString("es-CL")}</td>
            <td>$${(p.price * p.cantidad).toLocaleString("es-CL")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
    return true;
};

const updateCartCount = () => {
    const carrito = getCart();
    const badge = document.getElementById("cart-count");
    if (badge) {
        if (carrito.length) {
            badge.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
            badge.classList.remove("d-none");
        } else {
            badge.classList.add("d-none");
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const hasCart = renderCart();
    updateCartCount();

    if (!hasCart) return;

    document.getElementById("checkoutForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const fecha = document.getElementById("fechaEntrega").value;
        const direccion = document.getElementById("direccion").value.trim();
        const carrito = getCart();

        if (!fecha) return alert("Selecciona una fecha de entrega");
        if (new Date(fecha) < new Date().setHours(0, 0, 0, 0)) {
            return alert("La fecha de entrega no puede ser en el pasado");
        }
        if (!direccion) return alert("Ingresa la dirección de entrega");

        const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
        const pedido = {
            id: Date.now(),
            fecha,
            direccion,
            estado: "Pendiente",
            carrito,
            total: carrito.reduce((acc, p) => acc + p.price * p.cantidad, 0),
            creado: new Date().toISOString()
        };

        pedidos.push(pedido);
        localStorage.setItem("pedidos", JSON.stringify(pedidos));
        localStorage.removeItem("carrito");
        updateCartCount();

        // Mostrar modal de confirmación
        const modal = new bootstrap.Modal(document.getElementById("pedidoModal"));
        modal.show();

        // Redirigir cuando el modal se cierre
        document.getElementById("pedidoModal").addEventListener("hidden.bs.modal", () => {
            window.location.href = "pedidos.html";
        }, { once: true });
    });
});
