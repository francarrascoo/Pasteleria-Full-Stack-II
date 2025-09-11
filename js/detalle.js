document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const producto = products.find(p => p.code === code);

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
});
