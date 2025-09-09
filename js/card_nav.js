// Ajusta según tu estructura (si detalle está en /pages/, etc.)
const DETALLE_URL = 'detalle.html';

function gotoDetail(code) {
    if (!code) return;
    location.href = `${DETALLE_URL}?code=${encodeURIComponent(code)}`;
}

// Clicks
document.addEventListener('click', (e) => {
    // 1) Si el click fue en el botón de carrito, no navegamos y evitamos el salto por href="#"
    const cartBtn = e.target.closest('.btn-add-cart');
    if (cartBtn) {
        e.preventDefault(); // evita el salto al top por href="#"
        return;
    }

    // 2) Solo click izquierdo sin modificadores abre detalle
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const card = e.target.closest('.card-cat');
    if (!card) return;

    const code = card.dataset.code
        || card.querySelector('[data-code]')?.dataset.code; // fallback si lo tienes en un hijo
    gotoDetail(code);
});

// Teclado (accesibilidad)
document.addEventListener('keydown', (e) => {
    const card = e.target.closest('.card-cat');
    if (!card) return;

    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const code = card.dataset.code
            || card.querySelector('[data-code]')?.dataset.code;
        gotoDetail(code);
    }
});

// Cursor “mano” (si prefieres, pásalo a CSS)
document.querySelectorAll('.card-cat').forEach(c => {
    c.style.cursor = 'pointer';
    // recomendable: que sean focusables para Enter/Espacio:
    if (!c.hasAttribute('tabindex')) c.setAttribute('tabindex', '0');
    if (!c.hasAttribute('role')) c.setAttribute('role', 'link');
});
