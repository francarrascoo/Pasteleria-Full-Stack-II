(() => {
    'use strict';

    // Elementos del modal de login
    const form = document.getElementById('loginForm');
    if (!form) return;

    const email = document.getElementById('loginEmail');
    const pass = document.getElementById('loginPass');
    const rememberMe = document.getElementById('rememberMe');
    const loginModalEl = document.getElementById('loginModal');

    function limpiarErrores() {
        email.setCustomValidity('');
        pass.setCustomValidity('');
    }

    form.addEventListener('submit', (e) => {
        limpiarErrores();

        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        e.preventDefault(); // demo sin backend

        const u = findUserByEmail(email.value.trim());
        if (!u) {
            email.setCustomValidity('El correo no está registrado.');
            form.classList.add('was-validated');
            const fb = email.parentElement.querySelector('.invalid-feedback');
            if (fb) fb.textContent = 'El correo no está registrado.';
            return;
        }

        if (u.password !== pass.value) {
            pass.setCustomValidity('Contraseña incorrecta.');
            form.classList.add('was-validated');
            const fb = pass.parentElement.querySelector('.invalid-feedback');
            if (fb) fb.textContent = 'Contraseña incorrecta.';
            return;
        }

        // Credenciales válidas → guardar sesión
        guardarSesion(u);

        // (Opcional) recordar con cookies simples
        if (rememberMe?.checked) {
            document.cookie = `usuarioCorreo=${encodeURIComponent(u.correo)}; path=/; max-age=${7 * 24 * 60 * 60}`;
            document.cookie = `usuarioNombre=${encodeURIComponent(u.nombre)}; path=/; max-age=${7 * 24 * 60 * 60}`;
        }

        // Cerrar modal y actualizar UI (si tienes saludo en navbar)
        if (loginModalEl && window.bootstrap?.Modal) {
            const modal = bootstrap.Modal.getOrCreateInstance(loginModalEl);
            modal.hide();
        }

        // Si usas un renderGreeting() como antes, llama aquí:
        if (typeof renderGreeting === 'function') {
            renderGreeting();
        }
    });
})();
