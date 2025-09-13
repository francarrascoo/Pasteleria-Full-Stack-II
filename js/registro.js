(() => {
    'use strict';

    const form = document.getElementById('signupForm');
    if (!form) return;

    const nombre = document.getElementById('name');
    const apellido = document.getElementById('lastname');     // opcional
    const email = document.getElementById('email');
    const birthdate = document.getElementById('birthdate');   // opcional
    const codigo = document.getElementById('codigo');         // opcional
    const pass = document.getElementById('password');
    const pass2 = document.getElementById('password2');
    const successModalEl = document.getElementById('successModal');
    const successModal = successModalEl ? new bootstrap.Modal(successModalEl, { backdrop: 'static', keyboard: false }) : null;

    // ===== Helpers
    const EMAIL_DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    const emailDominioValido = (c) => EMAIL_DOMINIOS_PERMITIDOS.some(d => String(c || "").toLowerCase().endsWith(d));

    function setError(input, msg) {
        input.setCustomValidity(msg || "");
        const fb = input.parentElement?.querySelector('.invalid-feedback');
        if (fb && msg) fb.textContent = msg;
    }
    function clearError(input, defaultMsg) {
        input.setCustomValidity("");
        const fb = input.parentElement?.querySelector('.invalid-feedback');
        if (fb && defaultMsg) fb.textContent = defaultMsg;
    }

    function validarPasswordsCoinciden() {
        if (!pass.value.trim() || !pass2.value.trim()) {
            setError(pass2, ""); // no bloquear si una está vacía (HTML5 required hará lo suyo)
            return;
        }
        if (pass.value !== pass2.value) {
            setError(pass2, "Las contraseñas no coinciden.");
        } else {
            clearError(pass2);
        }
    }

    // ===== Limpieza en vivo (muy importante para no “atascar” el submit)
    email.addEventListener("input", () => clearError(email, "Por favor ingresa un correo válido."));
    pass.addEventListener("input", () => { clearError(pass, "Por favor ingresa una contraseña."); validarPasswordsCoinciden(); });
    pass2.addEventListener("input", () => { clearError(pass2, "Repite la contraseña."); validarPasswordsCoinciden(); });

    // ===== Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // manejamos todo con JS

        // 1) Validaciones de negocio antes de checkValidity()
        // Email: ≤ 100 y dominios permitidos
        const correoVal = String(email.value || '').trim().toLowerCase();
        if (correoVal.length > 100) {
            setError(email, "El correo debe tener como máximo 100 caracteres.");
        } else if (!emailDominioValido(correoVal)) {
            setError(email, "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        } else {
            clearError(email, "Por favor ingresa un correo válido.");
        }

        // Password: 4–10
        const pLen = String(pass.value || '').length;
        if (pLen < 4 || pLen > 10) {
            setError(pass, "La contraseña debe tener entre 4 y 10 caracteres.");
        } else {
            clearError(pass, "Por favor ingresa una contraseña.");
        }

        // Coincidencia de contraseñas
        validarPasswordsCoinciden();

        // 2) Validaciones HTML5 (required, type=email, etc.)
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return; // no continuar si algo quedó inválido
        }

        // 3) Crear usuario
        const res = crearUsuario({
            nombre: nombre?.value || "",
            apellido: apellido?.value || "",
            correo: email.value,
            password: pass.value,
            nacimiento: birthdate?.value || null,
            codigo: codigo?.value || "",
            rol: "Cliente"
        });

        if (!res.ok) {
            // p.ej. correo duplicado
            setError(email, res.error);
            form.classList.add('was-validated');
            return;
        }

        // 4) Mostrar beneficios en el modal (opcional)
        if (successModalEl && res.user?.beneficios) {
            const bodyP = successModalEl.querySelector(".modal-body p");
            if (bodyP) {
                let msg = "¡Tu cuenta ha sido creada correctamente! Ahora puedes iniciar sesión.";
                const b = res.user.beneficios;
                if (b.descuento > 0) msg += ` 🎉 Tienes un ${b.descuento}% de descuento en todas tus compras.`;
                if (b.tortaGratisCumple) msg += " 🎂 Además, tendrás torta gratis en tu cumpleaños (correo Duoc).";
                bodyP.textContent = msg;
            }
        }

        // 5) Reset y navegación
        form.reset();
        form.classList.remove('was-validated');
        clearError(email);
        clearError(pass);
        clearError(pass2);

        if (successModal) {
            successModal.show();
            successModalEl.addEventListener('hidden.bs.modal', () => {
                sessionStorage.setItem('abrirLoginModal', '1');
                window.location.assign('index.html#loginModal');
            }, { once: true });
        } else {
            window.location.assign('index.html#loginModal');
        }
    });
})();
