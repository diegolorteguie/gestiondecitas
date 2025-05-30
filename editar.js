document.addEventListener('DOMContentLoaded', () => {
  // Lógica de redirección si no está logueado
  if (!sessionStorage.getItem('usuarioLogueado')) {
    window.location.href = 'index.html'; // Redirige a index.html (la página de login unificada)
    return; // Detiene la ejecución del script si no está logueado
  }

  // Lógica para el botón "Salir"
  const logoutButton = document.getElementById('logout-general'); // Asumiendo el ID "logout-general"
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault(); // Evita la navegación por defecto
      sessionStorage.removeItem('usuarioLogueado'); // Cierra la sesión
      window.location.href = 'index.html'; // Redirige a la página de inicio (login)
    });
  }

  const form = document.getElementById('form-editar');
  const mensaje = document.getElementById('mensaje');

  // Obtener el ID a editar desde la URL o localStorage (preferible URL para recargas)
  const urlParams = new URLSearchParams(window.location.search);
  const idEditar = urlParams.get('id') || localStorage.getItem('idEditar');

  if (!idEditar) {
    alert('No se seleccionó ninguna atención para editar.');
    window.location.href = 'atenciones.html';
    return;
  }
  localStorage.setItem('idEditar', idEditar); // Guarda el ID para futuras referencias

  // Cargar lista de atenciones
  let atenciones = JSON.parse(localStorage.getItem('atenciones')) || [];
  const atencion = atenciones.find(at => at.id === idEditar);

  if (!atencion) {
    alert('Atención no encontrada.');
    window.location.href = 'atenciones.html';
    return;
  }

  // Rellenar formulario con los datos existentes
  document.getElementById('nombre').value = atencion.nombre;
  document.getElementById('dni').value = atencion.dni;
  document.getElementById('edad').value = atencion.edad;
  document.getElementById('tipoAtencion').value = atencion.tipoAtencion;
  document.getElementById('diagnostico').value = atencion.diagnostico;
  document.getElementById('fecha').value = atencion.fecha;

  // Establece la fecha máxima para el input
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  document.getElementById('fecha').max = `${year}-${month}-${day}`;


  // Evento para actualizar atención
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar mensajes de error/éxito anteriores
    mensaje.style.display = 'none';
    mensaje.classList.remove('success', 'error');
    document.querySelectorAll('.form-control').forEach(input => input.classList.remove('input-error'));


    // Validar campos
    let valid = true;
    const errorMessages = [];

    const nombre = document.getElementById('nombre').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const edad = document.getElementById('edad').value;
    const tipoAtencion = document.getElementById('tipoAtencion').value;
    const fecha = document.getElementById('fecha').value;
    const diagnostico = document.getElementById('diagnostico').value.trim(); // Diagnóstico puede ser vacío

    if (nombre === '') {
      valid = false;
      errorMessages.push('El nombre es obligatorio.');
      document.getElementById('nombre').classList.add('input-error');
    }
    if (dni === '' || !/^\d{8}$/.test(dni)) {
      valid = false;
      errorMessages.push('El DNI debe tener 8 dígitos.');
      document.getElementById('dni').classList.add('input-error');
    }
    if (edad === '' || parseInt(edad) <= 0 || parseInt(edad) > 120) {
      valid = false;
      errorMessages.push('La edad debe ser un número entre 1 y 120.');
      document.getElementById('edad').classList.add('input-error');
    }
    if (tipoAtencion === '') {
      valid = false;
      errorMessages.push('Debe seleccionar un tipo de atención.');
      document.getElementById('tipoAtencion').classList.add('input-error');
    }
    if (fecha === '') {
      valid = false;
      errorMessages.push('La fecha de atención es obligatoria.');
      document.getElementById('fecha').classList.add('input-error');
    }

    if (!valid) {
      mensaje.classList.add('error');
      mensaje.textContent = errorMessages.join(' ');
      mensaje.style.display = 'block';
      return;
    }


    // Actualizar datos
    atencion.nombre = nombre;
    atencion.dni = dni;
    atencion.edad = parseInt(edad);
    atencion.tipoAtencion = tipoAtencion;
    atencion.diagnostico = diagnostico;
    atencion.fecha = fecha;

    // Reemplazar en el array y guardar
    const index = atenciones.findIndex(at => at.id === idEditar);
    atenciones[index] = atencion;

    localStorage.setItem('atenciones', JSON.stringify(atenciones));

    // Mostrar mensaje
    mensaje.classList.add('success');
    mensaje.textContent = 'Atención actualizada correctamente.';
    mensaje.style.display = 'block';

    // Opcional: Redirigir después de un tiempo
    setTimeout(() => {
      window.location.href = 'atenciones.html';
    }, 1500);
  });
});