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

  const form = document.getElementById('form-registro');
  const mensaje = document.getElementById('mensaje');
  const fechaInput = document.getElementById('fecha');

  // Establece la fecha máxima para el input de fecha
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  fechaInput.max = `${year}-${month}-${day}`;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar mensajes de error/éxito anteriores
    mensaje.style.display = 'none';
    mensaje.classList.remove('success', 'error');
    document.querySelectorAll('.form-control').forEach(input => input.classList.remove('input-error'));

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const edad = document.getElementById('edad').value;
    const tipoAtencion = document.getElementById('tipo').value;
    const fecha = document.getElementById('fecha').value;
    const diagnostico = document.getElementById('diagnostico').value.trim();

    // Validar campos
    let valid = true;
    const errorMessages = [];

    if (nombre === '') {
      valid = false;
      errorMessages.push('El nombre es obligatorio.');
      document.getElementById('nombre').classList.add('input-error');
    }
    if (dni === '' || !/^\d{8}$/.test(dni)) { // Validar DNI de 8 dígitos
      valid = false;
      errorMessages.push('El DNI debe tener 8 dígitos.');
      document.getElementById('dni').classList.add('input-error');
    }
    if (edad === '' || parseInt(edad) <= 0 || parseInt(edad) > 120) { // Validar edad entre 1 y 120
      valid = false;
      errorMessages.push('La edad debe ser un número entre 1 y 120.');
      document.getElementById('edad').classList.add('input-error');
    }
    if (tipoAtencion === '') {
      valid = false;
      errorMessages.push('Debe seleccionar un tipo de atención.');
      document.getElementById('tipo').classList.add('input-error');
    }
    if (fecha === '') {
      valid = false;
      errorMessages.push('La fecha de atención es obligatoria.');
      document.getElementById('fecha').classList.add('input-error');
    }
    // El diagnóstico puede estar vacío, no necesita validación explícita aquí.

    if (!valid) {
      mensaje.classList.add('error');
      mensaje.textContent = errorMessages.join(' ');
      mensaje.style.display = 'block';
      return;
    }

    // Generar ID único (simple para este ejemplo)
    const id = Date.now().toString();

    // Crear objeto de atención
    const nuevaAtencion = {
      id,
      nombre,
      dni,
      edad: parseInt(edad), // Asegurar que edad sea un número
      tipoAtencion,
      fecha,
      diagnostico
    };

    // Obtener atenciones existentes o inicializar un array vacío
    let atenciones = JSON.parse(localStorage.getItem('atenciones')) || [];

    // Añadir la nueva atención
    atenciones.push(nuevaAtencion);

    // Guardar en localStorage
    localStorage.setItem('atenciones', JSON.stringify(atenciones));

    // Mostrar mensaje de éxito
    mensaje.classList.add('success');
    mensaje.textContent = 'Atención registrada correctamente.';
    mensaje.style.display = 'block';

    // Limpiar formulario después de un registro exitoso
    form.reset();
    document.getElementById('fecha').max = `${year}-${month}-${day}`; // Restablecer max date

    // Opcional: Redirigir después de un tiempo
    // setTimeout(() => {
    //   window.location.href = 'atenciones.html';
    // }, 1500);
  });
});