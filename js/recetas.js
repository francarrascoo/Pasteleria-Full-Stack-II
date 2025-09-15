// Recetas semanales de ejemplo
const recetas = [
    {
        id: "brownies",
        titulo: "Brownies",
        ingredientes: "200g chocolate, 150g mantequilla, 3 huevos, 100g azúcar, 80g harina",
        preparacion: "1. Derretir el chocolate y la mantequilla...\n2. Batir los huevos con el azúcar...\n3. Mezclar todo y hornear a 180°C por 25 minutos."
    },
    {
        id: "tarta-manzana",
        titulo: "Tarta de Manzana",
        ingredientes: "2 manzanas, 100g azúcar, 1 masa de tarta, canela",
        preparacion: "1. Cortar las manzanas...\n2. Colocar sobre la masa...\n3. Hornear a 180°C por 30 minutos."
    }
    // ...agrega más recetas aquí...
];

// Obtener el parámetro de la receta desde la URL
function getRecetaIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('receta');
}

// Buscar receta por ID
function buscarReceta(id) {
    // Revisar si hay edición guardada en localStorage
    const editada = localStorage.getItem('receta_' + id);
    if (editada) return JSON.parse(editada);
    return recetas.find(r => r.id === id);
}

// Mostrar receta en el HTML
function mostrarReceta(receta) {
    if (!receta) {
        document.getElementById('titulo-receta').textContent = "Receta no encontrada";
        document.getElementById('detalle-receta').textContent = "";
        document.getElementById('form-editar').style.display = "none";
        return;
    }
    document.getElementById('titulo-receta').textContent = receta.titulo;
    document.getElementById('detalle-receta').innerHTML = `
        <strong>Ingredientes:</strong><br>${receta.ingredientes.replace(/\n/g, "<br>")}<br>
        <strong>Preparación:</strong><br>${receta.preparacion.replace(/\n/g, "<br>")}
    `;
    // Rellenar formulario
    document.getElementById('input-titulo').value = receta.titulo;
    document.getElementById('input-ingredientes').value = receta.ingredientes;
    document.getElementById('input-preparacion').value = receta.preparacion;
}

// Guardar cambios en localStorage
function guardarCambios(id) {
    const recetaEditada = {
        id,
        titulo: document.getElementById('input-titulo').value,
        ingredientes: document.getElementById('input-ingredientes').value,
        preparacion: document.getElementById('input-preparacion').value
    };
    localStorage.setItem('receta_' + id, JSON.stringify(recetaEditada));
    mostrarReceta(recetaEditada);
}

document.addEventListener('DOMContentLoaded', () => {
    const recetaId = getRecetaIdFromUrl();
    const receta = buscarReceta(recetaId);
    mostrarReceta(receta);

    document.getElementById('form-editar').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarCambios(recetaId);
        alert('Receta actualizada');
    });
});
