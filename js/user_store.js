// Clave localStorage para usuarios y sesión
const LSK_USUARIOS = "usuarios";
const LSK_SESION = "usuarioActivo";

// ------ Usuarios ------
function getUsuarios() {
    try { return JSON.parse(localStorage.getItem(LSK_USUARIOS)) || []; }
    catch { return []; }
}

function setUsuarios(lista) {
    localStorage.setItem(LSK_USUARIOS, JSON.stringify(lista));
}

// Crea usuario si el correo no existe aún
function crearUsuario({ nombre, correo, password }) {
    const lista = getUsuarios();
    const existe = lista.some(u => u.correo.toLowerCase() === correo.toLowerCase());
    if (existe) return { ok: false, error: "El correo ya está registrado." };

    const nuevo = {
        id: Date.now(),
        nombre: nombre.trim(),
        correo: correo.trim(),
        password: password, // Solo demo. En producción, NO guardar en texto plano.
        creadoEn: new Date().toISOString()
    };
    lista.push(nuevo);
    setUsuarios(lista);
    return { ok: true, user: nuevo };
}

// Busca usuario por correo
function findUserByEmail(correo) {
    const lista = getUsuarios();
    return lista.find(u => u.correo.toLowerCase() === correo.toLowerCase()) || null;
}

// ------ Sesión ------
function guardarSesion(usuario) {
    const payload = { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, ts: Date.now() };
    localStorage.setItem(LSK_SESION, JSON.stringify(payload));
}
function limpiarSesion() {
    localStorage.removeItem(LSK_SESION);
}
function leerSesion() {
    try { return JSON.parse(localStorage.getItem(LSK_SESION)); }
    catch { return null; }
}
