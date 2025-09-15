// /js/admin_access.js
(() => {
    'use strict';

    const ADMIN_EMAIL = 'pasteleriamilsabores.fm@gmail.com';
    const LSK_SESION = 'usuarioActivo';

    // --- Sesión
    function getSesion() {
        try {
            return JSON.parse(
                sessionStorage.getItem(LSK_SESION) || localStorage.getItem(LSK_SESION)
            ) || null;
        } catch { return null; }
    }

    function currentIsAdmin() {
        const s = getSesion();
        const mail = String(s?.correo || s?.email || '').toLowerCase();
        return !!(s && (s.rol === 'Administrador' || mail === ADMIN_EMAIL || s.isAdmin === true));
    }

    // --- Vendedor
    function currentIsVendedor() {
        const s = getSesion();
        return !!(s && s.rol === 'Vendedor');
    }

    // --- Inyectar link en header si no existe
    function ensureHeaderAdminLink() {
        const headerNav = document.querySelector('header .navbar-nav.mx-auto');
        if (!headerNav) return;

        let li = headerNav.querySelector('#nav-admin-link');
        if (!li) {
            li = document.createElement('li');
            li.className = 'nav-item';
            li.id = 'nav-admin-link';
            li.style.display = 'none';
            li.innerHTML = `<a class="nav-link" href="/pages/admin.html">Admin</a>`;
            headerNav.appendChild(li);
        }
    }

    function ensureHeaderVendedorLink() {
        const headerNav = document.querySelector('header .navbar-nav.mx-auto');
        if (!headerNav) return;

        let li = headerNav.querySelector('#nav-vendedor-link');
        if (!li) {
            li = document.createElement('li');
            li.className = 'nav-item';
            li.id = 'nav-vendedor-link';
            li.style.display = 'none';
            li.innerHTML = `<a class="nav-link" href="/pages/vendedor.html">Vendedor</a>`;
            headerNav.appendChild(li);
        }
    }

    // --- Mostrar/ocultar links a admin.html (header + footer)
    function toggleAdminLinks() {
        const show = currentIsAdmin();

        // Asegura que el header tenga link
        ensureHeaderAdminLink();

        const anchors = document.querySelectorAll(
            'a[href$="/pages/admin.html"], a[href="admin.html"], a[href="/pages/admin.html"]'
        );
        anchors.forEach(a => {
            const wrap = a.closest('li') || a;
            wrap.style.display = show ? '' : 'none';
        });
    }

    function toggleVendedorLinks() {
        const show = currentIsVendedor();

        // Asegura que el header tenga link
        ensureHeaderVendedorLink();

        const anchors = document.querySelectorAll(
            'a[href$="/pages/vendedor.html"], a[href="vendedor.html"], a[href="/pages/vendedor.html"]'
        );
        anchors.forEach(a => {
            const wrap = a.closest('li') || a;
            wrap.style.display = show ? '' : 'none';
        });
    }

    // --- Proteger la página admin contra acceso directo
    function guardAdminPage() {
        const p = location.pathname.replace(/\\/g, '/').toLowerCase();
        if (p.endsWith('/pages/admin.html') || p.endsWith('admin.html')) {
            if (!currentIsAdmin()) location.replace('index.html');
        }
    }

    function guardVendedorPage() {
        const p = location.pathname.replace(/\\/g, '/').toLowerCase();
        if (p.endsWith('/pages/vendedor.html') || p.endsWith('vendedor.html')) {
            if (!currentIsVendedor()) location.replace('index.html');
        }
    }

    // --- Actualizar después del login (mismo tab)
    function hookLoginForm() {
        const form = document.getElementById('loginForm');
        if (!form) return;
        form.addEventListener('submit', () => {
            // dar tiempo a login.js para guardar usuarioActivo
            setTimeout(() => {
                toggleAdminLinks();
                // --- Redirigir vendedor a dashboard vendedor
                const s = getSesion();
                if (s && s.rol === 'Vendedor') {
                    location.href = '/pages/vendedor.html';
                }
            }, 0);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        toggleAdminLinks();
        guardAdminPage();
        // --- Vendedor
        toggleVendedorLinks();
        guardVendedorPage();
        hookLoginForm();
    });

    // Solo dispara entre pestañas, pero lo dejamos por si acaso
    window.addEventListener('storage', (e) => {
        if (e.key === LSK_SESION) {
            toggleAdminLinks();
            // --- Vendedor
            toggleVendedorLinks();
        }
    });
})();
