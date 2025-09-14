// /js/admin.js
(() => {
    'use strict';

    // ====== DOM
    const root = document.getElementById('sectionRoot');
    const links = document.querySelectorAll('.admin-menu .list-group-item');

    // ====== Helpers generales
    const j = (x, f = null) => { try { return JSON.parse(x) ?? f; } catch { return f; } };
    const s = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    const CLP = (v) => Number(v || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isSameDay = (iso, ref = startOfDay) => {
        if (!iso) return false;
        const d = new Date(iso);
        return d.getFullYear() === ref.getFullYear() &&
            d.getMonth() === ref.getMonth() &&
            d.getDate() === ref.getDate();
    };
    const timeHHMM = (iso) => new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    const dateCL = (iso) => new Date(iso).toLocaleDateString('es-CL');
    const yyyymm = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const yyyy = (d) => `${d.getFullYear()}`;
    const groupBy = (arr, keyFn) => arr.reduce((acc, x) => { const k = keyFn(x); (acc[k] ||= []).push(x); return acc; }, {});

    // ====== Roles (sin segmentación)
    const ROLES = Object.freeze({
        ADMIN: 'Administrador',
        VENDEDOR: 'Vendedor',
        CLIENTE: 'Cliente',
    });

    // ====== Validaciones (RUN y email)
    const DUOC_DOMAINS = ['@duoc.cl', '@profesor.duoc.cl'];
    const validarEmailPermitido = (email) => {
        const e = String(email || '').toLowerCase();
        return ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'].some(dom => e.endsWith(dom));
    };
    const limpiarRut = (rut) => String(rut || '').trim().toUpperCase().replace(/[^0-9K]/g, '');
    function dvRut(numero) {
        let M = 0, S = 1;
        for (; numero; numero = Math.floor(numero / 10)) S = (S + numero % 10 * (9 - M++ % 6)) % 11;
        return S ? String(S - 1) : 'K';
    }
    function validarRut(rut) {
        const r = limpiarRut(rut);
        if (r.length < 7 || r.length > 9) return false;
        const cuerpo = r.slice(0, -1), dv = r.slice(-1);
        if (!/^\d+$/.test(cuerpo)) return false;
        return dvRut(Number(cuerpo)) === dv;
    }

    // ====== Loaders (localStorage-first)
    function loadCatalog() {
        let cat = j(localStorage.getItem('catalogo'), null);
        if (!Array.isArray(cat) || cat.length === 0) {
            if (Array.isArray(window.products)) {
                cat = window.products.map(p => ({
                    code: p.code ?? p.id ?? '',
                    productName: p.productName ?? p.nombre ?? '',
                    category: p.category ?? p.categoria ?? '',
                    price: Number(p.price ?? p.precio ?? 0),
                    stock: Number(p.stock ?? 0),
                    capacidadDiaria: Number.isFinite(p.capacidadDiaria) ? p.capacidadDiaria : 20,
                    img: p.img ?? '',
                    desc: p.desc ?? ''
                }));
                s('catalogo', cat);
            } else {
                cat = [];
            }
        } else {
            cat = cat.map(p => ({ ...p, capacidadDiaria: Number.isFinite(p.capacidadDiaria) ? p.capacidadDiaria : 20 }));
            s('catalogo', cat);
        }
        return cat;
    }
    const loadUsuarios = () => j(localStorage.getItem('usuarios'), []) || [];
    const saveUsuarios = (arr) => s('usuarios', arr);
    const loadOrdenes = () => j(localStorage.getItem('ordenes'), []) || [];
    function loadVentas() {
        let v = j(localStorage.getItem('ventas'), null);
        if (!Array.isArray(v)) {
            const ords = loadOrdenes();
            v = [];
            for (const o of ords) {
                for (const it of (o.items || [])) {
                    v.push({
                        productId: it.productId ?? it.code,
                        qty: Number(it.qty || it.cantidad || 0),
                        price: Number(it.price || 0),
                        tsISO: o.tsISO || o.fecha || new Date().toISOString()
                    });
                }
            }
        }
        return v;
    }

    // ====== Usuarios (solo rol por defecto, sin segmento)
    function ensureUsuariosConRol() {
        const lista = (j(localStorage.getItem('usuarios'), []) || []).map(u => ({
            ...u,
            rol: u.rol || ROLES.CLIENTE,
            bloqueado: Boolean(u.bloqueado),     // default false si no existía
        }));
        localStorage.setItem('usuarios', JSON.stringify(lista));
        return lista;
    }


    // ====== Crear Vendedor (Dashboard)
    // === Reemplaza esta función en /js/admin.js
    function crearVendedor({ rut, nombre, correo, password }) {
        // Si existe UserStore.crearVendedor, pásale la password
        if (window.UserStore?.crearVendedor) {
            return window.UserStore.crearVendedor({ rut, nombre, correo, password });
        }

        // Fallback local
        const limpiarRut = (rut) => String(rut || '').trim().toUpperCase().replace(/[^0-9K]/g, '');
        function dvRut(numero) { let M = 0, S = 1; for (; numero; numero = Math.floor(numero / 10))S = (S + numero % 10 * (9 - M++ % 6)) % 11; return S ? String(S - 1) : 'K' }
        function validarRut(rut) { const r = limpiarRut(rut); if (r.length < 7 || r.length > 9) return false; const c = r.slice(0, -1), dv = r.slice(-1); if (!/^\d+$/.test(c)) return false; return dvRut(Number(c)) === dv }
        function validarEmailPermitido(email) { const e = String(email || '').toLowerCase(); return ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'].some(dom => e.endsWith(dom)) }

        const loadUsuarios = () => JSON.parse(localStorage.getItem('usuarios') || '[]');
        const saveUsuarios = (arr) => localStorage.setItem('usuarios', JSON.stringify(arr));
        const findUserByEmail = (email) => {
            const e = String(email || '').toLowerCase();
            return loadUsuarios().find(u => String(u.correo || '').toLowerCase() === e) || null;
        };

        // Validaciones
        if (!rut || !validarRut(rut)) throw new Error('RUN inválido. Ej: 19011022K (sin puntos ni guión).');
        if (!nombre || nombre.trim().length === 0 || nombre.length > 50) throw new Error('Nombre requerido (máx 50).');
        if (!correo || !validarEmailPermitido(correo)) throw new Error('Correo no permitido. Usa @duoc.cl, @profesor.duoc.cl o @gmail.com.');
        if (findUserByEmail(correo)) throw new Error('Ya existe un usuario con ese correo.');
        if (!password || password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');

        const hoy = new Date().toISOString();
        const lista = loadUsuarios();

        const nuevo = {
            id: Date.now(),
            rut: limpiarRut(rut),
            nombre: nombre.trim(),
            apellido: '',
            correo: String(correo).toLowerCase(),
            password: String(password),     // *** se guarda tal cual (mockup)
            fechaNacimiento: null,
            rol: 'Vendedor',
            bloqueado: false,
            creadoEn: hoy,
            protegido: false,
        };

        lista.push(nuevo);
        saveUsuarios(lista);
        return nuevo;
    }


    // === Reemplaza COMPLETA la función renderDashboard() en /js/admin.js
    function renderDashboard() {
        const catalogo = loadCatalog();
        const ventas = loadVentas();
        const usuarios = ensureUsuariosConRol();

        const umbral = (p) => Number.isFinite(p.stockCritico) ? p.stockCritico : 5;
        const bajo = catalogo.filter(p => Number(p.stock || 0) <= umbral(p)).length;

        const today = new Date();
        const yyyymm = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const ventasMes = ventas.filter(x => String(x.tsISO).slice(0, 7) === yyyymm(today));
        const totalUnidMes = ventasMes.reduce((a, x) => a + Number(x.qty || 0), 0);
        const totalCLPMes = ventasMes.reduce((a, x) => a + Number(x.qty || 0) * Number(x.price || 0), 0);
        const ordMes = loadOrdenes().filter(o => String(o.tsISO || '').slice(0, 7) === yyyymm(today)).length || ventasMes.length || 1;
        const ticket = totalCLPMes / ordMes;

        const admins = usuarios.filter(u => u.rol === 'Administrador').length;
        const vendedores = usuarios.filter(u => u.rol === 'Vendedor').length;
        const clientes = usuarios.filter(u => u.rol === 'Cliente').length;

        root.innerHTML = `
    <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
      <div>
        <h1 class="h4 mb-1">Dashboard</h1>
        <div class="text-secondary small">Resumen de ${today.toLocaleString('es-CL', { month: 'long', year: 'numeric' })}</div>
      </div>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-12 col-md-6 col-xl-3">
        <div class="card stat-card h-100"><div class="card-body d-flex justify-content-between align-items-center">
          <div><div class="text-secondary small">Productos totales</div><div class="fs-4 fw-semibold">${catalogo.length}</div></div>
          <i class="bi bi-box-seam icon"></i>
        </div></div>
      </div>
      <div class="col-12 col-md-6 col-xl-3">
        <div class="card stat-card h-100"><div class="card-body d-flex justify-content-between align-items-center">
          <div><div class="text-secondary small">Stock bajo</div><div class="fs-4 fw-semibold">${bajo}</div></div>
          <i class="bi bi-exclamation-triangle icon"></i>
        </div></div>
      </div>
      <div class="col-12 col-md-6 col-xl-3">
        <div class="card stat-card h-100"><div class="card-body d-flex justify-content-between align-items-center">
          <div><div class="text-secondary small">Unidades vendidas (mes)</div><div class="fs-4 fw-semibold">${totalUnidMes}</div></div>
          <i class="bi bi-graph-up-arrow icon"></i>
        </div></div>
      </div>
      <div class="col-12 col-md-6 col-xl-3">
        <div class="card stat-card h-100"><div class="card-body d-flex justify-content-between align-items-center">
          <div><div class="text-secondary small">Ticket promedio</div><div class="fs-5 fw-semibold">${CLP(ticket)}</div></div>
          <i class="bi bi-receipt icon"></i>
        </div></div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-12 col-md-3">
        <div class="card h-100"><div class="card-body">
          <div class="text-secondary small">Usuarios</div>
          <div class="fs-3 fw-semibold">${usuarios.length}</div>
          <div class="small mt-2 text-secondary">Admins: ${admins} • Vendedores: ${vendedores} • Clientes: ${clientes}</div>
        </div></div>
      </div>

      <div class="col-12 col-md-9">
        <div class="card">
          <div class="card-header bg-white"><b>Crear Vendedor</b> <span class="text-secondary small ms-2">(RUN sin puntos ni guión)</span></div>
          <div class="card-body">
            <form id="formCrearVendedor" class="row g-3">
              <div class="col-12 col-md-3">
                <label class="form-label">RUN</label>
                <input type="text" class="form-control" id="venRut" placeholder="19011022K" required>
              </div>
              <div class="col-12 col-md-3">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" id="venNombre" placeholder="Nombre vendedor" required>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Correo</label>
                <input type="email" class="form-control" id="venCorreo" placeholder="nombre@duoc.cl / @profesor.duoc.cl / @gmail.com" required>
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="venPass" placeholder="Mín. 6 caracteres" required>
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label">Confirmar contraseña</label>
                <input type="password" class="form-control" id="venPass2" placeholder="Repite la contraseña" required>
              </div>
              <div class="col-12 col-md-4 d-flex align-items-end gap-2">
                <button type="submit" class="btn btn-primary w-100">Crear</button>
              </div>

              <div class="col-12">
                <div id="venMsg" class="small text-secondary"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="alert alert-light border mt-3">
      <i class="bi bi-info-circle me-2"></i>Este panel usa <code>localStorage</code>:
      <code>catalogo</code>, <code>usuarios</code>, <code>ordenes</code>, <code>ventas</code>.
    </div>
  `;

        // Hook: crear vendedor
        const form = document.getElementById('formCrearVendedor');
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const rut = document.getElementById('venRut').value.trim();
            const nombre = document.getElementById('venNombre').value.trim();
            const correo = document.getElementById('venCorreo').value.trim();
            const pass = document.getElementById('venPass').value;
            const pass2 = document.getElementById('venPass2').value;
            const msg = document.getElementById('venMsg');

            if (pass !== pass2) {
                msg.className = 'small text-danger';
                msg.textContent = 'Las contraseñas no coinciden.';
                return;
            }
            if (!pass || pass.length < 6) {
                msg.className = 'small text-danger';
                msg.textContent = 'La contraseña debe tener al menos 6 caracteres.';
                return;
            }

            try {
                const creado = crearVendedor({ rut, nombre, correo, password: pass });
                msg.className = 'small text-success';
                msg.textContent = `Vendedor creado: ${creado.nombre} (${creado.correo}). Ya puede iniciar sesión.`;
                form.reset();
            } catch (e) {
                msg.className = 'small text-danger';
                msg.textContent = e.message || 'No se pudo crear el vendedor.';
            }
        }, false);
    }


    function renderProductos() {
        const catalogo = loadCatalog();
        const ventas = loadVentas();

        const vendidasHoy = new Map();
        for (const v of ventas) {
            if (!isSameDay(v.tsISO)) continue;
            const id = v.productId;
            vendidasHoy.set(id, (vendidasHoy.get(id) || 0) + Number(v.qty || 0));
        }

        const rows = catalogo.map(p => {
            const id = p.code || p.id;
            const vHoy = vendidasHoy.get(id) || 0;
            const prodHoy = Math.max(0, Number(p.capacidadDiaria || 20) - vHoy);
            return `
        <tr>
          <td>${id || ''}</td>
          <td>${p.productName || p.nombre || ''}</td>
          <td>${p.category || p.categoria || ''}</td>
          <td class="text-end">${CLP(p.price || p.precio || 0)}</td>
          <td class="text-end">${Number(p.stock || 0)}</td>
          <td class="text-end">${vHoy}</td>
          <td class="text-end">${Number(p.capacidadDiaria || 20)}</td>
          <td class="text-end">${prodHoy}</td>
        </tr>`;
        }).join('');

        root.innerHTML = `
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h1 class="h5 mb-0">Productos</h1>
        <span class="small text-secondary">“Producibles hoy” = capacidadDiaria − vendidas hoy (capacidad por defecto 20)</span>
      </div>
      <div class="card">
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Código</th><th>Producto</th><th>Categoría</th>
                <th class="text-end">Precio</th><th class="text-end">Stock</th>
                <th class="text-end">Vendidas (hoy)</th>
                <th class="text-end">Capacidad día</th>
                <th class="text-end">Producibles hoy</th>
              </tr>
            </thead>
            <tbody>${rows || `<tr><td colspan="8"><div class="empty-state">Sin productos</div></td></tr>`}</tbody>
          </table>
        </div>
      </div>
    `;
    }

    function renderUsuarios() {
        const usuarios = ensureUsuariosConRol();

        const parseAge = (u) => {
            const f = u.fechaNacimiento || u.nacimiento || null;
            if (!f) return null;
            const d = new Date(f);
            if (Number.isNaN(d)) return null;
            const today = new Date();
            let age = today.getFullYear() - d.getFullYear();
            const m = today.getMonth() - d.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
            return age;
        };
        const domainOf = (email = "") => String(email).toLowerCase().split('@')[1] || '';
        const isDuoc = (u) => ['duoc.cl', 'profesor.duoc.cl'].includes(domainOf(u.correo));
        const isMayor75 = (u) => {
            const age = parseAge(u);
            return age !== null && age >= 75;
        };

        // Grupos
        const vendedores = usuarios.filter(u => u.rol === ROLES.VENDEDOR);
        const duoc = usuarios.filter(isDuoc);
        const mayores = usuarios.filter(isMayor75);
        // "Usuarios normales": clientes SIN beneficios (no DUOC y no 75+)
        const normales = usuarios.filter(u => u.rol === ROLES.CLIENTE && !isDuoc(u) && !isMayor75(u));

        const countRoles = (rol) => usuarios.filter(u => u.rol === rol).length;

        // Filas para tablas de la derecha
        const row = (u) => `
    <tr>
      <td>${u.nombre || ''} ${u.apellido || ''}</td>
      <td>${u.correo || ''}</td>
      <td>${u.rut || ''}</td>
      <td>${parseAge(u) ?? ''}</td>
      <td>${u.rol || ''}</td>
    </tr>`;

        // Filas para tabla de vendedores (col izquierda)
        const rowVend = (u) => `
    <tr>
      <td>${u.nombre || ''} ${u.apellido || ''}</td>
      <td>${u.correo || ''}</td>
      <td>${u.rut || ''}</td>
    </tr>`;

        root.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="h5 mb-0">Usuarios</h1>
      <span class="small text-secondary">Fuente: <code>localStorage.usuarios</code></span>
    </div>

    <div class="row g-3">
      <!-- Columna izquierda: resumen + vendedores -->
      <div class="col-12 col-xl-3">
        <!-- Resumen (más pequeño) -->
        <div class="card mb-3">
          <div class="card-body py-3">
            <div class="text-secondary small">Admins</div>
            <div class="fs-3 fw-semibold">${countRoles(ROLES.ADMIN)}</div>
            <div class="text-secondary small mt-2">Vendedores</div>
            <div class="fs-5 fw-semibold">${countRoles(ROLES.VENDEDOR)}</div>
            <div class="text-secondary small mt-2">Clientes</div>
            <div class="fs-5 fw-semibold">${countRoles(ROLES.CLIENTE)}</div>
          </div>
        </div>

        <!-- Vendedores -->
        <div class="card">
          <div class="card-header bg-white d-flex justify-content-between">
            <strong>Vendedores</strong>
            <span class="badge text-bg-light">${vendedores.length}</span>
          </div>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0">
              <thead class="table-light"><tr><th>Nombre</th><th>Correo</th><th>RUT</th></tr></thead>
              <tbody>${vendedores.length ? vendedores.map(rowVend).join('') : `<tr><td colspan="3" class="text-center text-secondary">Sin registros</td></tr>`}</tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Columna derecha: 3 tablas -->
      <div class="col-12 col-xl-9">
        <!-- Usuarios normales -->
        <div class="card mb-3">
          <div class="card-header bg-white"><b>Usuarios</b> <span class="text-secondary small">(${normales.length})</span></div>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0">
              <thead class="table-light"><tr><th>Nombre</th><th>Correo</th><th>RUT</th><th>Edad</th><th>Rol</th></tr></thead>
              <tbody>${normales.length ? normales.map(row).join('') : `<tr><td colspan="5" class="text-center text-secondary">Sin registros</td></tr>`}</tbody>
            </table>
          </div>
        </div>

        <!-- Mayores de 75 -->
        <div class="card mb-3">
          <div class="card-header bg-white"><b>Usuarios mayores</b> <span class="text-secondary small">(${mayores.length})</span></div>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0">
              <thead class="table-light"><tr><th>Nombre</th><th>Correo</th><th>RUT</th><th>Edad</th><th>Rol</th></tr></thead>
              <tbody>${mayores.length ? mayores.map(row).join('') : `<tr><td colspan="5" class="text-center text-secondary">Sin registros</td></tr>`}</tbody>
            </table>
          </div>
        </div>

        <!-- DUOC -->
        <div class="card">
          <div class="card-header bg-white"><b>Usuarios DUOC</b> <span class="text-secondary small">(${duoc.length})</span></div>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0">
              <thead class="table-light"><tr><th>Nombre</th><th>Correo</th><th>RUT</th><th>Edad</th><th>Rol</th></tr></thead>
              <tbody>${duoc.length ? duoc.map(row).join('') : `<tr><td colspan="5" class="text-center text-secondary">Sin registros</td></tr>`}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
    }


    function renderOrdenes() {
        const ordenes = loadOrdenes().filter(o => isSameDay(o.tsISO || o.fecha));
        const itemsHTML = (it = []) => it.map(x => {
            const id = x.productId ?? x.code ?? '';
            const qty = Number(x.qty || x.cantidad || 0);
            const price = Number(x.price || 0);
            return `<li class="list-group-item d-flex justify-content-between"><span>${id}</span><span>x${qty} • ${CLP(price)}</span></li>`;
        }).join('');

        const rows = ordenes.map(o => `
      <tr>
        <td>${timeHHMM(o.tsISO || o.fecha)}</td>
        <td>${o.usuarioCorreo || o.email || '—'}</td>
        <td class="text-end">${CLP(Number(o.total || 0))}</td>
        <td class="text-end">${(o.items || []).reduce((a, x) => a + Number(x.qty || x.cantidad || 0), 0)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary" data-order="${o.id}">Ver</button>
        </td>
      </tr>
    `).join('');

        root.innerHTML = `
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h1 class="h5 mb-0">Órdenes de hoy</h1>
        <span class="small text-secondary">${dateCL(new Date())}</span>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="table align-middle mb-0" id="tblOrdenes">
            <thead class="table-light">
              <tr>
                <th>Hora</th><th>Cliente</th>
                <th class="text-end">Total</th><th class="text-end">Items</th><th class="text-end"></th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="5"><div class="empty-state">Hoy no hay órdenes.</div></td></tr>`}
            </tbody>
          </table>
        </div>
      </div>

      <div id="ordenDetalle" class="mt-3"></div>
    `;

        document.querySelectorAll('[data-order]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-order');
                const ord = ordenes.find(x => String(x.id) === String(id));
                const det = document.getElementById('ordenDetalle');
                if (!ord) { det.innerHTML = ''; return; }
                det.innerHTML = `
          <div class="card">
            <div class="card-header bg-white d-flex justify-content-between">
              <strong>Pedido #${ord.id || '—'}</strong>
              <span class="text-secondary small">${timeHHMM(ord.tsISO || ord.fecha)}</span>
            </div>
            <ul class="list-group list-group-flush">${itemsHTML(ord.items)}</ul>
            <div class="card-footer bg-white text-end">
              <strong>Total: ${CLP(Number(ord.total || 0))}</strong>
            </div>
          </div>
        `;
            });
        });
    }

    function renderReportes() {
        const ventas = loadVentas();
        const catalogo = loadCatalog();
        const byId = new Map(catalogo.map(p => [p.code || p.id, p]));

        root.innerHTML = `
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h1 class="h5 mb-0">Reportes de venta</h1>
        <div class="d-flex align-items-center gap-2">
          <label class="small text-secondary">Período</label>
          <select id="repPeriodo" class="form-select form-select-sm" style="width:auto">
            <option value="hoy">Hoy</option>
            <option value="mes" selected>Este mes</option>
            <option value="anio">Este año</option>
            <option value="todo">Todo</option>
          </select>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <div class="card h-100">
            <div class="card-header bg-white"><strong>Ventas por día/mes/año</strong></div>
            <div class="table-responsive">
              <table class="table align-middle mb-0" id="tblPeriodos">
                <thead class="table-light"><tr><th>Periodo</th><th class="text-end">Unidades</th><th class="text-end">Monto</th></tr></thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="card h-100">
            <div class="card-header bg-white d-flex justify-content-between">
              <strong>Top / Bottom productos</strong>
              <span class="badge text-bg-light">según período</span>
            </div>
            <div class="row g-0">
              <div class="col-12 col-md-6 border-end">
                <div class="table-responsive">
                  <table class="table align-middle mb-0" id="tblTop">
                    <thead class="table-light"><tr><th>#</th><th>Producto</th><th class="text-end">Unid</th></tr></thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="table-responsive">
                  <table class="table align-middle mb-0" id="tblBottom">
                    <thead class="table-light"><tr><th>#</th><th>Producto</th><th class="text-end">Unid</th></tr></thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

        const sel = document.getElementById('repPeriodo');
        const tbodyP = document.querySelector('#tblPeriodos tbody');
        const tbodyTop = document.querySelector('#tblTop tbody');
        const tbodyBottom = document.querySelector('#tblBottom tbody');

        const inPeriodo = {
            hoy: (v) => isSameDay(v.tsISO),
            mes: (v) => String(v.tsISO).slice(0, 7) === yyyymm(today),
            anio: (v) => String(v.tsISO).slice(0, 4) === yyyy(today),
            todo: (_) => true
        };

        function recompute() {
            const cand = ventas.filter(inPeriodo[sel.value]);

            let perGroup = {};
            if (sel.value === 'hoy' || sel.value === 'mes') {
                perGroup = groupBy(cand, v => dateCL(v.tsISO));
            } else if (sel.value === 'anio') {
                perGroup = groupBy(cand, v => String(v.tsISO).slice(0, 7));
            } else {
                perGroup = groupBy(cand, v => String(v.tsISO).slice(0, 4));
            }

            const rowsP = Object.entries(perGroup).map(([k, arr]) => {
                const unid = arr.reduce((a, x) => a + Number(x.qty || 0), 0);
                const monto = arr.reduce((a, x) => a + Number(x.qty || 0) * Number(x.price || 0), 0);
                return `<tr><td>${k}</td><td class="text-end">${unid}</td><td class="text-end">${CLP(monto)}</td></tr>`;
            }).join('');
            tbodyP.innerHTML = rowsP || `<tr><td colspan="3"><div class="empty-state">Sin ventas en el período.</div></td></tr>`;

            const byProd = {};
            for (const v of cand) {
                const pid = v.productId;
                byProd[pid] = (byProd[pid] || 0) + Number(v.qty || 0);
            }
            const pares = Object.entries(byProd).map(([pid, unid]) => {
                const p = byId.get(pid);
                const nombre = p?.productName || p?.nombre || pid || '(desconocido)';
                return { pid, nombre, unid };
            });

            const top = [...pares].sort((a, b) => b.unid - a.unid).slice(0, 10);
            const bottom = [...pares].sort((a, b) => a.unid - b.unid).slice(0, 10);

            tbodyTop.innerHTML = top.length
                ? top.map((x, i) => `<tr><td>${i + 1}</td><td>${x.nombre}</td><td class="text-end">${x.unid}</td></tr>`).join('')
                : `<tr><td colspan="3"><div class="empty-state">Sin datos</div></td></tr>`;

            tbodyBottom.innerHTML = bottom.length
                ? bottom.map((x, i) => `<tr><td>${i + 1}</td><td>${x.nombre}</td><td class="text-end">${x.unid}</td></tr>`).join('')
                : `<tr><td colspan="3"><div class="empty-state">Sin datos</div></td></tr>`;
        }

        sel.addEventListener('change', recompute);
        recompute();
    }

    // Reemplaza toda tu función renderAjustes() por esta
    function renderAjustes() {
        const ADMIN_EMAIL_PROTEGIDO = 'pasteleriamilsabores.fm@gmail.com';
        let usuarios = ensureUsuariosConRol();

        // --- helpers de clasificación
        const domainOf = (email = "") => String(email).toLowerCase().split('@')[1] || '';
        const isDuoc = (u) => ['duoc.cl', 'profesor.duoc.cl'].includes(domainOf(u.correo));
        const parseAge = (u) => {
            const f = u.fechaNacimiento || u.nacimiento || null;
            if (!f) return null;
            const d = new Date(f);
            if (Number.isNaN(d)) return null;
            const t = new Date();
            let age = t.getFullYear() - d.getFullYear();
            const m = t.getMonth() - d.getMonth();
            if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
            return age;
        };
        const isMayor75 = (u) => {
            const a = parseAge(u);
            return a !== null && a >= 75;
        };
        const isNormalCliente = (u) => u.rol === ROLES.CLIENTE && !isDuoc(u) && !isMayor75(u);
        const isProtected = (u) => Boolean(u.protegido) || String(u.correo || '').toLowerCase() === ADMIN_EMAIL_PROTEGIDO;

        // IMPORTANTE: no damos la opción "Administrador" en el selector
        const ROLE_OPTIONS_EDITABLE = [ROLES.VENDEDOR, ROLES.CLIENTE];

        // estado UI (filtros y orden)
        let filtroTipo = 'todos'; // 'todos' | 'normal' | 'duoc' | 'mayor'
        let orderDesc = true;    // edad desc por defecto
        let qSearch = '';

        // componentes de celda
        const makeRoleSelect = (u) => {
            // Si es administrador, no permitir editar ni ver esa opción en otros usuarios
            if (u.rol === ROLES.ADMIN) {
                return `
        <select class="form-select form-select-sm" disabled>
          <option selected>${ROLES.ADMIN}</option>
        </select>
      `;
            }
            // Solo Vendedor / Cliente
            return `
      <select class="form-select form-select-sm" data-role="${u.id}" ${isProtected(u) ? 'disabled' : ''}>
        ${ROLE_OPTIONS_EDITABLE.map(r => `<option value="${r}" ${u.rol === r ? 'selected' : ''}>${r}</option>`).join('')}
      </select>
    `;
        };

        const makeBlockSwitch = (u) => `
    <div class="form-check form-switch d-inline-block">
      <input class="form-check-input" type="checkbox" role="switch" data-block="${u.id}" ${u.bloqueado ? 'checked' : ''} ${isProtected(u) ? 'disabled' : ''}>
    </div>
  `;
        const makeDeleteBtn = (u) => `
    <button class="btn btn-sm ${isProtected(u) ? 'btn-outline-secondary' : 'btn-outline-danger'}" data-del="${u.id}" ${isProtected(u) ? 'disabled' : ''}>
      <i class="bi bi-trash"></i>
    </button>
  `;

        // filas
        const rowTrab = (u, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${u.nombre || ''} ${u.apellido || ''}</td>
      <td>${u.correo || ''} ${isProtected(u) ? '<span class="badge bg-light text-dark ms-1">Protegido</span>' : ''}</td>
      <td>${u.rut || ''}</td>
      <td>${parseAge(u) ?? ''}</td>
      <td style="min-width:160px">${makeRoleSelect(u)}</td>
      <td class="text-center">${makeBlockSwitch(u)}</td>
      <td class="text-end" style="width:70px">${makeDeleteBtn(u)}</td>
    </tr>
  `;
        const rowUsr = (u, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${u.nombre || ''} ${u.apellido || ''}</td>
      <td>${u.correo || ''}</td>
      <td>${u.rut || ''}</td>
      <td>${parseAge(u) ?? ''}</td>
      <td style="min-width:160px">${makeRoleSelect(u)}</td>
      <td class="text-center">${makeBlockSwitch(u)}</td>
      <td class="text-end" style="width:70px">${makeDeleteBtn(u)}</td>
    </tr>
  `;

        // render base
        root.innerHTML = `
    <h1 class="h5 mb-3">Ajustes</h1>

    <!-- Trabajadores (Admins + Vendedores) -->
    <div class="card mb-3">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <div><strong>Trabajadores</strong> <span class="text-secondary small">(Administradores y Vendedores)</span></div>
        <span class="badge text-bg-light" id="ajTrabCount">0</span>
      </div>
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th style="width:50px">#</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>RUT</th>
              <th>Edad</th>
              <th>Rol</th>
              <th class="text-center">Bloqueado</th>
              <th class="text-end" style="width:70px">Acción</th>
            </tr>
          </thead>
          <tbody id="ajTrabBody"></tbody>
        </table>
      </div>
    </div>

    <!-- Usuarios (Clientes) -->
    <div class="card">
      <div class="card-header bg-white d-flex flex-wrap gap-2 align-items-center justify-content-between">
        <div><strong>Usuarios</strong> <span class="text-secondary small">(Clientes)</span></div>
        <div class="d-flex gap-2 align-items-center">
          <input id="ajBuscar" class="form-control form-control-sm" placeholder="Buscar nombre o correo" style="width:240px">
          <select id="ajFiltroTipo" class="form-select form-select-sm" style="width:170px">
            <option value="todos">Todos</option>
            <option value="normal">Normales</option>
            <option value="duoc">DUOC</option>
            <option value="mayor">Mayores 75</option>
          </select>
          <button id="ajOrdenEdad" class="btn btn-sm btn-outline-secondary" type="button">
            Orden: Edad <span data-dir>↓</span>
          </button>
          <span class="badge text-bg-light" id="ajUsrCount">0</span>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th style="width:50px">#</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>RUT</th>
              <th>Edad</th>
              <th>Rol</th>
              <th class="text-center">Bloqueado</th>
              <th class="text-end" style="width:70px">Acción</th>
            </tr>
          </thead>
          <tbody id="ajUsrBody"></tbody>
        </table>
      </div>
      <div class="card-footer bg-white small text-secondary">
        • “Bloqueado” impide comprar (pero permite navegar e iniciar sesión).<br>
        • La cuenta del administrador principal está marcada como “Protegido”.
      </div>
    </div>
  `;

        const tbodyTrab = document.getElementById('ajTrabBody');
        const tbodyUsr = document.getElementById('ajUsrBody');
        const countTrab = document.getElementById('ajTrabCount');
        const countUsr = document.getElementById('ajUsrCount');

        // filtros UI
        const txtBuscar = document.getElementById('ajBuscar');
        const selTipo = document.getElementById('ajFiltroTipo');
        const btnOrden = document.getElementById('ajOrdenEdad');
        const spanDir = btnOrden.querySelector('[data-dir]');

        function save() {
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }

        function renderTrabajadores() {
            const trabajadores = usuarios.filter(u => u.rol === ROLES.ADMIN || u.rol === ROLES.VENDEDOR);
            countTrab.textContent = trabajadores.length;
            tbodyTrab.innerHTML = trabajadores.length
                ? trabajadores.map(rowTrab).join('')
                : `<tr><td colspan="8" class="text-center text-secondary py-4">Sin trabajadores</td></tr>`;
        }

        function renderUsuariosTabla() {
            // base: solo clientes
            let list = usuarios.filter(u => u.rol === ROLES.CLIENTE);

            // filtro tipo
            if (filtroTipo === 'normal') list = list.filter(isNormalCliente);
            else if (filtroTipo === 'duoc') list = list.filter(isDuoc);
            else if (filtroTipo === 'mayor') list = list.filter(isMayor75);

            // búsqueda
            if (qSearch) {
                const q = qSearch;
                list = list.filter(u =>
                    String(u.nombre || '').toLowerCase().includes(q) ||
                    String(u.correo || '').toLowerCase().includes(q)
                );
            }

            // orden por edad (desc/asc). Nulos al final
            const ageVal = (u) => {
                const a = parseAge(u);
                return a === null ? -1 : a;
            };
            list.sort((a, b) => {
                const A = ageVal(a), B = ageVal(b);
                if (A === -1 && B === -1) return 0;
                if (A === -1) return 1;
                if (B === -1) return -1;
                return orderDesc ? (B - A) : (A - B);
            });

            countUsr.textContent = list.length;
            tbodyUsr.innerHTML = list.length
                ? list.map(rowUsr).join('')
                : `<tr><td colspan="8" class="text-center text-secondary py-4">Sin usuarios</td></tr>`;
        }

        function refreshAll() {
            renderTrabajadores();
            renderUsuariosTabla();
        }

        // listeners tabla (delegación, aplica a ambas tablas)
        root.addEventListener('change', (ev) => {
            const roleSel = ev.target.closest('[data-role]');
            if (roleSel) {
                const id = Number(roleSel.getAttribute('data-role'));
                const u = usuarios.find(x => Number(x.id) === id);
                if (!u || isProtected(u)) return;

                // Guardia extra: impedir elegir "Administrador"
                if (roleSel.value === ROLES.ADMIN) {
                    alert('No se puede asignar el rol Administrador desde esta pantalla.');
                    roleSel.value = u.rol; // revertir
                    return;
                }

                u.rol = roleSel.value;
                save();
                refreshAll(); // puede mover de sección
                return;
            }
            const sw = ev.target.closest('[data-block]');
            if (sw) {
                const id = Number(sw.getAttribute('data-block'));
                const u = usuarios.find(x => Number(x.id) === id);
                if (!u) return;
                if (isProtected(u)) { sw.checked = !!u.bloqueado; return; }
                u.bloqueado = sw.checked;
                save();
                return;
            }
        });

        root.addEventListener('click', (ev) => {
            const btn = ev.target.closest('[data-del]');
            if (!btn) return;
            const id = Number(btn.getAttribute('data-del'));
            const u = usuarios.find(x => Number(x.id) === id);
            if (!u || isProtected(u)) return;
            if (!confirm(`¿Eliminar la cuenta de ${u.nombre || ''} (${u.correo})? Esta acción no se puede deshacer.`)) return;
            usuarios = usuarios.filter(x => Number(x.id) !== id);
            save();
            refreshAll();
        });

        // filtros de usuarios (clientes)
        txtBuscar.addEventListener('input', () => { qSearch = txtBuscar.value.trim().toLowerCase(); renderUsuariosTabla(); });
        selTipo.addEventListener('change', () => { filtroTipo = selTipo.value; renderUsuariosTabla(); });
        btnOrden.addEventListener('click', () => {
            orderDesc = !orderDesc;
            spanDir.textContent = orderDesc ? '↓' : '↑';
            renderUsuariosTabla();
        });

        // render inicial
        refreshAll();
    }




    // ====== Router simple
    function showSection(id) {
        links.forEach(a => a.classList.toggle('active', a.dataset.section === id));
        switch (id) {
            case 'dashboard': renderDashboard(); break;
            case 'productos': renderProductos(); break;
            case 'usuarios': renderUsuarios(); break;
            case 'ordenes': renderOrdenes(); break;
            case 'reportes': renderReportes(); break;
            case 'ajustes': renderAjustes(); break;
            default: renderDashboard(); break;
        }
    }

    links.forEach(a => a.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(a.dataset.section);
    }));

    // inicial
    showSection('dashboard');

    // refresco si cambia localStorage
    window.addEventListener('storage', (e) => {
        if (['catalogo', 'usuarios', 'ordenes', 'ventas'].includes(e.key)) {
            const current = document.querySelector('.admin-menu .list-group-item.active')?.dataset.section || 'dashboard';
            showSection(current);
        }
    });
})();
