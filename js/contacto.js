// /js/contacto.js
(() => {
    'use strict';

    // ====== FIX robusto del dropdown (por si el auto-init falla) ======
    document.addEventListener('DOMContentLoaded', () => {
        const account = document.querySelector('.account-dropdown');
        if (account && window.bootstrap) {
            const toggle = account.querySelector('.nav-link[role="button"]') || account.querySelector('.nav-link');
            const menu = account.querySelector('.dropdown-menu');
            if (toggle && menu) {
                toggle.classList.add('dropdown-toggle');
                toggle.setAttribute('data-bs-toggle', 'dropdown');
                if (!toggle.hasAttribute('aria-expanded')) toggle.setAttribute('aria-expanded', 'false');
                const dd = bootstrap.Dropdown.getOrCreateInstance(toggle);
                toggle.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    dd.toggle();
                }, { capture: true });
            }
        }
    });

    // ====== Validación de formulario Contacto ======
    const form = document.getElementById('contactoForm');
    if (!form) return;

    const nombre = document.getElementById('nombre');
    const correo = document.getElementById('correo');
    const mensaje = document.getElementById('mensaje');
    const contador = document.getElementById('contadorPalabras');

    const LIMITE_PALABRAS = 100;
    const contarPalabras = (str) => str.trim().split(/\s+/).filter(Boolean).length;

    const validarNombre = () => {
        const v = nombre.value.trim();
        if (!v) nombre.setCustomValidity('Ingresa tu nombre.');
        else if (v.length < 2) nombre.setCustomValidity('Tu nombre debe tener al menos 2 caracteres.');
        else nombre.setCustomValidity('');
    };

    const validarCorreo = () => {
        if (correo.validity.valueMissing) correo.setCustomValidity('Ingresa tu correo.');
        else if (correo.validity.typeMismatch) correo.setCustomValidity('El formato del correo no es válido.');
        else correo.setCustomValidity('');
    };

    const refrescarContador = () => {
        const palabras = contarPalabras(mensaje.value);
        if (contador) contador.textContent = `${palabras}/${LIMITE_PALABRAS} palabras`;

        if (!mensaje.value.trim()) mensaje.setCustomValidity('Por favor, escribe un mensaje.');
        else if (palabras > LIMITE_PALABRAS) mensaje.setCustomValidity('Máximo 100 palabras.');
        else mensaje.setCustomValidity('');
    };

    nombre.addEventListener('input', validarNombre);
    correo.addEventListener('input', validarCorreo);
    mensaje.addEventListener('input', refrescarContador);

    // Estado inicial
    validarNombre();
    validarCorreo();
    refrescarContador();

    // Envío: si el form es válido, se envía a FormSubmit (action del form)
    form.addEventListener('submit', (event) => {
        validarNombre();
        validarCorreo();
        refrescarContador();

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    });
})();
