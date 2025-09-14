// /js/seed_admin.js
(() => {
    'use strict';

    const LSK_USUARIOS = 'usuarios';

    // 👇 Cambia acá el email/clave del admin
    const ADMIN_EMAIL = 'pasteleriamilsabores.fm@gmail.com';
    const ADMIN_PASS = 'tortas';

    // 👇 MUY IMPORTANTE: cada vez que cambies la contraseña,
    //    CAMBIA también esta versión (cualquier string nuevo).
    const ADMIN_SEED_VERSION = '2025-09-13-v1';

    function getUsuarios() {
        try { return JSON.parse(localStorage.getItem(LSK_USUARIOS)) || []; }
        catch { return []; }
    }
    function setUsuarios(lista) {
        localStorage.setItem(LSK_USUARIOS, JSON.stringify(lista));
    }

    function ensureAdmin() {
        let lista = getUsuarios();
        const idx = lista.findIndex(
            u => String(u.correo || '').toLowerCase() === ADMIN_EMAIL.toLowerCase()
        );
        const ahora = new Date().toISOString();

        if (idx === -1) {
            // No existe → crearlo
            const nuevo = {
                id: Date.now(),
                nombre: 'Administrador',
                apellido: '',
                correo: ADMIN_EMAIL,
                password: ADMIN_PASS, // demo (en real: hash)
                nacimiento: null,
                beneficios: { descuento: 0, tortaGratisCumple: false },
                rol: 'Administrador',
                protegido: true,          // para ocultar "eliminar" en UI
                seedVersion: ADMIN_SEED_VERSION,
                creadoEn: ahora
            };
            lista.push(nuevo);
            setUsuarios(lista);
            console.info('[seed_admin] Cuenta admin creada.');
        } else {
            // Ya existe → si cambiaste password o versionaste, ACTUALIZA
            const u = lista[idx];
            if (
                u.seedVersion !== ADMIN_SEED_VERSION ||
                u.password !== ADMIN_PASS ||
                u.rol !== 'Administrador' ||
                u.protegido !== true
            ) {
                lista[idx] = {
                    ...u,
                    password: ADMIN_PASS,
                    rol: 'Administrador',
                    protegido: true,
                    seedVersion: ADMIN_SEED_VERSION,
                    actualizadoEn: ahora
                };
                setUsuarios(lista);
                console.info('[seed_admin] Cuenta admin actualizada por nueva seedVersion/clave.');
            }
        }
    }

    // Ejecutar al cargar y si otros tabs cambian usuarios
    try { ensureAdmin(); } catch { }
    document.addEventListener('DOMContentLoaded', ensureAdmin);
    window.addEventListener('storage', (e) => {
        if (e.key === LSK_USUARIOS) setTimeout(ensureAdmin, 0);
    });
})();
