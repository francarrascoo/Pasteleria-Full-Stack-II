// /js/admin.js
(() => {
    'use strict';

    // ====== DOM
    const root = document.getElementById('sectionRoot');
    const links = document.querySelectorAll('.admin-menu .list-group-item');

    // ====== Helpers
    const j = (x, f = null) => { try { return JSON.parse(x) ?? f; } catch { return f; } };
    const s = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    const CLP = (v) => Number(v || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isSameDay = (iso, ref = startOfDay) => {
        if (!iso) return false;
        const d = new Date(iso);
        return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();
    };
    const timeHHMM = (iso) => new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    const dateCL = (iso) => new Date(iso).toLocaleDateString('es-CL');
    const yyyymm = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const yyyy = (d) => `${d.getFullYear()}`;
    const groupBy = (arr, keyFn) => arr.reduce((acc, x) => { const k = keyFn(x); (acc[k] ||= []).push(x); return acc; }, {});

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

    // ====== Secciones
    function renderDashboard() {
        const catalogo = loadCatalog();
        const ventas = loadVentas();

        const umbral = (p) => Number.isFinite(p.stockCritico) ? p.stockCritico : 5;
        const bajo = catalogo.filter(p => Number(p.stock || 0) <= umbral(p)).length;

        const ventasMes = ventas.filter(x => String(x.tsISO).slice(0, 7) === yyyymm(today));
        const totalUnidMes = ventasMes.reduce((a, x) => a + Number(x.qty || 0), 0);
        const totalCLPMes = ventasMes.reduce((a, x) => a + Number(x.qty || 0) * Number(x.price || 0), 0);
        const ordMes = loadOrdenes().filter(o => String(o.tsISO || '').slice(0, 7) === yyyymm(today)).length || ventasMes.length || 1;
        const ticket = totalCLPMes / ordMes;

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

      <div class="alert alert-light border">
        <i class="bi bi-info-circle me-2"></i>Este panel usa <code>localStorage</code>:
        <code>catalogo</code>, <code>usuarios</code>, <code>ordenes</code>, <code>ventas</code>.
      </div>
    `;
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
        const usuarios = loadUsuarios();

        const parseAge = (u) => {
            const f = u.fechaNacimiento || u.nacimiento || null;
            if (!f) return null;
            const d = new Date(f);
            if (Number.isNaN(d)) return null;
            let age = today.getFullYear() - d.getFullYear();
            const m = today.getMonth() - d.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
            return age;
        };
        const domainOf = (email = "") => String(email).toLowerCase().split('@')[1] || '';

        const gmails = usuarios.filter(u => domainOf(u.correo) === 'gmail.com');
        const gmails75 = gmails.filter(u => {
            const age = parseAge(u);
            return age !== null && age >= 75;
        });
        const duoc = usuarios.filter(u => ['duoc.cl', 'profesor.duoc.cl'].includes(domainOf(u.correo)));

        const list = (arr) => arr.map(u => `<li class="list-group-item d-flex justify-content-between"><span>${u.correo}</span><span class="text-muted small">${u.nombre || ''}</span></li>`).join('');

        root.innerHTML = `
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h1 class="h5 mb-0">Usuarios</h1>
        <span class="small text-secondary">Fuente: <code>localStorage.usuarios</code></span>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-4">
          <div class="card h-100">
            <div class="card-header bg-white d-flex justify-content-between">
              <strong>Gmails comunes</strong>
              <span class="badge text-bg-light">${gmails.length}</span>
            </div>
            <ul class="list-group list-group-flush">
              ${gmails.length ? list(gmails) : `<li class="list-group-item text-muted text-center">Sin registros</li>`}
            </ul>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="card h-100">
            <div class="card-header bg-white d-flex justify-content-between">
              <strong>Gmails 75+ (si hay fecha)</strong>
              <span class="badge text-bg-light">${gmails75.length}</span>
            </div>
            <ul class="list-group list-group-flush">
              ${gmails75.length ? list(gmails75) : `<li class="list-group-item text-muted text-center">Sin registros</li>`}
            </ul>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="card h-100">
            <div class="card-header bg-white d-flex justify-content-between">
              <strong>Correos DUOC UC</strong>
              <span class="badge text-bg-light">${duoc.length}</span>
            </div>
            <ul class="list-group list-group-flush">
              ${duoc.length ? list(duoc) : `<li class="list-group-item text-muted text-center">Sin registros</li>`}
            </ul>
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
            if (sel.value === 'hoy') {
                perGroup = groupBy(cand, v => dateCL(v.tsISO));
            } else if (sel.value === 'mes') {
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

    function renderAjustes() {
        root.innerHTML = `
      <h1 class="h5 mb-3">Ajustes</h1>
      <div class="card">
        <div class="card-body">
          <p class="mb-0 text-secondary">Por ahora sin configuración. Agregaremos opciones en la siguiente iteración.</p>
        </div>
      </div>
    `;
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
