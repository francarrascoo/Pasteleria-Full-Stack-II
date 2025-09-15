(() => {
    // ====== DOM
    const root = document.getElementById('sectionRoot');
    const links = document.querySelectorAll('.admin-menu .list-group-item');

    // Helper para cargar productos desde localStorage
    function loadCatalog() {
        try {
            const cat = JSON.parse(localStorage.getItem('catalogo') || '[]');
            return Array.isArray(cat) ? cat : [];
        } catch {
            return [];
        }
    }

    // ====== Renderizadores de secciones ======
    function renderAgregarProducto() {
        const productos = loadCatalog();
        root.innerHTML = `
            <h1 class="h4 mb-3">Agregar Producto</h1>
            <form id="formAgregarProducto" class="row g-3">
                <div class="col-md-8">
                    <label class="form-label">Producto</label>
                    <select class="form-select" id="selectProducto" required>
                        ${
                            productos.length
                                ? productos.map(p =>
                                    `<option value="${p.code || p.id || ''}">${p.productName || p.nombre || '(Sin nombre)'}</option>`
                                  ).join('')
                                : '<option disabled selected>No hay productos en el catálogo</option>'
                        }
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Cantidad a agregar</label>
                    <input type="number" class="form-control" id="cantidadAgregar" min="1" value="1" required>
                </div>
                <div class="col-12">
                    <button type="submit" class="btn btn-primary">Agregar</button>
                </div>
            </form>
            <div id="agregarProductoMsg" class="mt-3"></div>
        `;

        const form = document.getElementById('formAgregarProducto');
        const select = document.getElementById('selectProducto');
        const cantidadInput = document.getElementById('cantidadAgregar');
        const msg = document.getElementById('agregarProductoMsg');

        if (form && select && cantidadInput && productos.length) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const prodId = select.value;
                const cantidad = parseInt(cantidadInput.value, 10);

                if (!prodId || isNaN(cantidad) || cantidad < 1) {
                    msg.className = 'text-danger';
                    msg.textContent = 'Selecciona un producto y una cantidad válida.';
                    return;
                }

                // Buscar producto y actualizar stock
                const idx = productos.findIndex(p => String(p.code || p.id) === prodId);
                if (idx === -1) {
                    msg.className = 'text-danger';
                    msg.textContent = 'Producto no encontrado.';
                    return;
                }
                productos[idx].stock = (parseInt(productos[idx].stock, 10) || 0) + cantidad;
                localStorage.setItem('catalogo', JSON.stringify(productos));

                msg.className = 'text-success';
                msg.textContent = `Se agregaron ${cantidad} unidades a "${productos[idx].productName || productos[idx].nombre}". Nuevo stock: ${productos[idx].stock}`;

                form.reset();
                cantidadInput.value = 1;
                // Actualizar el select para reflejar el nuevo stock si es necesario en otras vistas
            });
        }
    }

    function renderEditarProducto() {
        const productos = loadCatalog();
        root.innerHTML = `
            <h1 class="h4 mb-3">Editar Producto</h1>
            <div class="row">
                <div class="col-md-7">
                    <form id="formEditarProducto" class="row g-3">
                        <div class="col-12">
                            <label class="form-label">Producto</label>
                            <select class="form-select" id="selectEditarProducto" required>
                                ${
                                    productos.length
                                        ? productos.map(p =>
                                            `<option value="${p.code || p.id || ''}" data-img="${p.img || ''}">
                                                ${p.productName || p.nombre || '(Sin nombre)'}
                                            </option>`
                                          ).join('')
                                        : '<option disabled selected>No hay productos en el catálogo</option>'
                                }
                            </select>
                        </div>
                        <div class="col-12">
                            <label class="form-label">Nuevo nombre</label>
                            <input type="text" class="form-control" id="nuevoNombreProducto">
                        </div>
                        <div class="col-12">
                            <label class="form-label">Nueva descripción</label>
                            <textarea class="form-control" id="nuevaDescripcionProducto" rows="2"></textarea>
                        </div>
                        <div class="col-12">
                            <label class="form-label">Nuevo precio</label>
                            <input type="number" class="form-control" id="nuevoPrecioProducto" min="0">
                        </div>
                        <div class="col-12">
                            <label class="form-label">Editar stock</label>
                            <input type="number" class="form-control" id="nuevoStockProducto" min="0">
                        </div>
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
                <div class="col-md-5 d-flex align-items-start justify-content-center">
                    <div id="imgEditarProductoPreview" class="w-100 text-center mt-2">
                        <img src="" alt="Imagen producto" id="imgEditarProducto" class="img-fluid rounded shadow-sm" style="max-height:220px;display:none;">
                        <div id="imgEditarProductoMsg" class="text-secondary small mt-2"></div>
                        <div id="datosEditarProducto" class="mt-3"></div>
                    </div>
                </div>
            </div>
        `;

        const select = document.getElementById('selectEditarProducto');
        const img = document.getElementById('imgEditarProducto');
        const msg = document.getElementById('imgEditarProductoMsg');
        const datos = document.getElementById('datosEditarProducto');
        const form = document.getElementById('formEditarProducto');
        const inputNombre = document.getElementById('nuevoNombreProducto');
        const inputDesc = document.getElementById('nuevaDescripcionProducto');
        const inputPrecio = document.getElementById('nuevoPrecioProducto');
        const inputStock = document.getElementById('nuevoStockProducto');

        function updatePreview() {
            if (!select || !img) return;
            const selected = select.options[select.selectedIndex];
            const prod = productos.find(
                p => String(p.code || p.id || '') === String(selected?.value)
            );
            const imgUrl = selected ? selected.getAttribute('data-img') : '';
            if (imgUrl) {
                img.src = imgUrl;
                img.style.display = '';
                msg.textContent = '';
            } else {
                img.src = '';
                img.style.display = 'none';
                msg.textContent = 'Sin imagen disponible';
            }
            // Mostrar nombre, descripción, precio y stock actual debajo de la imagen
            if (prod) {
                datos.innerHTML = `
                    <div class="fw-semibold fs-5">${prod.productName || prod.nombre || '(Sin nombre)'}</div>
                    <div class="text-secondary small mt-1">${prod.desc || prod.descripcion || 'Sin descripción'}</div>
                    <div class="text-dark mt-1">Precio: $${prod.price != null ? Number(prod.price).toLocaleString('es-CL') : '—'}</div>
                    <div class="text-dark mt-1">Stock actual: ${prod.stock != null ? prod.stock : '—'}</div>
                `;
                // Rellenar los campos con los valores actuales
                inputNombre.value = prod.productName || prod.nombre || '';
                inputDesc.value = prod.desc || prod.descripcion || '';
                inputPrecio.value = prod.price != null ? prod.price : '';
                inputStock.value = prod.stock != null ? prod.stock : '';
            } else {
                datos.innerHTML = '';
                inputNombre.value = '';
                inputDesc.value = '';
                inputPrecio.value = '';
                inputStock.value = '';
            }
        }

        if (select) {
            select.addEventListener('change', updatePreview);
            if (productos.length) updatePreview();
        }

        if (form && select && productos.length) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const prodId = select.value;
                const idx = productos.findIndex(p => String(p.code || p.id) === prodId);
                if (idx === -1) return;

                // Actualizar los campos si tienen valor
                const nuevoNombre = inputNombre.value.trim();
                const nuevaDesc = inputDesc.value.trim();
                const nuevoPrecio = inputPrecio.value;
                const nuevoStock = inputStock.value;

                if (nuevoNombre) {
                    if (productos[idx].productName !== undefined) {
                        productos[idx].productName = nuevoNombre;
                    } else {
                        productos[idx].nombre = nuevoNombre;
                    }
                }
                if (nuevaDesc) {
                    if (productos[idx].desc !== undefined) {
                        productos[idx].desc = nuevaDesc;
                    } else {
                        productos[idx].descripcion = nuevaDesc;
                    }
                }
                if (nuevoPrecio !== '') {
                    productos[idx].price = Number(nuevoPrecio);
                }
                if (nuevoStock !== '') {
                    productos[idx].stock = Number(nuevoStock);
                }

                localStorage.setItem('catalogo', JSON.stringify(productos));

                // Mensaje de éxito
                datos.innerHTML += `<div class="text-success mt-2">Producto actualizado correctamente.</div>`;
                updatePreview();
            });
        }
    }

    function renderEliminarProducto() {
        const productos = loadCatalog();
        root.innerHTML = `
            <h1 class="h4 mb-3">Eliminar Producto</h1>
            <form id="formEliminarProducto" class="row g-3">
                <div class="col-md-8">
                    <label class="form-label">Producto</label>
                    <div class="input-group">
                        <select class="form-select" id="selectEliminarProducto" required>
                            ${
                                productos.length
                                    ? productos.map(p =>
                                        `<option value="${p.code || p.id || ''}" data-stock="${p.stock != null ? p.stock : ''}">
                                            ${p.productName || p.nombre || '(Sin nombre)'}
                                        </option>`
                                      ).join('')
                                    : '<option disabled selected>No hay productos en el catálogo</option>'
                            }
                        </select>
                        <span class="input-group-text" id="stockEliminarProducto">Stock: ${
                            productos.length && productos[0].stock != null ? productos[0].stock : '—'
                        }</span>
                    </div>
                </div>
                <div class="col-md-4 d-flex align-items-end">
                    <input type="number" class="form-control me-2" id="cantidadEliminar" min="1" value="1" style="max-width:100px;">
                    <button type="submit" class="btn btn-danger">Eliminar</button>
                </div>
            </form>
            <div id="eliminarProductoMsg" class="mt-3"></div>
        `;

        // Actualizar el stock mostrado al cambiar el producto seleccionado
        const select = document.getElementById('selectEliminarProducto');
        const stockSpan = document.getElementById('stockEliminarProducto');
        const cantidadInput = document.getElementById('cantidadEliminar');
        const msg = document.getElementById('eliminarProductoMsg');

        if (select && stockSpan) {
            select.addEventListener('change', function () {
                const selected = select.options[select.selectedIndex];
                const stock = selected ? selected.getAttribute('data-stock') : '';
                stockSpan.textContent = `Stock: ${stock !== '' ? stock : '—'}`;
            });
        }

        // Lógica para eliminar productos
        const form = document.getElementById('formEliminarProducto');
        if (form && select && cantidadInput && productos.length) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const prodId = select.value;
                const cantidad = parseInt(cantidadInput.value, 10);

                if (!prodId || isNaN(cantidad) || cantidad < 1) {
                    msg.className = 'text-danger';
                    msg.textContent = 'Selecciona un producto y una cantidad válida.';
                    return;
                }

                // Buscar producto y actualizar stock
                const idx = productos.findIndex(p => String(p.code || p.id) === prodId);
                if (idx === -1) {
                    msg.className = 'text-danger';
                    msg.textContent = 'Producto no encontrado.';
                    return;
                }
                const stockActual = parseInt(productos[idx].stock, 10) || 0;
                if (cantidad > stockActual) {
                    msg.className = 'text-danger';
                    msg.textContent = `No puedes eliminar más de las unidades disponibles. Stock actual: ${stockActual}`;
                    return;
                }

                productos[idx].stock = stockActual - cantidad;
                localStorage.setItem('catalogo', JSON.stringify(productos));

                msg.className = 'text-success';
                msg.textContent = `Se eliminaron ${cantidad} unidades de "${productos[idx].productName || productos[idx].nombre}". Nuevo stock: ${productos[idx].stock}`;

                // Actualizar el stock mostrado en el select
                select.options[select.selectedIndex].setAttribute('data-stock', productos[idx].stock);
                stockSpan.textContent = `Stock: ${productos[idx].stock}`;

                form.reset();
                cantidadInput.value = 1;
            });
        }
    }

    // ====== Router simple ======
    function showSection(id) {
        links.forEach(a => a.classList.toggle('active', a.dataset.section === id));
        switch (id) {
            case 'agregar': renderAgregarProducto(); break;
            case 'editar': renderEditarProducto(); break;
            case 'eliminar': renderEliminarProducto(); break;
            default: renderAgregarProducto(); break;
        }
    }

    links.forEach(a => a.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(a.dataset.section);
    }));

    // Inicial
    showSection('agregar');
})();
