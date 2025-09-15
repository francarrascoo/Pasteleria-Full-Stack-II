// ===== Cálculo de beneficios reutilizable =====
function calcularBeneficiosUsuario({ correo, nacimiento, codigo }) {
    let beneficios = { descuento: 0, tortaGratisCumple: false };
    const hoy = new Date();
    const fechaNac = nacimiento ? new Date(nacimiento) : null;
    const edad = fechaNac ? hoy.getFullYear() - fechaNac.getFullYear() : 0;
    const cumple = !!(fechaNac && hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() === fechaNac.getDate());
    if (edad >= 50) beneficios.descuento = 50;
    if (codigo && String(codigo).trim().toUpperCase() === "FELICES50") {
        beneficios.descuento = Math.max(beneficios.descuento, 10);
    }
    const cl = String(correo || "").toLowerCase();
    if (cl.endsWith("@duoc.cl") || cl.endsWith("@profesor.duoc.cl")) {
        beneficios.tortaGratisCumple = true;
    }
    return beneficios;
}
// ===== Claves de almacenamiento =====
const LSK_USUARIOS = "usuarios";
const LSK_SESION = "usuarioActivo";

// ===== Utils de validación =====
const EMAIL_DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

function emailDominioValido(correo) {
    const c = String(correo || "").toLowerCase().trim();
    return EMAIL_DOMINIOS_PERMITIDOS.some((d) => c.endsWith(d));
}

function emailLargoOK(correo) {
    return String(correo || "").length <= 100;
}

function passLargoOK(pass) {
    const n = String(pass || "").length;
    return n >= 4 && n <= 10;
}

// ===== CRUD de Usuarios =====
function getUsuarios() {
    try {
        return JSON.parse(localStorage.getItem(LSK_USUARIOS)) || [];
    } catch {
        return [];
    }
}

function setUsuarios(lista) {
    localStorage.setItem(LSK_USUARIOS, JSON.stringify(lista));
}

/**
 * Crear un nuevo usuario
 * Requisitos:
 * - Email requerido, máx 100, dominio permitido
 * - Password requerido, entre 4 y 10 caracteres
 * Extras:
 * - Beneficios (edad 50+, código FELICES50, correos Duoc)
 */
function crearUsuario({
    run,
    nombre,
    apellido = "",
    correo,
    password,
    nacimiento,
    codigo,
    rol = "Cliente",
}) {
    // Formatear el RUN antes de validar y guardar
    if (typeof formatearRun === 'function') {
        run = formatearRun(run);
    } else {
        // Fallback mínimo si no está la función
        run = String(run || "").replace(/[^0-9kK]/g, "").toUpperCase().trim();
        let cuerpo = run.slice(0, -1);
        let dv = run.slice(-1);
        if (cuerpo.length === 7)
            cuerpo = cuerpo.replace(/(\d{1})(\d{3})(\d{3})/, "$1.$2.$3");
        else if (cuerpo.length === 8)
            cuerpo = cuerpo.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3");
        run = cuerpo && dv ? cuerpo + "-" + dv : cuerpo;
    }
    // Validaciones
    if (!run || typeof run !== "string" || !/^([0-9]{1,2})\.[0-9]{3}\.[0-9]{3}-[0-9Kk]$/.test(run)) {
        return { ok: false, error: "El RUT es obligatorio y debe tener formato 12.345.678-9." };
    }
    if (!emailLargoOK(correo)) {
        return { ok: false, error: "El correo debe tener como máximo 100 caracteres." };
    }
    if (!emailDominioValido(correo)) {
        return {
            ok: false,
            error: "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.",
        };
    }
    if (!passLargoOK(password)) {
        return { ok: false, error: "La contraseña debe tener entre 4 y 10 caracteres." };
    }

    const lista = getUsuarios();
    const existeCorreo = lista.some(
        (u) => u.correo.toLowerCase() === String(correo).toLowerCase()
    );
    if (existeCorreo) return { ok: false, error: "El correo ya está registrado." };
    const existeRun = lista.some(
        (u) => u.run && u.run.toUpperCase() === String(run).toUpperCase()
    );
    if (existeRun) return { ok: false, error: "El RUT ya está registrado." };

    // Beneficios extra
    const hoy = new Date();
    const beneficios = calcularBeneficiosUsuario({ correo, nacimiento, codigo });
    const nuevo = {
        id: run,
        run: String(run || "").toUpperCase(),
        nombre: String(nombre || "").trim(),
        apellido: String(apellido || "").trim(),
        correo: String(correo || "").trim(),
        password: String(password || ""), // ⚠️ solo demo, en real debe cifrarse
        nacimiento: nacimiento || null,
        beneficios,
        rol,
        creadoEn: hoy.toISOString(),
    };

    lista.push(nuevo);
    setUsuarios(lista);
    return { ok: true, user: nuevo };
}

function findUserByEmail(correo) {
    const lista = getUsuarios();
    return (
        lista.find(
            (u) => u.correo.toLowerCase() === String(correo || "").toLowerCase()
        ) || null
    );
}

// ===== Sesión =====
function guardarSesion(usuario, recordar = false) {
    const payload = {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        beneficios: usuario.beneficios,
        rol: usuario.rol || "Cliente",
        ts: Date.now(),
        run: usuario.run || usuario.id || '',
        nacimiento: usuario.nacimiento || '',
    };
    const data = JSON.stringify(payload);

    // Siempre guardar en ambos para consistencia inmediata
    localStorage.setItem(LSK_SESION, data);
    sessionStorage.setItem(LSK_SESION, data);

    // ⚡ Restaurar carrito guardado del usuario
    // Siempre restaurar SOLO el carrito del usuario activo
    const carritoGuardado = localStorage.getItem(`carrito_${usuario.id}`);
    if (carritoGuardado) {
        localStorage.setItem("carrito", carritoGuardado);
    } else {
        // Si no hay carrito guardado, limpiar el carrito global
        localStorage.removeItem("carrito");
    }
}

function limpiarSesion() {
    const sesion = leerSesion();
    if (sesion) {
        // Guardar SIEMPRE el carrito actual en el usuario antes de cerrar sesión
        const carrito = localStorage.getItem("carrito");
        if (carrito) {
            localStorage.setItem(`carrito_${sesion.id}`, carrito);
        } else {
            // Si no hay carrito, eliminar el carrito guardado del usuario
            localStorage.removeItem(`carrito_${sesion.id}`);
        }
    }

    localStorage.removeItem(LSK_SESION);
    sessionStorage.removeItem(LSK_SESION);

    // Limpiar SIEMPRE el carrito global
    localStorage.removeItem("carrito");
}

function leerSesion() {
    try {
        return JSON.parse(
            sessionStorage.getItem(LSK_SESION) || localStorage.getItem(LSK_SESION)
        );
    } catch {
        return null;
    }
}
