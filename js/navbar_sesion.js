(() => {
  'use strict';

  function getSesion() {
    try { if (typeof leerSesion === 'function') return leerSesion(); } catch { }
    try {
      const raw = localStorage.getItem('usuarioActivo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function logout() {
    try {
      if (typeof limpiarSesion === 'function') limpiarSesion();
      else localStorage.removeItem('usuarioActivo');
    } catch {
      localStorage.removeItem('usuarioActivo');
    }
    // 🔹 limpiar carrito al cerrar sesión
    localStorage.removeItem("carrito");
    if (typeof updateCartCount === "function") updateCartCount();

    if (window.location.pathname.includes("carrito.html")) {
      window.location.href = "productos.html";
    }
  }

  // ===== Modal de confirmación (se crea si no existe) =====
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


  // ===== Render principal (navbar) =====
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
        <li><a class="dropdown-item" href="/pages/perfil.html">Mis datos</a></li>
        <li><a class="dropdown-item" href="/pages/pedidos.html">Mis pedidos</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><button class="dropdown-item text-danger" type="button" id="btn-cerrar-sesion">Cerrar sesión</button></li>
      `;

      // Evento logout
      menu.querySelector('#btn-cerrar-sesion')?.addEventListener('click', () => {
        const modalEl = ensureLogoutConfirmModal();
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();

        const confirmBtn = modalEl.querySelector('#confirmLogoutBtn');
        confirmBtn.onclick = () => {
          logout();
          modal.hide();
          renderNavbarSession(); // refrescar navbar
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

    // 👇 siempre actualizar contador del carrito
    if (typeof updateCartCount === "function") updateCartCount();
  }

  // Exponer para refrescar manualmente si lo necesitas
  window.renderNavbarSession = renderNavbarSession;

  // ===== Init =====
  document.addEventListener('DOMContentLoaded', () => {
    renderNavbarSession();

    // Si cierras modal de login, refrescar menú
    document.getElementById('loginModal')?.addEventListener('hidden.bs.modal', () => renderNavbarSession());

    // Cambios en otra pestaña
    window.addEventListener('storage', (e) => {
      if (e.key === 'usuarioActivo') renderNavbarSession();
    });
  });
})();
