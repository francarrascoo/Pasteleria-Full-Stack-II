(() => {
  'use strict';

  // ===== Sesión
  function getSesion() {
    try { if (typeof leerSesion === 'function') return leerSesion(); } catch { }
    try {
      // Lee primero tu clave habitual y cae a 'sesion' por compatibilidad
      const raw = localStorage.getItem('usuarioActivo') || localStorage.getItem('sesion');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // ===== Cerrar sesión (UNIFICADO + REDIRECCIÓN)
  function logout() {
    try {
      if (typeof limpiarSesion === 'function') limpiarSesion();
    } catch { }

    // Claves de sesión (ambas por compatibilidad)
    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('sesion');
    sessionStorage.removeItem('usuarioActivo');
    sessionStorage.removeItem('sesion');

    // Limpia carrito
    localStorage.removeItem('carrito');
    if (typeof updateCartCount === 'function') updateCartCount();

    if (window.location.pathname.includes("carrito.html")) {
      window.location.href = "productos.html";
    } else if (window.location.pathname.includes("perfil.html")) {
      window.location.href = "index.html";
    }
    // Redirige SIEMPRE al home (ruta absoluta)
    window.location.href = '/pages/index.html';
  }

  // ===== Modal de confirmación (se crea si no existe)
  function ensureLogoutConfirmModal() {
    let el = document.getElementById('logoutConfirmModal');
    if (el) return el;

    el = document.createElement('div');
    el.id = 'logoutConfirmModal';
    el.className = 'modal fade';
    el.tabIndex = -1;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow rounded-4">
        <div class="modal-header">
          <h5 class="modal-title">Cerrar sesión</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          ¿Seguro que deseas cerrar tu sesión?
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">
            Cancelar
          </button>
          <button type="button" class="btn btn-confirm" id="confirmLogoutBtn">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(el);
    return el;
  }


  // ===== Render principal (navbar)
  function renderNavbarSession() {
    const sesion = getSesion();
    const accountDropdown = document.querySelector('.account-dropdown');
    if (!accountDropdown) return;

    // Toggle correcto del dropdown
    const toggleLink =
      accountDropdown.querySelector('.nav-link[data-bs-toggle="dropdown"]') ||
      accountDropdown.querySelector('.nav-link');
    if (toggleLink) {
      toggleLink.classList.add('dropdown-toggle', 'd-flex', 'align-items-center');
      if (!toggleLink.getAttribute('data-bs-toggle')) toggleLink.setAttribute('data-bs-toggle', 'dropdown');
      if (!toggleLink.getAttribute('aria-expanded')) toggleLink.setAttribute('aria-expanded', 'false');
    }

    // Saludo en el toggle
    if (toggleLink) {
      let saludo = toggleLink.querySelector('.saludo-usuario');
      if (sesion) {
        if (!saludo) {
          saludo = document.createElement('span');
          saludo.className = 'saludo-usuario me-2 small d-none d-md-inline text-nowrap';
          const beforeNode = toggleLink.querySelector('i, svg') || toggleLink.firstChild;
          toggleLink.insertBefore(saludo, beforeNode);
        }
        saludo.textContent = `Hola, ${sesion.nombre || 'Usuario'}!`;
      } else if (saludo) {
        saludo.remove();
      }
    }

    // Menú del dropdown
    const menu = accountDropdown.querySelector('.dropdown-menu');
    if (!menu) return;

    if (sesion) {
      menu.innerHTML = `
        <li><span class="dropdown-item-text text-muted">
          Conectado como<br><strong>${sesion.nombre} ${sesion.apellido}</strong>
        </span></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="/pages/perfil.html">Mi perfil</a></li>
        <li><a class="dropdown-item" href="/pages/pedidos.html">Mis pedidos</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><button class="dropdown-item text-danger" type="button" id="btn-cerrar-sesion">Cerrar sesión</button></li>
      `;

      // Evento logout con modal de confirmación
      menu.querySelector('#btn-cerrar-sesion')?.addEventListener('click', () => {
        const modalEl = ensureLogoutConfirmModal();
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();

        const confirmBtn = modalEl.querySelector('#confirmLogoutBtn');
        confirmBtn.onclick = () => {
          logout();
          setTimeout(() => {
            try { modal.hide(); } catch {}
            renderNavbarSession();
            // Forzar recarga para limpiar UI en todas las páginas
            window.location.reload();
          }, 100);
          // (tras redirect no se ejecuta nada más)
        };
      });
    } else {
      menu.innerHTML = `
        <li>
          <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#loginModal">
            Iniciar sesión
          </button>
        </li>
        <li><a class="dropdown-item" href="registro.html">Registrarse</a></li>
      `;
    }

    // Actualiza contador del carrito
    if (typeof updateCartCount === 'function') updateCartCount();
  }

  function renderPanelLinks() {
    // Busca el contenedor del navbar donde van los links (ajusta el selector si es necesario)
    const nav = document.querySelector('.navbar-nav.mx-auto');
    if (!nav) return;

    // Elimina enlaces previos de paneles para evitar duplicados
    nav.querySelectorAll('.nav-item-panel-link').forEach(el => el.remove());

    // Obtén usuario logueado (ajusta según tu lógica)
    const usuario = JSON.parse(localStorage.getItem('usuario_logueado') || 'null');
    if (!usuario || !usuario.rol) return;

    // Panel de Admin
    if (usuario.rol === 'Administrador') {
        const li = document.createElement('li');
        li.className = 'nav-item nav-item-panel-link';
        li.innerHTML = `<a class="nav-link" href="/pages/admin.html"><i class="bi bi-shield-lock"></i> Admin</a>`;
        nav.appendChild(li);
    }

    // Panel de Vendedor
    if (usuario.rol === 'Vendedor') {
        const li = document.createElement('li');
        li.className = 'nav-item nav-item-panel-link';
        li.innerHTML = `<a class="nav-link" href="/pages/vendedor.html"><i class="bi bi-person-badge"></i> Vendedor</a>`;
        nav.appendChild(li);
    }
}

  // Exponer por si lo necesitas
  window.renderNavbarSession = renderNavbarSession;

  // ===== Init
  document.addEventListener('DOMContentLoaded', () => {
    renderNavbarSession();
    renderPanelLinks();

    // Si cierras modal de login, refrescar menú
    document.getElementById('loginModal')?.addEventListener('hidden.bs.modal', () => renderNavbarSession());

    // Cambios en otra pestaña
    window.addEventListener('storage', (e) => {
      if (e.key === 'usuarioActivo' || e.key === 'sesion' || e.key === 'usuario_logueado') renderNavbarSession();
    });
  });
})();
