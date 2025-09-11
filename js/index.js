(() => {
    'use strict';

    function shouldOpenLogin() {
        return (
            sessionStorage.getItem('abrirLoginModal') === '1' ||
            (location.hash && location.hash.toLowerCase().includes('loginmodal'))
        );
    }

    function openLoginModal() {
        const el = document.getElementById('loginModal');
        if (!el) return;

        const modal = bootstrap.Modal.getOrCreateInstance(el, { focus: true });
        modal.show();

        // limpiar flag y hash para no reabrir en futuros reloads
        sessionStorage.removeItem('abrirLoginModal');
        if (location.hash) {
            history.replaceState(null, '', location.pathname + location.search);
        }
    }

    function tryOpen() {
        if (!shouldOpenLogin()) return;

        if (!window.bootstrap || !document.getElementById('loginModal')) {
            // Reintenta hasta que todo esté cargado
            setTimeout(tryOpen, 50);
            return;
        }
        openLoginModal();
    }

    // Probar al cargar DOM y al cargar la página completa
    document.addEventListener('DOMContentLoaded', tryOpen);
    window.addEventListener('load', tryOpen);
})();

const section = document.querySelector('.parallax-1');
let current = 0, target = 0;
const speed = 0.08;   // suavidad
const factor = 0.5;   // cuanto se mueve

function lerp(a, b, t) { return a + (b - a) * t; }

// calcular target solo al hacer scroll
function updateTarget() {
    const rect = section.getBoundingClientRect();
    const viewportH = window.innerHeight;

    const progress = (viewportH / 2 - (rect.top + rect.height / 2)) / viewportH;
    target = progress * 100 * factor;
}

// loop suave
function tick() {
    current = lerp(current, target, speed);
    section.style.backgroundPosition = `50% ${55 + current}%`;
    requestAnimationFrame(tick);
}

window.addEventListener("scroll", updateTarget, { passive: true });
window.addEventListener("resize", updateTarget, { passive: true });

// inicio
updateTarget();
requestAnimationFrame(tick);