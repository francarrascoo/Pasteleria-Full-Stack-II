// Regiones y comunas de Chile (simplificado)
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
  const regionSelect = document.getElementById('addDireccionRegion');
  if (!regionSelect) return;
  regionSelect.innerHTML = '<option value="">Selecciona…</option>' +
    regionesYComunas.map(r => `<option value="${r.nombre}">${r.nombre}</option>`).join('');
}

function cargarComunas(regionNombre) {
  const comunaSelect = document.getElementById('addDireccionComuna');
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
  const addDireccionModal = document.getElementById('addDireccionModal');
  if (addDireccionModal) {
    addDireccionModal.addEventListener('show.bs.modal', function () {
      cargarRegiones();
      cargarComunas(''); // reset comunas
    });
  }
  // Cambiar comunas al seleccionar región
  const regionSelect = document.getElementById('addDireccionRegion');
  if (regionSelect) {
    regionSelect.addEventListener('change', function () {
      cargarComunas(this.value);
    });
  }

const getCart = () => JSON.parse(localStorage.getItem("carrito") || "[]");
const getUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("usuarioActivo") || localStorage.getItem("usuarioActivo"));
  } catch { return null; }
};

const renderCart = () => {
    const carrito = getCart();
    const cont = document.getElementById("checkout-carrito");
    if (!carrito.length) {
        cont.innerHTML = `<div class="alert alert-warning">Tu carrito está vacío.</div>`;
        return false;
    }
    cont.innerHTML = `
    <table class="table">
      <thead>
        <tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr>
      </thead>
      <tbody>
        ${carrito.map(p => `
          <tr>
            <td>${p.productName}</td>
            <td>${p.cantidad}</td>
            <td>$${p.price.toLocaleString("es-CL")}</td>
            <td>$${(p.price * p.cantidad).toLocaleString("es-CL")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
    return true;
};

const renderResumen = () => {
    const carrito = getCart();
    const resumen = document.getElementById("checkout-resumen");
    if (!carrito.length) { resumen.innerHTML = ""; return; }
    const total = carrito.reduce((acc, p) => acc + p.price * p.cantidad, 0);
    const user = typeof leerSesion === 'function' ? leerSesion() : null;
    const descuento = user && user.beneficios && user.beneficios.descuento ? user.beneficios.descuento : 0;
    const despacho = 5000; // igual que en carrito.js
    const descuentoPesos = total * (descuento / 100);
    const totalFinal = total - descuentoPesos + despacho;
    resumen.innerHTML = `
      <div class="card card-resumen p-3 mb-3">
        <h5 class="mb-3">Resumen del Pedido</h5>
        <ul class="list-group mb-2">
          ${carrito.map(p => `<li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${p.productName} <span class='text-secondary'>x${p.cantidad}</span></span>
            <span>$${(p.price * p.cantidad).toLocaleString("es-CL")}</span>
          </li>`).join("")}
        </ul>
        <div class="d-flex justify-content-between">
          <span>Subtotal</span>
          <span>$${total.toLocaleString("es-CL")}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Despacho</span>
          <span>$${despacho.toLocaleString("es-CL")}</span>
        </div>
        ${descuento > 0 ? `<div class="d-flex justify-content-between">
          <span>Descuento (${descuento}%)</span>
          <span class="text-success">-$${descuentoPesos.toLocaleString("es-CL")}</span>
        </div>` : ""}
        <hr>
        <div class="d-flex justify-content-between fw-bold fs-5">
          <span>Total</span>
          <span>$${totalFinal.toLocaleString("es-CL")}</span>
        </div>
      </div>
    `;
};

function renderDirecciones() {
  const user = getUser();
  const select = document.getElementById("direccionSelect");
  select.innerHTML = "";
  let direcciones = (user && user.direcciones) ? user.direcciones : [];
  if (!direcciones.length) {
    select.innerHTML = `<option value="">No tienes direcciones guardadas</option>`;
    select.required = false;
  } else {
    select.required = true;
    direcciones.forEach((dir, i) => {
      select.innerHTML += `<option value="${i}">${dir.linea1}, ${dir.comuna}, ${dir.region}</option>`;
    });
  }
}

const updateCartCount = () => {
    const carrito = getCart();
    const badge = document.getElementById("cart-count");
    if (badge) {
        if (carrito.length) {
            badge.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
            badge.classList.remove("d-none");
    } else {
      badge.classList.add("d-none");
    }
    }
};


document.addEventListener("DOMContentLoaded", () => {
  // const hasCart = renderCart(); // Ya no se muestra la tabla
  renderResumen();
  renderDirecciones();
  updateCartCount();
  // if (!hasCart) return;

  // Botón para agregar nueva dirección
  document.getElementById("btnAddDireccion").addEventListener("click", () => {
    document.getElementById("formAddDireccion").reset();
    const modal = new bootstrap.Modal(document.getElementById("addDireccionModal"));
    modal.show();
  });

  // Guardar nueva dirección
  document.getElementById("formAddDireccion").addEventListener("submit", function(e) {
    e.preventDefault();
    const linea1 = document.getElementById("addDireccionLinea1").value.trim();
    const region = document.getElementById("addDireccionRegion").value.trim();
    const comuna = document.getElementById("addDireccionComuna").value.trim();
    if (!linea1 || !region || !comuna) return;
    let user = getUser();
    if (!user) return;
    if (!user.direcciones) user.direcciones = [];
    user.direcciones.push({ linea1, region, comuna });
    // Actualizar en local/sessionStorage
    const data = JSON.stringify(user);
    localStorage.setItem("usuarioActivo", data);
    sessionStorage.setItem("usuarioActivo", data);
    // Actualizar en lista de usuarios
    let usuarios = [];
    try { usuarios = JSON.parse(localStorage.getItem("usuarios")) || []; } catch {}
    const idx = usuarios.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      usuarios[idx].direcciones = user.direcciones;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
    renderDirecciones();
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("addDireccionModal"));
    modal.hide();
  });

  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fecha = document.getElementById("fechaEntrega").value;
    const dirSelect = document.getElementById("direccionSelect");
    const user = getUser();
    let direccion = "";
    if (user && user.direcciones && user.direcciones.length && dirSelect.value !== "") {
      direccion = user.direcciones[dirSelect.value];
      direccion = `${direccion.linea1}, ${direccion.comuna}, ${direccion.region}`;
    } else {
      return alert("Debes seleccionar o agregar una dirección de entrega");
    }
    let carrito = getCart();
    // Guardar el id de usuario en cada producto del carrito para filtrar luego
    if (user && user.id) {
      carrito = carrito.map(p => ({...p, usuarioId: user.id }));
    }
    if (!fecha) return alert("Selecciona una fecha de entrega");
    if (new Date(fecha) < new Date().setHours(0, 0, 0, 0)) {
      return alert("La fecha de entrega no puede ser en el pasado");
    }
    if (!direccion) return alert("Ingresa la dirección de entrega");
    const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
    const pedido = {
      id: Date.now(),
      fecha,
      direccion,
      estado: "Pendiente",
      carrito,
      total: carrito.reduce((acc, p) => acc + p.price * p.cantidad, 0),
      creado: new Date().toISOString()
    };
    pedidos.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    localStorage.removeItem("carrito");
    updateCartCount();
    // Mostrar modal de confirmación
    const modal = new bootstrap.Modal(document.getElementById("pedidoModal"));
    modal.show();
    // Redirigir cuando el modal se cierre
    document.getElementById("pedidoModal").addEventListener("hidden.bs.modal", () => {
      window.location.href = "pedidos.html";
    }, { once: true });
  });
});
