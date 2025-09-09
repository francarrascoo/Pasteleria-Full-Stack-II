// —— Productos del catálogo (CLP, categorías reales) ——
const products = [
    { code: "TC001", productName: "Torta Cuadrada de Chocolate", price: 45000, img: "/img/torta-cuadrada-1.jpg", category: "tortas-cuadradas" },
    { code: "TC002", productName: "Torta Cuadrada de Frutas", price: 50000, img: "img/tortas/cuadradas-frutas.jpg", category: "tortas-cuadradas" },
    { code: "TT001", productName: "Torta Circular de Vainilla", price: 40000, img: "img/tortas/circulares-vainilla.jpg", category: "tortas-circulares" },
    { code: "TT002", productName: "Torta Circular de Manjar", price: 42000, img: "img/tortas/circulares-manjar.jpg", category: "tortas-circulares" },
    { code: "PI001", productName: "Mousse de Chocolate", price: 5000, img: "img/postres/mousse-chocolate.jpg", category: "postres-individuales" },
    { code: "PI002", productName: "Tiramisú Clásico", price: 5500, img: "img/postres/tiramisu-clasico.jpg", category: "postres-individuales" },
    { code: "PSA001", productName: "Torta Sin Azúcar de Naranja", price: 48000, img: "img/sin-azucar/torta-naranja.jpg", category: "productos-sin-azucar" },
    { code: "PSA002", productName: "Cheesecake Sin Azúcar", price: 47000, img: "img/sin-azucar/cheesecake.jpg", category: "productos-sin-azucar" },
    { code: "PT001", productName: "Empanada de Manzana", price: 3000, img: "img/tradicional/empanada-manzana.jpg", category: "pasteleria-tradicional" },
    { code: "PT002", productName: "Tarta de Santiago", price: 6000, img: "img/tradicional/tarta-santiago.jpg", category: "pasteleria-tradicional" },
    { code: "PG001", productName: "Brownie Sin Gluten", price: 3500, img: "img/sin-gluten/brownie.jpg", category: "productos-sin-gluten" },
    { code: "PG002", productName: "Pan Sin Gluten", price: 3500, img: "img/sin-gluten/pan.jpg", category: "productos-sin-gluten" },
    { code: "PV001", productName: "Torta Vegana de Chocolate", price: 38000, img: "img/veganos/torta-vegana-chocolate.jpg", category: "productos-veganos" },
    { code: "PV002", productName: "Galletas Veganas de Avena", price: 4500, img: "img/veganos/galletas-avena.jpg", category: "productos-veganos" },
    { code: "TE001", productName: "Torta Especial de Cumpleaños", price: 55000, img: "img/especiales/torta-cumpleanos.jpg", category: "tortas-especiales" },
    { code: "TE002", productName: "Torta Especial de Boda", price: 60000, img: "img/especiales/torta-boda.jpg", category: "tortas-especiales" },
];

// Formateador CLP (sin decimales)
const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

const displayProducts = (productsToShow) => {
    const shopContent = document.getElementById("shopContent");
    shopContent.innerHTML = "";
    productsToShow.forEach(product => {
        const div = document.createElement("div");
        div.className = "card-products";
        div.innerHTML = `
      <img src="${product.img}" alt="${product.productName}">
      <h3>${product.productName}</h3>
      <p class="code text-muted">Código: ${product.code}</p>
      <p class="price">${clp.format(product.price)}</p>
      <button data-code="${product.code}">Agregar al carrito</button>
    `;
        shopContent.append(div);
    });
};

// Filtro por categoría
const filterProducts = (category) => {
    const productsToShow = products.filter(p => p.category === category);
    displayProducts(productsToShow);
};

// —— Botones (asegúrate de que estos IDs existan en tu HTML) ——
const btnTortasCuadradas = document.getElementById('tortasCuadradasBtn');
const btnTortasCirculares = document.getElementById('tortasCircularesBtn');
const btnPostres = document.getElementById('postresIndividualesBtn');
const btnSinAzucar = document.getElementById('sinAzucarBtn');
const btnTradicional = document.getElementById('tradicionalBtn');
const btnSinGluten = document.getElementById('sinGlutenBtn');
const btnVeganos = document.getElementById('veganosBtn');
const btnTortasEspeciales = document.getElementById('tortasEspecialesBtn');
const btnTodos = document.getElementById('todosBtn');

// Listeners
btnTortasCuadradas?.addEventListener('click', () => filterProducts('tortas-cuadradas'));
btnTortasCirculares?.addEventListener('click', () => filterProducts('tortas-circulares'));
btnPostres?.addEventListener('click', () => filterProducts('postres-individuales'));
btnSinAzucar?.addEventListener('click', () => filterProducts('productos-sin-azucar'));
btnTradicional?.addEventListener('click', () => filterProducts('pasteleria-tradicional'));
btnSinGluten?.addEventListener('click', () => filterProducts('productos-sin-gluten'));
btnVeganos?.addEventListener('click', () => filterProducts('productos-veganos'));
btnTortasEspeciales?.addEventListener('click', () => filterProducts('tortas-especiales'));
btnTodos?.addEventListener('click', () => displayProducts(products));

// Render inicial
displayProducts(products);
