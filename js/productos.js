// —— Productos del catálogo (CLP, categorías reales) ——
const products = [
    {
        code: "TC001", productName: "Torta Cuadrada de Chocolate", price: 45000, img: "/img/torta-cuadrada-chocolate.png", category: "tortas-cuadradas",
        desc: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales."
    },
    {
        code: "TC002", productName: "Torta Cuadrada de Frutas", price: 50000, img: "/img/torta-cuadrada-frutas.jpg", category: "tortas-cuadradas",
        desc: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones."
    },
    {
        code: "TT001", productName: "Torta Circular de Vainilla", price: 40000, img: "/img/torta-circular-vainilla.jpg", category: "tortas-circulares",
        desc: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión."
    },
    {
        code: "TT002", productName: "Torta Circular de Manjar", price: 42000, img: "/img/torta-circular-manjar.jpg", category: "tortas-circulares",
        desc: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos."
    },
    {
        code: "PI001", productName: "Mousse de Chocolate", price: 5000, img: "/img/postre-mousse-chocolate.png", category: "postres-individuales",
        desc: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate."
    },
    {
        code: "PI002", productName: "Tiramisú Clásico", price: 5500, img: "/img/postre-tiramisu.jpg", category: "postres-individuales",
        desc: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida."
    },
    {
        code: "PSA001", productName: "Torta Sin Azúcar de Naranja", price: 48000, img: "/img/sin-azucar-naranja.png", category: "productos-sin-azucar",
        desc: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables."
    },
    {
        code: "PSA002", productName: "Cheesecake Sin Azúcar", price: 47000, img: "/img/sin-azucar-cheesecake.jpg", category: "productos-sin-azucar",
        desc: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa."
    },
    {
        code: "PT001", productName: "Empanada de Manzana", price: 3000, img: "/img/tradicional-empanada-manzana.jpg", category: "pasteleria-tradicional",
        desc: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda."
    },
    {
        code: "PT002", productName: "Tarta de Santiago", price: 6000, img: "/img/tradicional-tarta-santiago.png", category: "pasteleria-tradicional",
        desc: "Tradicional tarta española hecha con almendras, azúcar y huevos; una delicia para los amantes de los postres clásicos."
    },
    {
        code: "PG001", productName: "Brownie Sin Gluten", price: 3500, img: "/img/sin-gluten-brownie.jpg", category: "productos-sin-gluten",
        desc: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor."
    },
    {
        code: "PG002", productName: "Pan Sin Gluten", price: 3500, img: "/img/sin-gluten-pan.jpg", category: "productos-sin-gluten",
        desc: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida."
    },
    {
        code: "PV001", productName: "Torta Vegana de Chocolate", price: 38000, img: "/img/vegana-chocolate.jpg", category: "productos-veganos",
        desc: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos."
    },
    {
        code: "PV002", productName: "Galletas Veganas de Avena", price: 4500, img: "/img/vegana-galletas.jpg", category: "productos-veganos",
        desc: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano."
    },
    {
        code: "TE001", productName: "Torta Especial de Cumpleaños", price: 55000, img: "/img/especial-cumpleaños.png", category: "tortas-especiales",
        desc: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos."
    },
    {
        code: "TE002", productName: "Torta Especial de Boda", price: 60000, img: "/img/especial-boda.jpeg", category: "tortas-especiales",
        desc: "Elegante y deliciosa, diseñada para ser el centro de atención en cualquier boda."
    }
];


// Formateador CLP (sin decimales)
const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

// URL detalle (para links)
const DETALLE_URL = 'detalle.html';

function badgesHTML(p) {
    const out = [];
    if (p.customizable) out.push('<span class="badge text-bg-info">Personalizable</span>');
    if (p.category === 'productos-sin-azucar') out.push('<span class="badge text-bg-dark">Sin azúcar</span>');
    if (p.category === 'productos-sin-gluten') out.push('<span class="badge text-bg-warning">Sin gluten</span>');
    if (p.category === 'productos-veganos') out.push('<span class="badge text-bg-success">Vegano</span>');
    return out.join(' ');
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

    productsToShow.forEach(product => {
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

    <button data-code="${product.code}" class="btn btn-outline-secondary btn-sm">Agregar al carrito</button>
`;


        // ✅ Hacer clickeable toda la card (excepto el botón)
        div.tabIndex = 0;              // accesible con teclado
        div.setAttribute('role', 'link');
        div.style.cursor = 'pointer';

        div.addEventListener('click', (e) => {
            // Si el click fue en el botón, no navegar
            if (e.target.closest('button')) return;
            location.href = `${DETALLE_URL}?code=${encodeURIComponent(product.code)}`;
        });

        // Enter para navegar (accesibilidad)
        div.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                location.href = `${DETALLE_URL}?code=${encodeURIComponent(product.code)}`;
            }
        });

        // Evitar que el botón propague el click a la card
        const addBtn = div.querySelector('button[data-code]');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Aquí tu lógica de agregar al carrito si la tienes
            // ...
        });

        shopContent.append(div);
    });
}


// Filtro por categoría
function filterProducts(category) {
    if (!category || category === "*") return displayProducts(products);
    const productsToShow = products.filter(p => p.category === category);
    displayProducts(productsToShow);
}

// —— Botones (IDs del HTML) ——
const btnIds = {
    tortasCuadradasBtn: 'tortas-cuadradas',
    tortasCircularesBtn: 'tortas-circulares',
    postresIndividualesBtn: 'postres-individuales',
    sinAzucarBtn: 'productos-sin-azucar',
    tradicionalBtn: 'pasteleria-tradicional',
    sinGlutenBtn: 'productos-sin-gluten',
    veganosBtn: 'productos-veganos',
    tortasEspecialesBtn: 'tortas-especiales',
    todosBtn: '*',
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
    buttons.forEach(b => {
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
        btn.addEventListener('click', () => {
            filterProducts(category);
            setActive(btn);
            limpiarURL(); // <- deja la URL limpia SIEMPRE al cambiar filtro
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

// === INICIO: sincronía con localStorage.catalogo ===
function ensureSharedCatalog() {
    const KEY = "catalogo";
    try {
        let cat = JSON.parse(localStorage.getItem(KEY) || "null");
        if (!Array.isArray(cat) || cat.length === 0) {
            // 1ª vez: clonar arreglo products → agregar stock y stockCritico por defecto
            cat = (Array.isArray(window.products) ? window.products : []).map(p => ({
                ...p,
                stock: Number.isFinite(p.stock) ? p.stock : 10,         // default
                stockCritico: Number.isFinite(p.stockCritico) ? p.stockCritico : 5
            }));
            localStorage.setItem(KEY, JSON.stringify(cat));
        }
        // Reemplaza la fuente global para que tienda/detalle lean del mismo lugar
        window.products = cat;
        return cat;
    } catch {
        return Array.isArray(window.products) ? window.products : [];
    }
}
// === FIN: sincronía con localStorage.catalogo ===


// Init
document.addEventListener("DOMContentLoaded", () => {
    // (NUEVO) Asegura fuente única de datos
    ensureSharedCatalog();

    // Render inicial (todos)
    displayProducts(products);

    // Bind de botones y mobile
    bindFilterButtons();
    bindMobileFilter();

    // Si llega filtro, aplicar y limpiar URL
    const params = new URLSearchParams(window.location.search);
    const filtroId = params.get("filtro"); // ej: "sinAzucarBtn"
    if (filtroId && btnIds.hasOwnProperty(filtroId)) {
        const btn = document.getElementById(filtroId);
        if (btn) {
            btn.click();     // aplica tu lógica existente
            limpiarURL();    // limpia la URL inmediatamente
        }
    } else {
        // Marcar "Todos" por defecto
        const btnTodos = document.getElementById("todosBtn");
        if (btnTodos) setActive(btnTodos);
    }
});
