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
    nombre,
    apellido = "",
    correo,
    password,
    nacimiento,
    codigo,
    rol = "Cliente",
}) {
    // Validaciones
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
    const existe = lista.some(
        (u) => u.correo.toLowerCase() === String(correo).toLowerCase()
    );
    if (existe) return { ok: false, error: "El correo ya está registrado." };

    // Beneficios extra
    const hoy = new Date();
    const fechaNac = nacimiento ? new Date(nacimiento) : null;
    const edad = fechaNac ? hoy.getFullYear() - fechaNac.getFullYear() : 0;
    const cumple =
        !!(fechaNac &&
            hoy.getMonth() === fechaNac.getMonth() &&
            hoy.getDate() === fechaNac.getDate());

    let beneficios = { descuento: 0, tortaGratisCumple: false };

    if (edad >= 50) beneficios.descuento = 50; // 50% si tiene 50+
    if (codigo && String(codigo).trim().toUpperCase() === "FELICES50") {
        beneficios.descuento = Math.max(beneficios.descuento, 10); // 10% de por vida
    }
    const cl = String(correo || "").toLowerCase();
    if (cl.endsWith("@duoc.cl") || cl.endsWith("@profesor.duoc.cl")) {
        beneficios.tortaGratisCumple = true;
        if (cumple) {
            // aquí podrías disparar un aviso de cumpleaños
        }
    }

    const nuevo = {
        id: Date.now(),
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
    };
    const data = JSON.stringify(payload);

    if (recordar) {
        localStorage.setItem(LSK_SESION, data); // persiste al cerrar navegador
    } else {
        sessionStorage.setItem(LSK_SESION, data); // se borra al cerrar navegador
    }

    // ⚡ Restaurar carrito guardado del usuario
    const carritoGuardado = localStorage.getItem(`carrito_${usuario.id}`);
    if (carritoGuardado) {
        localStorage.setItem("carrito", carritoGuardado);
    } else {
        localStorage.removeItem("carrito");
    }
}

function limpiarSesion() {
    const sesion = leerSesion();
    if (sesion) {
        // Guardar carrito del usuario antes de cerrar sesión
        const carrito = localStorage.getItem("carrito");
        if (carrito) {
            localStorage.setItem(`carrito_${sesion.id}`, carrito);
        }
    }

    localStorage.removeItem(LSK_SESION);
    sessionStorage.removeItem(LSK_SESION);

    // 🔥 Limpiar carrito visible
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

// === User Store – utilidades de roles/segmento y Vendedor ===
(() => {
    'use strict';

    const LSK_USUARIOS = 'usuarios';

    function getUsuarios() {
        try { return JSON.parse(localStorage.getItem(LSK_USUARIOS)) || []; }
        catch { return []; }
    }
    function setUsuarios(lista) {
        localStorage.setItem(LSK_USUARIOS, JSON.stringify(lista));
    }

    // Normaliza todos (asegura .rol y .segmento)
    function ensureUsuariosNormalizados() {
        const lista = getUsuarios().map(u =>
            (window.UserSegmentation ? window.UserSegmentation.normalizeUser(u) : u)
        );
        setUsuarios(lista);
        return lista;
    }

    function findByEmail(email) {
        const e = String(email || '').toLowerCase();
        return getUsuarios().find(u => String(u.correo || '').toLowerCase() === e) || null;
    }

    // --- Validaciones básicas ---
    function validarEmailPermitido(email) {
        const e = String(email || '').toLowerCase();
        // Reglas de la guía: duoc/profesor/gmail
        return ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'].some(dom => e.endsWith(dom));
    }

    // RUT Chile (sin puntos ni guion, con dígito verificador 0-9/K)
    function limpiarRut(rut) { return String(rut || '').trim().toUpperCase().replace(/[^0-9K]/g, ''); }
    function dvRut(numero) {
        let M = 0, S = 1;
        for (; numero; numero = Math.floor(numero / 10)) {
            S = (S + numero % 10 * (9 - M++ % 6)) % 11;
        }
        return S ? String(S - 1) : 'K';
    }
    function validarRut(rut) {
        const r = limpiarRut(rut);
        if (r.length < 7 || r.length > 9) return false;
        const cuerpo = r.slice(0, -1);
        const dv = r.slice(-1);
        if (!/^\d+$/.test(cuerpo)) return false;
        return dvRut(Number(cuerpo)) === dv;
    }

    // --- Crear Vendedor (rut, nombre, correo) ---
    function crearVendedor({ rut, nombre, correo, password }) {
        // Validaciones
        function limpiarRut(rut) { return String(rut || '').trim().toUpperCase().replace(/[^0-9K]/g, '') }
        function dvRut(numero) { let M = 0, S = 1; for (; numero; numero = Math.floor(numero / 10))S = (S + numero % 10 * (9 - M++ % 6)) % 11; return S ? String(S - 1) : 'K' }
        function validarRut(rut) { const r = limpiarRut(rut); if (r.length < 7 || r.length > 9) return false; const c = r.slice(0, -1), dv = r.slice(-1); if (!/^\d+$/.test(c)) return false; return dvRut(Number(c)) === dv }
        function validarEmailPermitido(email) { const e = String(email || '').toLowerCase(); return ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'].some(dom => e.endsWith(dom)) }
        function getUsuarios() { try { return JSON.parse(localStorage.getItem('usuarios')) || [] } catch { return [] } }
        function setUsuarios(lista) { localStorage.setItem('usuarios', JSON.stringify(lista)) }
        function findByEmail(email) { const e = String(email || '').toLowerCase(); return getUsuarios().find(u => String(u.correo || '').toLowerCase() === e) || null }

        if (!rut || !validarRut(rut)) throw new Error('RUN inválido. Ej: 19011022K (sin puntos ni guión).');
        if (!nombre || nombre.trim().length === 0 || nombre.length > 50) throw new Error('Nombre requerido (máx 50).');
        if (!correo || !validarEmailPermitido(correo)) throw new Error('Correo no permitido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com.');
        if (findByEmail(correo)) throw new Error('Ya existe un usuario con ese correo.');
        if (!password || password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');

        const hoy = new Date().toISOString();
        const lista = getUsuarios();

        const nuevo = {
            id: Date.now(),
            rut: limpiarRut(rut),
            nombre: nombre.trim(),
            apellido: '',
            correo: String(correo).toLowerCase(),
            password: String(password),   // *** se guarda tal cual (mockup)
            fechaNacimiento: null,
            rol: 'Vendedor',
            bloqueado: false,
            creadoEn: hoy,
            protegido: false,
        };

        lista.push(nuevo);
        setUsuarios(lista);
        return nuevo;
    }

    // expón de nuevo si usas objeto
    window.UserStore = window.UserStore || {};
    window.UserStore.crearVendedor = crearVendedor;


    // Exponer en window para usar desde admin.js/login.js
    window.UserStore = {
        getUsuarios, setUsuarios, ensureUsuariosNormalizados,
        findByEmail, crearVendedor,
        validarRut, validarEmailPermitido
    };

    // Normalizar inmediatamente (por si ya había data vieja)
    try { ensureUsuariosNormalizados(); } catch { }
})();
