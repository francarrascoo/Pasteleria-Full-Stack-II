// —— Productos del catálogo (CLP, categorías reales) ——

    // —— Productos del catálogo (CLP, categorías reales) ——
var products = [
    {
        code: "TC001",
        productName: "Torta Cuadrada de Chocolate",
        price: 45000,
        img: "/img/torta-cuadrada-chocolate.png",
        category: "tortas-cuadradas",
        desc: "Deliciosa torta de chocolate con varias capas de esponjoso bizcocho, rellenas de ganache de chocolate belga y un toque de avellanas tostadas. Decorada con virutas de chocolate y una cobertura brillante, es ideal para los amantes del cacao intenso. Perfecta para celebraciones especiales o para consentirte en cualquier ocasión."
    },
    {
        code: "TC002",
        productName: "Torta Cuadrada de Frutas",
        price: 50000,
        img: "/img/torta-cuadrada-frutas.jpg",
        category: "tortas-cuadradas",
        desc: "Una mezcla exquisita de frutas frescas de temporada y crema chantilly natural sobre un suave bizcocho de vainilla. Cada bocado es una explosión de frescura y dulzura, decorada con frutas seleccionadas y glaseado ligero. Ideal para quienes buscan un postre colorido, refrescante y elegante."
    },
    {
        code: "TT001",
        productName: "Torta Circular de Vainilla",
        price: 40000,
        img: "/img/torta-circular-vainilla.jpg",
        category: "tortas-circulares",
        desc: "Bizcocho de vainilla clásico, suave y aromático, relleno con generosa crema pastelera y cubierto con un glaseado dulce y delicado. Decorada con detalles de chocolate blanco y perlas de azúcar, es una opción tradicional que nunca falla en cumpleaños y reuniones familiares."
    },
    {
        code: "TT002",
        productName: "Torta Circular de Manjar",
        price: 42000,
        img: "/img/torta-circular-manjar.jpg",
        category: "tortas-circulares",
        desc: "Torta tradicional chilena con capas de bizcocho esponjoso, rellenas de abundante manjar artesanal y nueces trozadas. Su cobertura de merengue italiano y decoración con nueces enteras la convierten en un clásico irresistible para los fanáticos del sabor dulce y la textura crujiente."
    },
    {
        code: "PI001",
        productName: "Mousse de Chocolate",
        price: 5000,
        img: "/img/postre-mousse-chocolate.png",
        category: "postres-individuales",
        desc: "Postre cremoso y suave, elaborado con chocolate de alta calidad y una textura aireada que se deshace en la boca. Perfecto para los amantes del chocolate, ideal como broche de oro para cualquier comida o celebración. Se sirve frío y decorado con virutas de chocolate y frutos rojos."
    },
    {
        code: "PI002",
        productName: "Tiramisú Clásico",
        price: 5500,
        img: "/img/postre-tiramisu.jpg",
        category: "postres-individuales",
        desc: "El clásico postre italiano con capas de bizcocho empapado en café, crema de mascarpone y cacao puro. Su sabor equilibrado y textura suave lo convierten en el favorito de quienes buscan un postre sofisticado y reconfortante. Presentado en porciones individuales listas para disfrutar."
    },
    {
        code: "PSA001",
        productName: "Torta Sin Azúcar de Naranja",
        price: 48000,
        img: "/img/sin-azucar-naranja.png",
        category: "productos-sin-azucar",
        desc: "Torta ligera y deliciosa, endulzada naturalmente con jugo de naranja y edulcorantes saludables. Su bizcocho esponjoso y su aroma cítrico la hacen perfecta para quienes cuidan su consumo de azúcar sin renunciar al placer de un buen postre."
    },
    {
        code: "PSA002",
        productName: "Cheesecake Sin Azúcar",
        price: 47000,
        img: "/img/sin-azucar-cheesecake.jpg",
        category: "productos-sin-azucar",
        desc: "Cheesecake suave y cremoso, elaborado con queso crema light y endulzado sin azúcar refinada. Su base de galleta integral y su cobertura de frutas frescas lo hacen irresistible y apto para quienes buscan opciones más saludables."
    },
    {
        code: "PT001",
        productName: "Empanada de Manzana",
        price: 3000,
        img: "/img/tradicional-empanada-manzana.jpg",
        category: "pasteleria-tradicional",
        desc: "Empanada tradicional rellena de manzanas frescas, canela y pasas, envuelta en una masa dorada y crujiente. Un clásico de la pastelería chilena, ideal para acompañar el té o el café de la tarde."
    },
    {
        code: "PT002",
        productName: "Tarta de Santiago",
        price: 6000,
        img: "/img/tradicional-tarta-santiago.png",
        category: "pasteleria-tradicional",
        desc: "Tarta española hecha con almendras molidas, azúcar y huevos, decorada con la tradicional cruz de Santiago en azúcar glas. Su sabor intenso y textura húmeda la convierten en una delicia para los amantes de la repostería europea."
    },
    {
        code: "PG001",
        productName: "Brownie Sin Gluten",
        price: 3500,
        img: "/img/sin-gluten-brownie.jpg",
        category: "productos-sin-gluten",
        desc: "Brownie denso y húmedo, elaborado sin gluten pero con todo el sabor del chocolate. Ideal para personas celíacas o quienes buscan alternativas más saludables, sin sacrificar el placer de un buen postre."
    },
    {
        code: "PG002",
        productName: "Pan Sin Gluten",
        price: 3500,
        img: "/img/sin-gluten-pan.jpg",
        category: "productos-sin-gluten",
        desc: "Pan suave y esponjoso, libre de gluten, perfecto para acompañar cualquier comida o preparar deliciosos sándwiches. Su sabor neutro y textura ligera lo hacen apto para toda la familia."
    },
    {
        code: "PV001",
        productName: "Torta Vegana de Chocolate",
        price: 38000,
        img: "/img/vegana-chocolate.jpg",
        category: "productos-veganos",
        desc: "Torta húmeda y esponjosa, elaborada sin productos de origen animal. Rellena de crema de chocolate vegana y decorada con frutas frescas o frutos secos. Una opción deliciosa y ética para quienes siguen una dieta vegana."
    },
    {
        code: "PV002",
        productName: "Galletas Veganas de Avena",
        price: 4500,
        img: "/img/vegana-galletas.jpg",
        category: "productos-veganos",
        desc: "Galletas crujientes y sabrosas, hechas con avena integral, plátano y chips de chocolate vegano. Son una opción saludable y energética para disfrutar en cualquier momento del día."
    },
    {
        code: "TE001",
        productName: "Torta Especial de Cumpleaños",
        price: 55000,
        img: "/img/especial-cumpleaños.png",
        category: "tortas-especiales",
        desc: "Celebra a lo grande con una torta de cumpleaños totalmente personalizable: elige sabores, colores y decoraciones temáticas. Rellena de crema suave y frutas o chocolate, y decorada con fondant artístico, figuras y mensajes especiales. Sorprende a tus seres queridos con una torta única y deliciosa, hecha a tu medida."
    },
    {
        code: "TE002",
        productName: "Torta Especial de Boda",
        price: 60000,
        img: "/img/especial-boda.jpeg",
        category: "tortas-especiales",
        desc: "Elegante torta de boda de varios pisos, elaborada con ingredientes premium y decorada con flores naturales o de azúcar. Rellena de crema de vainilla, frutos rojos o chocolate, según tu preferencia. Un centro de mesa espectacular y delicioso para el día más importante de tu vida."
    }
];


// Formateador CLP (sin decimales)
const clp = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
});

// URL detalle (para links)
const DETALLE_URL = "detalle.html";

function badgesHTML(p) {
    const out = [];
    // Detectar si el producto es personalizable por código
    const personalizables = ["TC001", "TE001", "TE002"];
    if (personalizables.includes(p.code)) out.push('<span class="badge text-bg-info">Personalizable</span>');
    if (p.category === "productos-sin-azucar") out.push('<span class="badge text-bg-dark">Sin azúcar</span>');
    if (p.category === "productos-sin-gluten") out.push('<span class="badge text-bg-warning">Sin gluten</span>');
    if (p.category === "productos-veganos") out.push('<span class="badge text-bg-success">Vegano</span>');
    return out.join(" ");
}

// ===== Helpers Carrito =====
const KEY_CART = "carrito";
const j = (x) => JSON.parse(x || "null");
const getCart = () => j(localStorage.getItem(KEY_CART)) || [];
const setCart = (cart) => localStorage.setItem(KEY_CART, JSON.stringify(cart));

// ✅ Actualizar contador en el icono
function updateCartCount() {
    const carrito = getCart();
    const badge = document.getElementById("cart-count");
    if (!badge) return;

    const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove("d-none");
    } else {
        badge.classList.add("d-none");
    }
}

// ✅ Agregar al carrito + modal
function addToCarrito(producto) {
    const carrito = getCart();
    const existe = carrito.find((p) => p.code === producto.code);

    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push({
            code: producto.code,
            productName: producto.productName,
            price: producto.price,
            img: producto.img,
            cantidad: 1,
        });
    }

    setCart(carrito);
    updateCartCount();

    // Mostrar modal de confirmación
    const modalMsg = document.getElementById("addedModalMsg");
    if (modalMsg) {
        modalMsg.textContent = `✅ ${producto.productName} se agregó al carrito.`;
    }
    const modalEl = document.getElementById("addedModal");
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}

// Render de productos
function displayProducts(productsToShow) {
    const shopContent = document.getElementById("shopContent");
    if (!shopContent) return;
    shopContent.innerHTML = "";

    if (!productsToShow.length) {
        shopContent.innerHTML = `<p class="text-muted py-3">No hay productos para este filtro.</p>`;
        return;
    }

        // Códigos de tortas personalizables
        const personalizables = ["TC001", "TE001", "TE002"];

        // Modal para mensaje personalizado (solo se crea una vez)
        let modalMensaje = document.getElementById('modalMensajePersonalizado');
        if (!modalMensaje) {
                    const modalHtml = `
                    <div class="modal fade" id="modalMensajePersonalizado" tabindex="-1" aria-labelledby="modalMensajePersonalizadoLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalMensajePersonalizadoLabel">Mensaje personalizado <span class="text-secondary small">(opcional)</span></h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                </div>
                                <div class="modal-body">
                                    <input type="text" class="form-control" id="inputMensajePersonalizado" maxlength="60" placeholder="Ej: ¡Feliz Cumpleaños, Ana! (opcional)">
                                    <div class="form-text">Puedes dejar este campo vacío si no deseas agregar un mensaje.</div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="button" class="btn btn-primary" id="btnConfirmarMensajePersonalizado">Agregar al carrito</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                modalMensaje = document.getElementById('modalMensajePersonalizado');
        }
    productsToShow.forEach((product) => {
        const div = document.createElement("div");
        div.className = "card-products text-start";
        div.innerHTML = `
      <img src="${product.img}" alt="${product.productName}">
      <h3 class="mb-1">${product.productName}</h3>
      <p class="code text-muted mb-1">Código: ${product.code}</p>
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="price fw-semibold">${clp.format(product.price)}</span>
        <div class="badges-inline d-flex gap-1 flex-wrap justify-content-end px-3">
          ${badgesHTML(product)}
        </div>
      </div>
      <button data-code="${product.code}" class="btn btn-outline-secondary btn-sm">
        <i class="bi bi-cart-plus"></i> Agregar al carrito
      </button>
    `;

        // ✅ Navegación a detalle
        div.tabIndex = 0;
        div.setAttribute("role", "link");
        div.style.cursor = "pointer";

        div.addEventListener("click", (e) => {
            if (e.target.closest("button")) return;
            location.href = `${DETALLE_URL}?code=${encodeURIComponent(product.code)}`;
        });

        div.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                location.href = `${DETALLE_URL}?code=${encodeURIComponent(product.code)}`;
            }
        });

        // ✅ Lógica carrito
        const addBtn = div.querySelector("button[data-code]");

        addBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (personalizables.includes(product.code)) {
                // Solo mostrar el modal para mensaje personalizado y agregar una unidad
                function getMensajePersonalizado() {
                    return new Promise((resolve, reject) => {
                        const inputMensaje = document.getElementById('inputMensajePersonalizado');
                        inputMensaje.value = "";
                        const modalEl = document.getElementById('modalMensajePersonalizado');
                        const modal = new bootstrap.Modal(modalEl);
                        let cerrado = false;
                        const btnConfirmar = document.getElementById('btnConfirmarMensajePersonalizado');
                        const btnCancelar = modalEl.querySelector('.btn-secondary');
                        btnConfirmar.onclick = function() {
                            cerrado = true;
                            resolve(inputMensaje.value.trim());
                            modal.hide();
                        };
                        btnCancelar.onclick = function() {
                            cerrado = true;
                            reject('cancel');
                            modal.hide();
                        };
                        modalEl.addEventListener('hidden.bs.modal', function handler() {
                            modalEl.removeEventListener('hidden.bs.modal', handler);
                            if (!cerrado) reject('cancel');
                        });
                        setTimeout(() => modal.show(), 100);
                    });
                }

                (async () => {
                    try {
                        const mensaje = await getMensajePersonalizado();
                        let carrito = getCart();
                        const prodCarrito = {
                            code: product.code,
                            productName: product.productName,
                            price: product.price,
                            img: product.img,
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
                        setCart(carrito);
                        updateCartCount();
                        // Mostrar modal de confirmación si existe
                        const modalMsg = document.getElementById("addedModalMsg");
                        if (modalMsg) {
                            modalMsg.textContent = `✅ ${product.productName} se agregó al carrito.`;
                        }
                        const modalEl = document.getElementById("addedModal");
                        if (modalEl) {
                            const modal2 = new bootstrap.Modal(modalEl);
                            modal2.show();
                        }
                    } catch {
                        // Cancelado, abortar
                        return;
                    }
                })();
            } else {
                addToCarrito(product);
            }
        });

        shopContent.append(div);
    });
}

// Filtro por categoría
function filterProducts(category) {
    if (!category || category === "*") return displayProducts(products);
    const productsToShow = products.filter((p) => p.category === category);
    displayProducts(productsToShow);
}

// —— Botones (IDs del HTML) ——
const btnIds = {
    tortasCuadradasBtn: "tortas-cuadradas",
    tortasCircularesBtn: "tortas-circulares",
    postresIndividualesBtn: "postres-individuales",
    sinAzucarBtn: "productos-sin-azucar",
    tradicionalBtn: "pasteleria-tradicional",
    sinGlutenBtn: "productos-sin-gluten",
    veganosBtn: "productos-veganos",
    tortasEspecialesBtn: "tortas-especiales",
    todosBtn: "*",
};

// Helper: limpiar la URL (quita ?filtro=...)
function limpiarURL() {
    const base = location.pathname.split("/").pop() || "productos.html";
    window.history.replaceState({}, document.title, base);
}

// Helper: set activo visual
function setActive(btn) {
    const container = document.querySelector(".filters");
    if (!container) return;
    const buttons = container.querySelectorAll("button");
    buttons.forEach((b) => {
        b.classList.remove("active", "btn-primary");
        b.classList.add("btn-outline-primary");
    });
    if (btn) {
        btn.classList.add("active", "btn-primary");
        btn.classList.remove("btn-outline-primary");
    }
}

// Centralizar binding de clicks
function bindFilterButtons() {
    Object.entries(btnIds).forEach(([btnId, category]) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener("click", () => {
            filterProducts(category);
            setActive(btn);
            limpiarURL();
        });
    });
}

// Mobile select -> dispara botón
function bindMobileFilter() {
    const mobileFilter = document.getElementById("mobileFilter");
    if (!mobileFilter) return;
    mobileFilter.addEventListener("change", (e) => {
        const targetId = e.target.value;
        if (!targetId) return;
        const btn = document.getElementById(targetId);
        if (btn) btn.click();
    });
}

// === INICIO: sincronía con localStorage.catalogo (REEMPLAZO) ===
function ensureSharedCatalog() {
    const KEY = "catalogo";
    try {
        let cat = JSON.parse(localStorage.getItem(KEY) || "null");

        if (!Array.isArray(cat) || cat.length === 0) {
            const seed = Array.isArray(products) ? products : [];
            cat = seed.map((p) => ({
                ...p,
                stock: Number.isFinite(p.stock) ? p.stock : 10,
                stockCritico: Number.isFinite(p.stockCritico) ? p.stockCritico : 5,
                capacidadDiaria: Number.isFinite(p.capacidadDiaria) ? p.capacidadDiaria : 20,
            }));
            localStorage.setItem(KEY, JSON.stringify(cat));
        } else {
            cat = cat.map((p) => ({
                ...p,
                stock: Number.isFinite(p.stock) ? p.stock : 10,
                stockCritico: Number.isFinite(p.stockCritico) ? p.stockCritico : 5,
                capacidadDiaria: Number.isFinite(p.capacidadDiaria) ? p.capacidadDiaria : 20,
            }));
            localStorage.setItem(KEY, JSON.stringify(cat));
        }

        products = cat;
        return products;
    } catch {
        return Array.isArray(products) ? products : [];
    }
}
// === FIN: sincronía con localStorage.catalogo (REEMPLAZO) ===

// Init
document.addEventListener("DOMContentLoaded", () => {
    ensureSharedCatalog();
    displayProducts(products);
    bindFilterButtons();
    bindMobileFilter();
    updateCartCount();

    const params = new URLSearchParams(window.location.search);
    const filtroId = params.get("filtro");
    if (filtroId && btnIds.hasOwnProperty(filtroId)) {
        const btn = document.getElementById(filtroId);
        if (btn) {
            btn.click();
            limpiarURL();
        }
    } else {
        const btnTodos = document.getElementById("todosBtn");
        if (btnTodos) setActive(btnTodos);
    }
});
