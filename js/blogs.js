// /js/blogs.js
// Renderiza tarjetas de blog/recetas (sin inline scripts). 100% JS externo.

// Si más adelante quieres mover los datos a /data/blogs.json, solo cambia la fuente.
const POSTS = [
    {
        id: "torta-chocolate",
        titulo: "Torta de Chocolate: 5 trucos para que quede húmeda",
        resumen:
            "Aprende a preparar una torta de chocolate perfecta: balance de cacao, tiempo de horneado y almíbares.",
        imagen: "/img/blog/TortaChocolate.jpg",
        fecha: "2025-09-01",
        autor: "Pastelería Mil Sabores",
        link: "/pages/detalle.html?id=torta-chocolate&type=blog"
    },
    {
        id: "rellenos-primavera",
        titulo: "Rellenos frescos de primavera",
        resumen:
            "Tres combinaciones de frutas y cremas que sorprenden, con tips de conservación y armado.",
        imagen: "/img/blog/RellenoDulce.jpg",
        fecha: "2025-08-25",
        autor: "Equipo de Pastelería",
        link: "/pages/detalle.html?id=rellenos-primavera&type=blog"
    },
    {
        id: "sin-azucar",
        titulo: "Postres sin azúcar: guía de endulzantes",
        resumen:
            "Stevia, eritritol y más: cómo reemplazar sin perder textura ni sabor.",
        imagen: "/img/blog/SinAzucar.jpg",
        fecha: "2025-08-10",
        autor: "Francisca",
        link: "/pages/detalle.html?id=sin-azucar&type=blog"
    }
];

function formatearFechaISO(iso) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" });
    } catch {
        return iso;
    }
}

function plantillaCard(post) {
    const fecha = formatearFechaISO(post.fecha);
    const alt = post.titulo.replace(/"/g, "'");
    return `
    <div class="col-12 col-sm-6 col-lg-4">
    <article class="card h-100 card-blog shadow-sm">
        <img src="${post.imagen}" class="card-img-top" alt="${alt}">
        <div class="card-body d-flex flex-column">
        <h5 class="card-title">${post.titulo}</h5>
        <p class="text-muted mb-2">${fecha} · ${post.autor}</p>
        <p class="card-text flex-grow-1">${post.resumen}</p>
        <div class="mt-3">
            <a href="${post.link}" class="btn btn-outline-dark w-100">Leer más</a>
        </div>
        </div>
    </article>
    </div>
`;
}

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("lista-blogs");
    if (!root) return;

    render(POSTS);

    function render(posts) {
        if (!Array.isArray(posts) || posts.length === 0) {
            root.innerHTML = `<div class="col-12"><div class="alert alert-info">Aún no hay publicaciones.</div></div>`;
            return;
        }
        // Orden opcional por fecha descendente
        posts.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));
        root.innerHTML = posts.map(plantillaCard).join("");
    }
});
