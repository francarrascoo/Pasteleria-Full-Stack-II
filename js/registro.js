// Formatea el RUT a 12.345.678-9 mientras se escribe
function formatearRun(valor) {
    valor = valor.replace(/[^0-9kK]/g, "").toUpperCase().trim();
    if (valor.length === 0) return "";
    let cuerpo = valor.slice(0, -1);
    let dv = valor.slice(-1);
    if (valor.length <= 1) return valor;
    if (cuerpo.length === 7)
        cuerpo = cuerpo.replace(/(\d{1})(\d{3})(\d{3})/, "$1.$2.$3");
    else if (cuerpo.length === 8)
        cuerpo = cuerpo.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3");
    return cuerpo && dv ? cuerpo + "-" + dv : cuerpo;
}

// Validar RUN
function ValidarRun(run) {
    if (typeof run !== 'string') return false;
    run = run.trim();
    // Verificar si el RUN tiene el formato correcto
    const rutRegex = /^[0-9]{1,2}(\.[0-9]{3}){2}-[0-9Kk]{1}$/;
    if (!rutRegex.test(run)) return false;
    // Separar el cuerpo y el dígito verificador
    const [cuerpo, dv] = run.split('-');
    const numero = cuerpo.replace(/\./g, '');
    let suma = 0, multiplo = 2;
    for (let i = numero.length - 1; i >= 0; i--) {
        suma += parseInt(numero.charAt(i), 10) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    const dvEsperado = 11 - (suma % 11);
    let dvCalc = '';
    if (dvEsperado === 11) dvCalc = '0';
    else if (dvEsperado === 10) dvCalc = 'K';
    else dvCalc = dvEsperado.toString();
    return dv.toUpperCase() === dvCalc;
}


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

document.addEventListener('DOMContentLoaded', () => {
    const run = document.getElementById('run');
    if (run) {
        // Formatear RUT mientras se escribe
        run.addEventListener("input", (e) => {
            const pos = run.selectionStart;
            const original = run.value;
            const formateado = formatearRun(original);
            run.value = formateado;

            // Mantener el cursor lo más cerca posible de la posición original
            if (document.activeElement === run) {
                let diff = formateado.length - original.length;
                run.setSelectionRange(pos + diff, pos + diff);
            }
            clearError(run, "Por favor ingresa un RUT válido con puntos y guion.");
        });
    }
});

(() => {
    'use strict';

    const form = document.getElementById('signupForm');
    if (!form) return;

    const run = document.getElementById('run');             
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
        // RUT: formato y dígito verificador
        if (!ValidarRun(run.value)) {
            setError(run, "El RUN ingresado no es válido. Debe tener formato 1.234.567-8 o 12.345.678-9 (con puntos y guion).");
        } else {
            clearError(run, "Por favor ingresa un RUN válido con puntos y guion.");
        }

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
            run: run.value,
            nombre: nombre?.value || "",
            apellido: apellido?.value || "",
            correo: email.value,
            password: pass.value,
            nacimiento: birthdate?.value || null,
            codigo: codigo?.value || "",
            rol: "Cliente"
        });

        if (!res.ok) {
            // Mostrar error en el campo correspondiente
            if (res.error && res.error.includes('RUT')) {
                setError(run, res.error);
            } else {
                setError(email, res.error);
            }
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
