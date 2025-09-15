// js/perfil.js
// Script para la página de perfil de usuario


// Obtiene el usuario activo desde la sesión
function getUserProfile() {
    if (typeof leerSesion !== 'function' || typeof getUsuarios !== 'function') {
        alert('No se puede acceder a los datos de usuario.');
        return { nombre: '', correo: '', direccion: '' };
    }
    const sesion = leerSesion();
    if (!sesion || !sesion.correo) {
        alert('No hay usuario logueado.');
        return { nombre: '', correo: '', direccion: '' };
    }
    const usuarios = getUsuarios();
    const user = usuarios.find(u => u.correo === sesion.correo);
    if (!user) {
        alert('Usuario no encontrado.');
        return { nombre: '', correo: '', direccion: '' };
    }
    return {
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        correo: user.correo,
        direccion: user.direccion || '',
        run: user.run || '',
        creadoEn: user.creadoEn || '',
        beneficios: user.beneficios || {},
        telefono: user.telefono || '',
        nacimiento: user.nacimiento || '',
        codigo: user.codigo || '',
        estado: user.estado || 'Activo',
    };
}

function setUserProfile(profile) {
    if (typeof leerSesion !== 'function' || typeof getUsuarios !== 'function' || typeof setUsuarios !== 'function' || typeof guardarSesion !== 'function') {
        alert('No se puede guardar el perfil.');
        return;
    }
    let sesion = leerSesion();
    if (!sesion || !sesion.correo) return;
    let usuarios = getUsuarios();
    const idx = usuarios.findIndex(u => u.correo === sesion.correo);
    if (idx === -1) return;
    // Si el email cambia, verificar que no exista otro usuario con ese correo
    if (profile.correo !== sesion.correo) {
        if (usuarios.some(u => u.correo === profile.correo)) {
            alert('El correo ya está registrado por otro usuario.');
            return;
        }
    }
    usuarios[idx].nombre = profile.nombre || '';
    usuarios[idx].apellido = profile.apellido || '';
    usuarios[idx].correo = profile.correo;
    usuarios[idx].direccion = profile.direccion;

    // Recalcular todos los beneficios al editar perfil
    let nacimiento = usuarios[idx].nacimiento || null;
    let codigo = usuarios[idx].codigo || '';
    let beneficios = (typeof calcularBeneficiosUsuario === 'function')
        ? calcularBeneficiosUsuario({ correo: profile.correo, nacimiento, codigo })
        : usuarios[idx].beneficios || {};
    usuarios[idx].beneficios = beneficios;

    setUsuarios(usuarios);
    // Si el email cambió, actualizar la sesión
    if (profile.correo !== sesion.correo) {
        sesion.correo = profile.correo;
    }
    // Actualizar nombre y apellido en la sesión también
    sesion.nombre = profile.nombre;
    sesion.apellido = profile.apellido;
    // Actualizar beneficios en la sesión
    sesion.beneficios = beneficios;
    // Guardar en sessionStorage y localStorage
    guardarSesion(sesion, true);
    // Forzar refresco inmediato del navbar si la función existe
    if (typeof window.renderNavbarSession === 'function') {
        window.renderNavbarSession();
    }
}


function mostrarPerfil() {
    const user = getUserProfile();
    document.getElementById('user-name').textContent = user.nombre;
    document.getElementById('user-lastname').textContent = user.apellido;
    document.getElementById('user-email').textContent = user.correo;
    document.getElementById('user-address').textContent = user.direccion;
    if (document.getElementById('user-run'))
        document.getElementById('user-run').textContent = user.run;
    if (document.getElementById('user-creadoEn'))
        document.getElementById('user-creadoEn').textContent = user.creadoEn ? new Date(user.creadoEn).toLocaleDateString('es-CL') : '-';
    if (document.getElementById('user-telefono'))
        document.getElementById('user-telefono').textContent = user.telefono || '-';
    if (document.getElementById('user-nacimiento'))
        document.getElementById('user-nacimiento').textContent = user.nacimiento ? new Date(user.nacimiento).toLocaleDateString('es-CL') : '-';
    if (document.getElementById('user-codigo'))
        document.getElementById('user-codigo').textContent = user.codigo || '-';
    if (document.getElementById('user-estado'))
        document.getElementById('user-estado').textContent = user.estado || 'Activo';
    if (document.getElementById('user-nombre-bienvenida'))
        document.getElementById('user-nombre-bienvenida').textContent = user.nombre;
    // Beneficios
    const ul = document.getElementById('user-beneficios');
    if (ul) {
        ul.innerHTML = '';
        if (user.beneficios) {
            if (user.beneficios.descuento && user.beneficios.descuento > 0) {
                ul.innerHTML += `<li>Descuento especial: <strong>${user.beneficios.descuento}%</strong></li>`;
            }
            if (user.beneficios.tortaGratisCumple) {
                ul.innerHTML += `<li>Torta gratis en tu cumpleaños</li>`;
            }
        }
        if (!ul.innerHTML) {
            ul.innerHTML = '<li>No tienes beneficios especiales actualmente.</li>';
        }
    }
}


function mostrarFormularioEdicion() {
    const user = getUserProfile();
    const cardBody = document.querySelector('.card-body');
    cardBody.innerHTML = `
        <h5 class="card-title">Editar Perfil</h5>
        <form id="edit-profile-form">
            <div class="mb-3">
                <label for="edit-nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="edit-nombre" value="${user.nombre}" required>
            </div>
            <div class="mb-3">
                <label for="edit-apellido" class="form-label">Apellido</label>
                <input type="text" class="form-control" id="edit-apellido" value="${user.apellido}" required>
            </div>
            <div class="mb-3">
                <label for="edit-email" class="form-label">Email</label>
                <input type="email" class="form-control" id="edit-email" value="${user.correo}" required>
            </div>
            <div class="mb-3">
                <label for="edit-direccion" class="form-label">Dirección</label>
                <input type="text" class="form-control" id="edit-direccion" value="${user.direccion || ''}">
            </div>
            <button type="submit" class="btn btn-success">Guardar</button>
            <button type="button" class="btn btn-secondary ms-2" id="cancel-edit-btn">Cancelar</button>
        </form>
    `;
    document.getElementById('cancel-edit-btn').addEventListener('click', () => {
        cardBody.innerHTML = originalCardBody;
        mostrarPerfil();
        document.getElementById('edit-profile-btn').addEventListener('click', mostrarFormularioEdicion);
    });
    document.getElementById('edit-profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const nuevoPerfil = {
            nombre: document.getElementById('edit-nombre').value,
            apellido: document.getElementById('edit-apellido').value,
            correo: document.getElementById('edit-email').value,
            direccion: document.getElementById('edit-direccion').value
        };
        pendingProfile = nuevoPerfil;
        // Mostrar modal de confirmación (solo una instancia)
        if (confirmModalInstance) {
            confirmModalInstance.show();
        }
    });
}

// Guardar el contenido original para restaurar después de editar
let originalCardBody;
let pendingProfile = null;
let confirmModalInstance = null;

document.addEventListener('DOMContentLoaded', function() {
    const cardBody = document.querySelector('.card-body');
    originalCardBody = cardBody.innerHTML;
    mostrarPerfil();
    document.getElementById('edit-profile-btn').addEventListener('click', mostrarFormularioEdicion);

    // Modal confirmación: inicializar solo una vez
    const confirmModal = document.getElementById('confirmModal');
    const confirmSaveBtn = document.getElementById('confirmSaveBtn');
    if (confirmModal && window.bootstrap) {
        confirmModalInstance = bootstrap.Modal.getOrCreateInstance(confirmModal);
    }
    if (confirmModal && confirmSaveBtn) {
        confirmSaveBtn.addEventListener('click', function() {
            if (pendingProfile) {
                setUserProfile(pendingProfile);
                const cardBody = document.querySelector('.card-body');
                cardBody.innerHTML = originalCardBody;
                mostrarPerfil();
                document.getElementById('edit-profile-btn').addEventListener('click', mostrarFormularioEdicion);
                // Mensaje de éxito
                const alert = document.createElement('div');
                alert.className = 'alert alert-success mt-3';
                alert.textContent = '¡Perfil actualizado correctamente!';
                cardBody.prepend(alert);
                setTimeout(() => alert.remove(), 2500);
                pendingProfile = null;
                // Refrescar navbar si la función existe
                if (typeof window.renderNavbarSession === 'function') {
                    window.renderNavbarSession();
                }
            }
            // Cerrar modal correctamente
            if (confirmModalInstance) confirmModalInstance.hide();
        });
    }
});
