// JS para poblar los datos básicos del dashboard de perfil

document.addEventListener('DOMContentLoaded', function() {
    // Renderizar historial de pedidos del usuario
    function renderUserOrders() {
        const tbody = document.getElementById('orders-body');
        const emptyRow = document.getElementById('orders-empty');
        if (!tbody) return;
        let pedidos = [];
        try {
            pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        } catch {}
        const user = getUserProfile && getUserProfile();
        let pedidosUser = pedidos;
        if (user && user.id) {
            pedidosUser = pedidos.filter(p => p.carrito && p.carrito.length && p.carrito[0].usuarioId ? p.carrito[0].usuarioId === user.id : true);
        }
        tbody.innerHTML = '';
        if (!pedidosUser.length) {
            if (emptyRow) emptyRow.style.display = '';
            else tbody.innerHTML = '<tr><td colspan="5" class="text-center text-secondary">Aún nada por acá.</td></tr>';
            return;
        }
        if (emptyRow) emptyRow.style.display = 'none';
        pedidosUser.forEach(p => {
            tbody.innerHTML += `<tr>
                <td>${p.id}</td>
                <td>${new Date(p.creado).toLocaleDateString('es-CL')}</td>
                <td>$${p.total.toLocaleString('es-CL')}</td>
                <td><span class="badge bg-primary">${p.estado}</span></td>
                <td></td>
            </tr>`;
        });
    }

    // Sincronizar direcciones desde localStorage si no están en sessionStorage
    (function syncUserFieldsFromUsuarios() {
        let user = getUserProfile();
        if (!user) return;
        const usuarios = getUsuarios();
        const found = usuarios.find(u => u.id === user.id);
        let updated = false;
        if (found) {
            if ((!user.direcciones || user.direcciones.length === 0) && found.direcciones && found.direcciones.length > 0) {
                user.direcciones = found.direcciones;
                updated = true;
            }
            if ((!user.telefono || user.telefono === '') && found.telefono && found.telefono !== '') {
                user.telefono = found.telefono;
                updated = true;
            }
        }
        if (updated) setUserProfile(user);
    })();
    // Renderizar historial de pedidos al cargar
    renderUserOrders();
    // Al abrir el modal, poblar los campos con los datos actuales
    const editProfileModal = document.getElementById('editProfileModal');
    if (editProfileModal) {
        editProfileModal.addEventListener('show.bs.modal', function () {
            const user = getUserProfile();
            document.getElementById('profileFirstName').value = user.nombre || '';
            document.getElementById('profileLastName').value = user.apellido || '';
            document.getElementById('profileEmail').value = user.correo || '';
            if (document.getElementById('profilePhone'))
                document.getElementById('profilePhone').value = user.telefono || '';
        });
    }

    // Guardar cambios al hacer click en Guardar Cambios
    const saveProfileBtn = document.getElementById('saveProfileButton');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function () {
            const nombre = document.getElementById('profileFirstName').value.trim();
            const apellido = document.getElementById('profileLastName').value.trim();
            const telefono = document.getElementById('profilePhone') ? document.getElementById('profilePhone').value.trim() : '';
            if (!nombre || !apellido) {
                document.getElementById('editProfileForm').classList.add('was-validated');
                return;
            }
            let user = getUserProfile();
            if (!user) return;
            user.nombre = nombre;
            user.apellido = apellido;
            user.telefono = telefono;
            // Actualizar en lista de usuarios
            const usuarios = getUsuarios();
            const idx = usuarios.findIndex(u => u.id === user.id);
            if (idx !== -1) {
                usuarios[idx].nombre = nombre;
                usuarios[idx].apellido = apellido;
                usuarios[idx].telefono = telefono;
                setUsuarios(usuarios);
            }
            setUserProfile(user);
            // Cerrar modal
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editProfileModal'));
            modal.hide();
            // Refrescar datos en pantalla
            if (document.getElementById('detailNombre'))
                document.getElementById('detailNombre').textContent = nombre;
            if (document.getElementById('detailApellido'))
                document.getElementById('detailApellido').textContent = apellido;
            if (document.getElementById('detailTelefono'))
                document.getElementById('detailTelefono').textContent = telefono || '—';
            if (document.getElementById('profileName'))
                document.getElementById('profileName').textContent = nombre;
            // Refrescar navbar si existe función global
            if (typeof window.renderNavbarSession === 'function') {
                window.renderNavbarSession();
            }
        });
    }
    // ========== GUARDAR DIRECCIÓN Y ASOCIAR AL USUARIO ==========
    function getUsuarios() {
        try {
            return JSON.parse(localStorage.getItem('usuarios')) || [];
        } catch {
            return [];
        }
    }
    function setUsuarios(lista) {
        localStorage.setItem('usuarios', JSON.stringify(lista));
    }
    function getUserProfile() {
        try {
            return JSON.parse(
                sessionStorage.getItem('usuarioActivo') || localStorage.getItem('usuarioActivo')
            );
        } catch {
            return null;
        }
    }
    function setUserProfile(user) {
        const data = JSON.stringify(user);
        localStorage.setItem('usuarioActivo', data);
        sessionStorage.setItem('usuarioActivo', data);
    }

    function renderAddresses() {
        const user = getUserProfile();
        const container = document.getElementById('addresses-container');
        const empty = document.getElementById('addresses-empty');
        if (!container) return;
        // Limpia direcciones previas (excepto botón añadir)
        const prev = container.querySelectorAll('.address-card');
        prev.forEach(e => e.remove());
        if (!user || !user.direcciones || user.direcciones.length === 0) {
            if (empty) empty.style.display = '';
            return;
        }
        if (empty) empty.style.display = 'none';
        user.direcciones.forEach((dir, idx) => {
            const col = document.createElement('div');
            col.className = 'col-12 address-card';
            col.innerHTML = `
                <div class="card mb-2">
                  <div class="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                    <div>
                      <div><strong>${dir.linea1}</strong></div>
                      <div class="text-secondary small">${dir.comuna}, ${dir.region}</div>
                    </div>
                  </div>
                </div>
            `;
            container.insertBefore(col, container.querySelector('.col-12.d-flex'));
        });
    }

    // Guardar dirección al hacer click en Guardar Dirección
    const saveAddressBtn = document.getElementById('saveAddressButton');
    if (saveAddressBtn) {
        saveAddressBtn.addEventListener('click', function () {
            const linea1 = document.getElementById('addAddressLine1').value.trim();
            const region = document.getElementById('addAddressRegion').value;
            const comuna = document.getElementById('addAddressCity').value;
            if (!linea1 || !region || !comuna) {
                document.getElementById('addAddressForm').classList.add('was-validated');
                return;
            }
            let user = getUserProfile();
            if (!user) return;
            if (!user.direcciones) user.direcciones = [];
            user.direcciones.push({ linea1, region, comuna });
            // Actualizar en lista de usuarios
            const usuarios = getUsuarios();
            const idx = usuarios.findIndex(u => u.id === user.id);
            if (idx !== -1) {
                usuarios[idx].direcciones = user.direcciones;
                setUsuarios(usuarios);
            }
            setUserProfile(user);
            // Limpiar formulario y cerrar modal
            document.getElementById('addAddressForm').reset();
            document.getElementById('addAddressCity').disabled = true;
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('addAddressModal'));
            modal.hide();
            renderAddresses();
        });
    }

    // Renderizar direcciones al cargar
    renderAddresses();
    // ================== REGIONES Y COMUNAS DE CHILE ==================
    // Fuente: https://es.wikipedia.org/wiki/Anexo:Comunas_de_Chile (simplificado)
    const regionesYComunas = [
        { nombre: 'Región de Arica y Parinacota', comunas: ['Arica', 'Camarones', 'Putre', 'General Lagos'] },
        { nombre: 'Región de Tarapacá', comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'] },
        { nombre: 'Región de Antofagasta', comunas: ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'] },
        { nombre: 'Región de Atacama', comunas: ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'] },
        { nombre: 'Región de Coquimbo', comunas: ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'] },
        { nombre: 'Región de Valparaíso', comunas: ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar', 'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'San Sebastián', 'Santo Domingo', 'San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María'] },
        { nombre: 'Región Metropolitana de Santiago', comunas: ['Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'] },
        { nombre: 'Región del Libertador Gral. Bernardo O’Higgins', comunas: ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'] },
        { nombre: 'Región del Maule', comunas: ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'] },
        { nombre: 'Región de Ñuble', comunas: ['Chillán', 'Bulnes', 'Cobquecura', 'Coelemu', 'Coihueco', 'El Carmen', 'Ninhue', 'Ñiquén', 'Pemuco', 'Pinto', 'Portezuelo', 'Quillón', 'Quirihue', 'Ránquil', 'San Carlos', 'San Fabián', 'San Ignacio', 'San Nicolás', 'Treguaco', 'Yungay'] },
        { nombre: 'Región del Biobío', comunas: ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualpén', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualqui', 'Cabrero', 'Laja', 'Los Ángeles', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío', 'Antuco', 'Cañete', 'Contulmo', 'Curanilahue', 'Lebu', 'Los Álamos', 'Tirúa', 'Arauco'] },
        { nombre: 'Región de La Araucanía', comunas: ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'] },
        { nombre: 'Región de Los Ríos', comunas: ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno'] },
        { nombre: 'Región de Los Lagos', comunas: ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo'] },
        { nombre: 'Región de Aysén', comunas: ['Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', 'O’Higgins', 'Tortel', 'Chile Chico', 'Río Ibáñez'] },
        { nombre: 'Región de Magallanes y de la Antártica Chilena', comunas: ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine'] }
    ];

    function cargarRegiones() {
        const regionSelect = document.getElementById('addAddressRegion');
        if (!regionSelect) return;
        regionSelect.innerHTML = '<option value="">Selecciona…</option>' +
            regionesYComunas.map(r => `<option value="${r.nombre}">${r.nombre}</option>`).join('');
    }

    function cargarComunas(regionNombre) {
        const comunaSelect = document.getElementById('addAddressCity');
        if (!comunaSelect) return;
        comunaSelect.innerHTML = '<option value="">Selecciona…</option>';
        comunaSelect.disabled = true;
        if (!regionNombre) return;
        const region = regionesYComunas.find(r => r.nombre === regionNombre);
        if (region) {
            comunaSelect.innerHTML = '<option value="">Selecciona…</option>' +
                region.comunas.map(c => `<option value="${c}">${c}</option>`).join('');
            comunaSelect.disabled = false;
        }
    }

    // Cargar regiones al abrir el modal de dirección
    const addAddressModal = document.getElementById('addAddressModal');
    if (addAddressModal) {
        addAddressModal.addEventListener('show.bs.modal', function () {
            cargarRegiones();
            cargarComunas(''); // reset comunas
        });
    }
    // Cambiar comunas al seleccionar región
    const regionSelect = document.getElementById('addAddressRegion');
    if (regionSelect) {
        regionSelect.addEventListener('change', function () {
            cargarComunas(this.value);
        });
    }
    // Requiere getUserProfile para obtener todos los datos
    if (typeof getUserProfile !== 'function') {
        alert('Error: No se puede acceder a los datos completos del usuario. Recarga la página o contacta soporte.');
        return;
    }
    const user = getUserProfile();

    // Tarjeta lateral
    if (document.getElementById('profileName'))
        document.getElementById('profileName').textContent = user.nombre || '—';
    if (document.getElementById('profileEmailText'))
        document.getElementById('profileEmailText').textContent = user.correo || '—';
    if (document.getElementById('memberSinceText')) {
        if (user.creadoEn) {
            document.getElementById('memberSinceText').style.display = '';
            document.getElementById('memberSinceText').innerHTML = `<small>Miembro desde: ${new Date(user.creadoEn).toLocaleDateString('es-CL')}</small>`;
        } else {
            document.getElementById('memberSinceText').style.display = 'none';
        }
    }

    // Beneficios en la tarjeta avatar
    const benefitsUl = document.getElementById('profileBenefitsList');
    if (benefitsUl) {
        let html = '';
        if (user.beneficios) {
            if (user.beneficios.descuento && user.beneficios.descuento > 0) {
                html += `<li>Descuento especial: <strong>${user.beneficios.descuento}%</strong></li>`;
            }
            if (user.beneficios.tortaGratisCumple) {
                html += `<li>Torta gratis en tu cumpleaños</li>`;
            }
        }
        if (!html) {
            html = '<li class="text-muted">Sin beneficios especiales.</li>';
        }
        benefitsUl.innerHTML = html;
    }
    if (document.getElementById('pastBenefitCode'))
        document.getElementById('pastBenefitCode').value = user.codigo || '';

    // Detalles personales (tab)
    if (document.getElementById('detailNombre'))
        document.getElementById('detailNombre').textContent = user.nombre || '—';
    if (document.getElementById('detailApellido'))
        document.getElementById('detailApellido').textContent = user.apellido || '—';
    if (document.getElementById('detailCorreo'))
        document.getElementById('detailCorreo').textContent = user.correo || '—';
    if (document.getElementById('detailRun'))
        document.getElementById('detailRun').textContent = user.run || '—';
    if (document.getElementById('detailDireccion'))
        document.getElementById('detailDireccion').textContent = user.direccion || '—';
    if (document.getElementById('detailTelefono'))
        document.getElementById('detailTelefono').textContent = user.telefono || '—';
    if (document.getElementById('detailNacimiento'))
        document.getElementById('detailNacimiento').textContent = user.nacimiento ? new Date(user.nacimiento).toLocaleDateString('es-CL') : '—';
});
