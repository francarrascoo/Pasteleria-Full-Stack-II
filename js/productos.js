// —— Productos del catálogo (CLP, categorías reales) ——

    // —— Productos del catálogo (CLP, categorías reales) ——
var products = [
    {
        code: "TC001",
        productName: "Torta Cuadrada de Chocolate",
        price: 45000,
        img: "/img/torta-cuadrada-chocolate.png",
        category: "tortas-cuadradas",
        desc: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas."
    },
    {
        code: "TC002",
        productName: "Torta Cuadrada de Frutas",
        price: 50000,
        img: "/img/torta-cuadrada-frutas.jpg",
        category: "tortas-cuadradas",
        desc: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho."
    },
    {
        code: "TT001",
        productName: "Torta Circular de Vainilla",
        price: 40000,
        img: "/img/torta-circular-vainilla.jpg",
        category: "tortas-circulares",
        desc: "Bizcocho de vainilla clásico relleno con crema pastelera y glaseado dulce."
    },
    {
        code: "TT002",
        productName: "Torta Circular de Manjar",
        price: 42000,
        img: "/img/torta-circular-manjar.jpg",
        category: "tortas-circulares",
        desc: "Torta tradicional chilena con manjar y nueces."
    },
    {
        code: "PI001",
        productName: "Mousse de Chocolate",
        price: 5000,
        img: "/img/postre-mousse-chocolate.png",
        category: "postres-individuales",
        desc: "Postre cremoso y suave, hecho con chocolate de alta calidad."
    },
    {
        code: "PI002",
        productName: "Tiramisú Clásico",
        price: 5500,
        img: "/img/postre-tiramisu.jpg",
        category: "postres-individuales",
        desc: "Postre italiano con capas de café, mascarpone y cacao."
    },
    {
        code: "PSA001",
        productName: "Torta Sin Azúcar de Naranja",
        price: 48000,
        img: "/img/sin-azucar-naranja.png",
        category: "productos-sin-azucar",
        desc: "Torta ligera y deliciosa, endulzada naturalmente."
    },
    {
        code: "PSA002",
        productName: "Cheesecake Sin Azúcar",
        price: 47000,
        img: "/img/sin-azucar-cheesecake.jpg",
        category: "productos-sin-azucar",
        desc: "Suave y cremoso, perfecto para disfrutar sin culpa."
    },
    {
        code: "PT001",
        productName: "Empanada de Manzana",
        price: 3000,
        img: "/img/tradicional-empanada-manzana.jpg",
        category: "pasteleria-tradicional",
        desc: "Pastelería tradicional rellena de manzanas especiadas."
    },
    {
        code: "PT002",
        productName: "Tarta de Santiago",
        price: 6000,
        img: "/img/tradicional-tarta-santiago.png",
        category: "pasteleria-tradicional",
        desc: "Tarta española hecha con almendras, azúcar y huevos."
    },
    {
        code: "PG001",
        productName: "Brownie Sin Gluten",
        price: 3500,
        img: "/img/sin-gluten-brownie.jpg",
        category: "productos-sin-gluten",
        desc: "Brownie denso, perfecto para quienes evitan el gluten."
    },
    {
        code: "PG002",
        productName: "Pan Sin Gluten",
        price: 3500,
        img: "/img/sin-gluten-pan.jpg",
        category: "productos-sin-gluten",
        desc: "Suave y esponjoso, ideal para acompañar cualquier comida."
    },
    {
        code: "PV001",
        productName: "Torta Vegana de Chocolate",
        price: 38000,
        img: "/img/vegana-chocolate.jpg",
        category: "productos-veganos",
        desc: "Torta húmeda hecha sin productos de origen animal."
    },
    {
        code: "PV002",
        productName: "Galletas Veganas de Avena",
        price: 4500,
        img: "/img/vegana-galletas.jpg",
        category: "productos-veganos",
        desc: "Crujientes y sabrosas, una opción vegana saludable."
    },
    {
        code: "TE001",
        productName: "Torta Especial de Cumpleaños",
        price: 55000,
        img: "/img/especial-cumpleaños.png",
        category: "tortas-especiales",
        desc: "Personalizable con decoraciones únicas para cumpleaños."
    },
    {
        code: "TE002",
        productName: "Torta Especial de Boda",
        price: 60000,
        img: "/img/especial-boda.jpeg",
        category: "tortas-especiales",
        desc: "Elegante y deliciosa, diseñada para bodas."
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
    if (p.customizable) out.push('<span class="badge text-bg-info">Personalizable</span>');
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
            addToCarrito(product);
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
