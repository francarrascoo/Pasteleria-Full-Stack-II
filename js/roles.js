// /js/roles.js
(() => {
    'use strict';

    // Roles "principales" del sistema
    window.ROLES = Object.freeze({
        ADMIN: 'Administrador',
        VENDEDOR: 'Vendedor',
        CLIENTE: 'Cliente',          // usuario normal
    });

    // Helpers dominios
    const DUOC_DOMAINS = ['@duoc.cl', '@profesor.duoc.cl'];
    const GMAIL = '@gmail.com';

    function isDuocEmail(email) {
        const e = String(email || '').toLowerCase();
        return DUOC_DOMAINS.some(dom => e.endsWith(dom));
    }
    function isGmail(email) {
        const e = String(email || '').toLowerCase();
        return e.endsWith(GMAIL);
    }

    function parseDateISO(s) {
        if (!s) return null;
        const d = new Date(s);
        return isNaN(d) ? null : d;
    }
    function calcEdad(fechaISO) {
        const d = parseDateISO(fechaISO);
        if (!d) return null;
        const today = new Date();
        let age = today.getFullYear() - d.getFullYear();
        const m = today.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
        return age;
    }

    // Segmentación "derivada" (no pisa el rol)
    function segmentarUsuario(u) {
        const email = String(u.correo || u.email || '').toLowerCase();
        const edad = calcEdad(u.fechaNacimiento || u.nacimiento);
        const seg = {
            isDuoc: isDuocEmail(email),
            isMayor75: Number.isFinite(edad) ? edad >= 75 : false,
            isGmail: isGmail(email),
            edad: Number.isFinite(edad) ? edad : null,
            dominio: (email.includes('@') ? email.slice(email.indexOf('@')) : ''),
        };
        seg.etiqueta =
            seg.isDuoc ? 'Usuario DUOC' :
                seg.isMayor75 ? 'Usuario Mayor de 75' :
                    'Usuario común';

        return seg;
    }

    // Normaliza un usuario (asegura rol y segmento)
    function normalizeUser(u) {
        const base = { ...u };
        base.rol = base.rol || ROLES.CLIENTE;
        base.segmento = segmentarUsuario(base);
        return base;
    }

    // Exponer helpers
    window.UserSegmentation = {
        isDuocEmail, isGmail, calcEdad, segmentarUsuario, normalizeUser
    };
})();
