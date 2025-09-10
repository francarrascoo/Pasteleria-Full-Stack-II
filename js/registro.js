(() => {
    'use strict';

    const form = document.getElementById('signupForm');
    const nombre = document.getElementById('name');
    const email = document.getElementById('email');
    const pass = document.getElementById('password');
    const pass2 = document.getElementById('password2');
    const successModalEl = document.getElementById('successModal');

    // Instanciar modal Bootstrap (bloqueado para forzar botón Aceptar)
    const successModal = new bootstrap.Modal(successModalEl, { backdrop: 'static', keyboard: false });

    // Validación: contraseñas coinciden
    function validarPasswords() {
        if (!pass.value.trim() || !pass2.value.trim()) {
            pass2.setCustomValidity('');
            return;
        }
        pass2.setCustomValidity(pass.value !== pass2.value ? 'Las contraseñas no coinciden.' : '');
    }
    pass.addEventListener('input', validarPasswords);
    pass2.addEventListener('input', validarPasswords);

    form.addEventListener('submit', (e) => {
        validarPasswords();

        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        e.preventDefault(); // demo sin backend

        // Crear usuario en localStorage (con verificación de duplicado)
        const res = crearUsuario({
            nombre: nombre.value,
            correo: email.value,
            password: pass.value
        });

        if (!res.ok) {
            // Marcar error en el campo email con Bootstrap
            email.setCustomValidity(res.error);
            form.classList.add('was-validated');
            // Mostrar mensaje en el feedback (si quieres, añade un small.invalid-feedback debajo del email en el HTML)
            const emailFeedback = email.parentElement.querySelector('.invalid-feedback');
            if (emailFeedback) emailFeedback.textContent = res.error;
            return;
        }

        // Registro OK → limpiar y mostrar modal
        form.reset();
        form.classList.remove('was-validated');
        email.setCustomValidity('');

        successModal.show();

        // Al cerrar modal → señalar que se abra login en index
        successModalEl.addEventListener('hidden.bs.modal', () => {
            sessionStorage.setItem('abrirLoginModal', '1');
            window.location.assign('index.html#loginModal');
        }, { once: true });
    });
})();
