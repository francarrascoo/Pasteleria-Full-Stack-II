// /js/navbar_greeting.js
(() => {
    'use strict';
  
    // ===== Cookies helpers (por si recuerdas sesión) =====
    function deleteCookie(name) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  
    // ===== Sesión helpers (usa user_store.js si está presente) =====
    function getSesion() {
      try { if (typeof leerSesion === 'function') return leerSesion(); } catch {}
      try { const raw = localStorage.getItem('usuarioActivo'); return raw ? JSON.parse(raw) : null; } catch { return null; }
    }
    function logout() {
      try { if (typeof limpiarSesion === 'function') limpiarSesion(); else localStorage.removeItem('usuarioActivo'); }
      catch { localStorage.removeItem('usuarioActivo'); }
      deleteCookie('usuarioCorreo'); deleteCookie('usuarioNombre');
    }
  
    // ===== Modal de confirmación (se crea si no existe) =====
    function ensureLogoutConfirmModal() {
      let el = document.getElementById('logoutConfirmModal');
      if (el) return el;
  
      el = document.createElement('div');
      el.id = 'logoutConfirmModal';
      el.className = 'modal fade';
      el.tabIndex = -1;
      el.setAttribute('aria-labelledby', 'logoutConfirmLabel');
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow rounded-4">
            <div class="modal-header border-0">
              <h5 class="modal-title" id="logoutConfirmLabel">Cerrar sesión</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              ¿Seguro que deseas cerrar tu sesión?
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger" id="confirmLogoutBtn">Cerrar sesión</button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(el);
      return el;
    }
  
    // ===== Render principal (saludo + menú) =====
    function renderGreeting() {
      const sesion = getSesion();
      const accountDropdown = document.querySelector('.account-dropdown');
      if (!accountDropdown) return;
  
      // Asegurar toggle correcto y mantener dropdown operativo
      const toggleLink =
        accountDropdown.querySelector('.nav-link[data-bs-toggle="dropdown"]') ||
        accountDropdown.querySelector('.nav-link');
      if (toggleLink) {
        toggleLink.classList.add('dropdown-toggle', 'd-flex', 'align-items-center');
        if (!toggleLink.getAttribute('data-bs-toggle')) toggleLink.setAttribute('data-bs-toggle', 'dropdown');
        if (!toggleLink.getAttribute('aria-expanded')) toggleLink.setAttribute('aria-expanded', 'false');
      }
  
      // 1) Saludo dentro del <a> (antes del ícono)
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
  
      // 2) Menú del dropdown
      const menu = accountDropdown.querySelector('.dropdown-menu');
      if (!menu) return;
  
      if (sesion) {
        menu.innerHTML = `
          <li><span class="dropdown-item-text text-muted">
            Conectado como<br><strong>${sesion.correo}</strong>
          </span></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="/pages/perfil.html">Mi cuenta</a></li>
          <li><a class="dropdown-item" href="/pages/pedidos.html">Mis pedidos</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><button class="dropdown-item" type="button" id="btn-cerrar-sesion">Cerrar sesión</button></li>
        `;
  
        // Abrir modal de confirmación
        menu.querySelector('#btn-cerrar-sesion')?.addEventListener('click', () => {
          const modalEl = ensureLogoutConfirmModal();
          const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.show();
  
          // Confirmar
          const confirmBtn = modalEl.querySelector('#confirmLogoutBtn');
          confirmBtn.onclick = () => {
            logout();
            modal.hide();
            renderGreeting(); // refrescar navbar
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
    }
  
    // Exponer por si quieres refrescar manualmente
    window.renderGreeting = renderGreeting;
  
    document.addEventListener('DOMContentLoaded', () => {
      renderGreeting();
      // Si cierras login, re-render
      document.getElementById('loginModal')?.addEventListener('hidden.bs.modal', () => renderGreeting());
      // Cambios en otra pestaña
      window.addEventListener('storage', (e) => { if (e.key === 'usuarioActivo') renderGreeting(); });
    });
  })();
  