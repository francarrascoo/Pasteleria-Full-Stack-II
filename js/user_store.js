// Claves
const LSK_USUARIOS = "usuarios";
const LSK_SESION = "usuarioActivo";

// ===== Utils de validación (según instrucción)
const EMAIL_DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
function emailDominioValido(correo) {
    const c = String(correo || "").toLowerCase().trim();
    return EMAIL_DOMINIOS_PERMITIDOS.some(d => c.endsWith(d));
}
function emailLargoOK(correo) {
    return String(correo || "").length <= 100;
}
function passLargoOK(pass) {
    const n = String(pass || "").length;
    return n >= 4 && n <= 10;
}

// ===== Usuarios
function getUsuarios() {
    try { return JSON.parse(localStorage.getItem(LSK_USUARIOS)) || []; }
    catch { return []; }
}
function setUsuarios(lista) {
    localStorage.setItem(LSK_USUARIOS, JSON.stringify(lista));
}

/**
 * crearUsuario
 * Requisitos de la guía:
 * - Email requerido, máx 100 y dominio permitido
 * - Password requerido, 4-10
 * Extras tuyos:
 * - Beneficios (50+, FELICES50, torta Duoc)
 */
function crearUsuario({ nombre, apellido = "", correo, password, nacimiento, codigo, rol = "Cliente" }) {
    // Validaciones de guía
    if (!emailLargoOK(correo)) {
        return { ok: false, error: "El correo debe tener como máximo 100 caracteres." };
    }
    if (!emailDominioValido(correo)) {
        return { ok: false, error: "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com." };
    }
    if (!passLargoOK(password)) {
        return { ok: false, error: "La contraseña debe tener entre 4 y 10 caracteres." };
    }

    const lista = getUsuarios();
    const existe = lista.some(u => u.correo.toLowerCase() === String(correo).toLowerCase());
    if (existe) return { ok: false, error: "El correo ya está registrado." };

    // Beneficios (tu lógica previa)
    const hoy = new Date();
    const fechaNac = nacimiento ? new Date(nacimiento) : null;
    const edad = fechaNac ? (hoy.getFullYear() - fechaNac.getFullYear()) : 0;
    const cumple = !!(fechaNac && hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() === fechaNac.getDate());
    let beneficios = { descuento: 0, tortaGratisCumple: false };

    if (edad >= 50) beneficios.descuento = 50;                      // 50% 50+
    if (codigo && String(codigo).trim().toUpperCase() === "FELICES50") {
        beneficios.descuento = Math.max(beneficios.descuento, 10);    // 10% de por vida
    }
    const cl = String(correo || "").toLowerCase();
    if (cl.endsWith("@duoc.cl") || cl.endsWith("@profesor.duoc.cl")) {
        beneficios.tortaGratisCumple = true;                           // Torta gratis en cumpleaños
        if (cumple) { /* opcional: alert de cumple */ }
    }

    const nuevo = {
        id: Date.now(),
        nombre: String(nombre || "").trim(),
        apellido: String(apellido || "").trim(),
        correo: String(correo || "").trim(),
        password: String(password || ""), // (solo demo)
        nacimiento: nacimiento || null,
        beneficios,
        rol,                               // base para permisos del admin
        creadoEn: hoy.toISOString()
    };

    lista.push(nuevo);
    setUsuarios(lista);
    return { ok: true, user: nuevo };
}

function findUserByEmail(correo) {
    const lista = getUsuarios();
    return lista.find(u => u.correo.toLowerCase() === String(correo || "").toLowerCase()) || null;
}

// ===== Sesión
function guardarSesion(usuario, recordar = false) {
    const payload = {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        beneficios: usuario.beneficios,
        rol: usuario.rol || "Cliente",
        ts: Date.now()
    };
    const data = JSON.stringify(payload);

    if (recordar) {
        localStorage.setItem(LSK_SESION, data);   // persiste
    } else {
        sessionStorage.setItem(LSK_SESION, data); // se borra al cerrar
    }
}
function limpiarSesion() {
    localStorage.removeItem(LSK_SESION);
    sessionStorage.removeItem(LSK_SESION);
}
function leerSesion() {
    try {
        return JSON.parse(sessionStorage.getItem(LSK_SESION) || localStorage.getItem(LSK_SESION));
    } catch {
        return null;
    }
}
