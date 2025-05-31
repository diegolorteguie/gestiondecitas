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

  const tablaBody = document.getElementById('tbody-pacientes');
  const filtro = document.getElementById('search-pacientes');

  function cargarPacientes() {
    const atenciones = JSON.parse(localStorage.getItem('atenciones')) || [];
    const filtroValor = filtro.value.trim().toLowerCase();
    const pacientesMap = new Map(); // Usar un mapa para agrupar por DNI

    atenciones.forEach(atencion => {
      if (!pacientesMap.has(atencion.dni)) {
        pacientesMap.set(atencion.dni, {
          nombre: atencion.nombre,
          dni: atencion.dni,
          edad: atencion.edad,
          totalAtenciones: 0,
          ultimaAtencion: ''
        });
      }
      const paciente = pacientesMap.get(atencion.dni);
      paciente.totalAtenciones++;
      // Actualizar la última atención si la fecha actual es posterior
      if (!paciente.ultimaAtencion || atencion.fecha > paciente.ultimaAtencion) {
        paciente.ultimaAtencion = atencion.fecha;
      }
    });

    let pacientes = Array.from(pacientesMap.values());

    // Filtrar pacientes
    pacientes = pacientes.filter(paciente => {
      return (
        paciente.nombre.toLowerCase().includes(filtroValor) ||
        paciente.dni.includes(filtroValor)
      );
    });

    // Ordenar pacientes por nombre
    pacientes.sort((a, b) => a.nombre.localeCompare(b.nombre));

    tablaBody.innerHTML = '';

    if (pacientes.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No se encontraron pacientes.</td></tr>`;
      return;
    }

    pacientes.forEach(paciente => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${paciente.nombre}</td>
        <td>${paciente.dni}</td>
        <td>${paciente.edad}</td>
        <td>${paciente.totalAtenciones}</td>
        <td>${paciente.ultimaAtencion || 'N/A'}</td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  // Evento de búsqueda
  filtro.addEventListener('keyup', cargarPacientes);

  // Cargar pacientes al inicio
  cargarPacientes();
});