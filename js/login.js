(() => {
    'use strict';

    const form = document.getElementById('loginForm');
    if (!form) return;

    const email = document.getElementById('loginEmail');
    const pass = document.getElementById('loginPass');
    const rememberMe = document.getElementById('rememberMe');
    const loginModalEl = document.getElementById('loginModal');

    // --- Utiles
    const EMAIL_DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    const emailDominioValido = (c) => EMAIL_DOMINIOS_PERMITIDOS.some(d => String(c || "").toLowerCase().endsWith(d));

    // Prefill si existe sesión persistida (localStorage)
    try {
        const sesionLocal = JSON.parse(localStorage.getItem('usuarioActivo'));
        if (sesionLocal?.correo) {
            email.value = sesionLocal.correo;
            if (rememberMe) rememberMe.checked = true;
        }
    } catch { }

    // Limpia errores al escribir
    function limpiarErrores() {
        email.setCustomValidity('');
        pass.setCustomValidity('');
        const fbEmail = email.parentElement.querySelector('.invalid-feedback');
        const fbPass = pass.parentElement.querySelector('.invalid-feedback');
        if (fbEmail) fbEmail.textContent = 'Ingresa un correo válido.';
        if (fbPass) fbPass.textContent = 'La contraseña es obligatoria.';
    }
    email.addEventListener('input', limpiarErrores);
    pass.addEventListener('input', limpiarErrores);

    // (Opcional) pintar saludo/beneficios en un span #user-info si existe
    function updateUserInfoUI() {
        const badge = document.getElementById('user-info');
        const ses = typeof leerSesion === 'function' ? leerSesion() : null;
        if (!badge || !ses) return;

        const partes = [`Hola ${ses.nombre}${ses.apellido ? ' ' + ses.apellido : ''}`];
        if (ses?.beneficios?.descuento > 0) partes.push(`Descuento ${ses.beneficios.descuento}%`);
        if (ses?.beneficios?.tortaGratisCumple) partes.push('🎂 Torta gratis en tu cumpleaños');
        badge.textContent = partes.join(' | ');
        badge.classList.add('text-success');
    }

    form.addEventListener('submit', (e) => {
        limpiarErrores();

        // Solo validar si los campos están vacíos
        if (!email.value) {
            e.preventDefault(); e.stopPropagation();
            email.setCustomValidity("El correo es obligatorio.");
            form.classList.add('was-validated');
            const fb = email.parentElement.querySelector('.invalid-feedback');
            if (fb) fb.textContent = "El correo es obligatorio.";
            return;
        }
        if (!pass.value) {
            e.preventDefault(); e.stopPropagation();
            pass.setCustomValidity("La contraseña es obligatoria.");
            form.classList.add('was-validated');
            const fb = pass.parentElement.querySelector('.invalid-feedback');
            if (fb) fb.textContent = "La contraseña es obligatoria.";
            return;
        }

        // HTML5 ok -> seguimos
        if (!form.checkValidity()) {
            e.preventDefault(); e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        e.preventDefault(); // demo sin backend

        // Validar usuario registrado y credenciales
        const u = typeof findUserByEmail === 'function'
            ? findUserByEmail(email.value.trim())
            : null;

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

        // Guardar sesión: sessionStorage (no recordarme) o localStorage (recordarme)
        if (typeof guardarSesion === 'function') {
            guardarSesion(u, !!(rememberMe && rememberMe.checked));
        }

        // Cerrar modal
        if (loginModalEl && window.bootstrap?.Modal) {
            const modal = bootstrap.Modal.getOrCreateInstance(loginModalEl);
            modal.hide();
        }

    // Actualizar UI opcional
    updateUserInfoUI();
    if (typeof renderGreeting === 'function') renderGreeting();
    if (typeof renderNavbarSession === 'function') renderNavbarSession();
    });

    if (loginModalEl) {
        loginModalEl.addEventListener('shown.bs.modal', updateUserInfoUI);
    }
})();
