// APARTADO DE PACIENTES

function obtenerPacientes() {
    const pacientes = localStorage.getItem('pacientes');
    return pacientes ? JSON.parse(pacientes) : [];
  }
  
  function guardarPacientes(pacientes) {
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
  }
  
  function cargarPacientes() {
    const pacientes = obtenerPacientes();
    const tbody = document.querySelector('#tabla-pacientes tbody');
    if (!tbody) return; // Si no existe tabla, evitar error
    tbody.innerHTML = '';
  
    if (pacientes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay pacientes registrados</td></tr>';
      return;
    }
  
    pacientes.forEach(paciente => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${paciente.nombre}</td>
        <td>${paciente.edad}</td>
        <td>${paciente.direccion}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editarPaciente('${paciente.id}')"><i class="fas fa-edit"></i> Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarPaciente('${paciente.id}')"><i class="fas fa-trash-alt"></i> Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  function guardarPaciente() {
    const idInput = document.getElementById('pacienteId');
    const nombre = document.getElementById('nombre').value.trim();
    const edad = parseInt(document.getElementById('edad').value);
    const direccion = document.getElementById('direccion').value.trim();
  
    if (!nombre || isNaN(edad) || !direccion) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }
  
    let pacientes = obtenerPacientes();
  
    if (idInput.value) {
      // Editar
      pacientes = pacientes.map(p => 
        p.id === idInput.value ? { id: p.id, nombre, edad, direccion } : p
      );
    } else {
      // Agregar nuevo
      const nuevoPaciente = {
        id: crypto.randomUUID(),
        nombre,
        edad,
        direccion
      };
      pacientes.push(nuevoPaciente);
    }
  
    guardarPacientes(pacientes);
    cargarPacientes();
    resetFormPaciente();
    cargarPacientesEnSelect();
  }
  
  function editarPaciente(id) {
    const pacientes = obtenerPacientes();
    const paciente = pacientes.find(p => p.id === id);
    if (!paciente) return alert('Paciente no encontrado.');
  
    document.getElementById('pacienteId').value = paciente.id;
    document.getElementById('nombre').value = paciente.nombre;
    document.getElementById('edad').value = paciente.edad;
    document.getElementById('direccion').value = paciente.direccion;
  
    document.getElementById('btn-guardar').innerHTML = '<i class="fas fa-save"></i> Actualizar Paciente';
    document.getElementById('btn-cancelar').style.display = 'inline-block';
  }
  
  function eliminarPaciente(id) {
    if (!confirm('¿Seguro que desea eliminar este paciente?')) return;
    let pacientes = obtenerPacientes();
  
    pacientes = pacientes.filter(p => p.id !== id);
  
    // También eliminar citas relacionadas
    eliminarCitasPorPaciente(id);
  
    guardarPacientes(pacientes);
    cargarPacientes();
    cargarPacientesEnSelect();
    cargarCitas();
  }
  
  function resetFormPaciente() {
    document.getElementById('pacienteId').value = '';
    document.getElementById('form-paciente').reset();
    document.getElementById('btn-guardar').innerHTML = '<i class="fas fa-plus-circle"></i> Agregar Paciente';
    document.getElementById('btn-cancelar').style.display = 'none';
  }
  
  function cancelarEdicion() {
    resetFormPaciente();
  }
  
  // APARTADO DE CITAS
  
  function obtenerCitas() {
    const citas = localStorage.getItem('citas');
    return citas ? JSON.parse(citas) : [];
  }
  
  function guardarCitas(citas) {
    localStorage.setItem('citas', JSON.stringify(citas));
  }
  
  function cargarCitas() {
    const citas = obtenerCitas();
    const tbody = document.querySelector('#tabla-citas tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
  
    if (citas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay citas programadas</td></tr>';
      return;
    }
  
    const pacientes = obtenerPacientes();
  
    citas.forEach(cita => {
      const paciente = pacientes.find(p => p.id === cita.pacienteId);
      const nombrePaciente = paciente ? paciente.nombre : 'Paciente eliminado';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${nombrePaciente}</td>
        <td>${cita.fecha}</td>
        <td>${cita.hora}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editarCita('${cita.id}')"><i class="fas fa-edit"></i> Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarCita('${cita.id}')"><i class="fas fa-trash-alt"></i> Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  function guardarCita() {
    const idInput = document.getElementById('citaId');
    const pacienteId = document.getElementById('pacienteSelect').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
  
    if (!pacienteId || !fecha || !hora) {
      alert('Por favor, complete todos los campos.');
      return;
    }
  
    let citas = obtenerCitas();
  
    if (idInput.value) {
      // Editar cita
      citas = citas.map(c => 
        c.id === idInput.value ? { id: c.id, pacienteId, fecha, hora } : c
      );
    } else {
      // Agregar cita
      citas.push({
        id: crypto.randomUUID(),
        pacienteId,
        fecha,
        hora
      });
    }
  
    guardarCitas(citas);
    cargarCitas();
    resetFormCita();
  }
  
  function editarCita(id) {
    const citas = obtenerCitas();
    const cita = citas.find(c => c.id === id);
    if (!cita) return alert('Cita no encontrada.');
  
    document.getElementById('citaId').value = cita.id;
    document.getElementById('pacienteSelect').value = cita.pacienteId;
    document.getElementById('fecha').value = cita.fecha;
    document.getElementById('hora').value = cita.hora;
  
    document.getElementById('btn-guardar-cita').innerHTML = '<i class="fas fa-save"></i> Actualizar Cita';
    document.getElementById('btn-cancelar-cita').style.display = 'inline-block';
  }
  
  function eliminarCita(id) {
    if (!confirm('¿Seguro que desea eliminar esta cita?')) return;
    let citas = obtenerCitas();
  
    citas = citas.filter(c => c.id !== id);
  
    guardarCitas(citas);
    cargarCitas();
  }
  
  function resetFormCita() {
    document.getElementById('citaId').value = '';
    document.getElementById('form-cita').reset();
    document.getElementById('btn-guardar-cita').innerHTML = '<i class="fas fa-plus-circle"></i> Agregar Cita';
    document.getElementById('btn-cancelar-cita').style.display = 'none';
  }
  
  function cancelarEdicionCita() {
    resetFormCita();
  }
  
  // Cuando un paciente es eliminado, eliminar sus citas también
  function eliminarCitasPorPaciente(pacienteId) {
    let citas = obtenerCitas();
    citas = citas.filter(c => c.pacienteId !== pacienteId);
    guardarCitas(citas);
  }
  
  // Cargar pacientes en el select de citas
  function cargarPacientesEnSelect() {
    const pacientes = obtenerPacientes();
    const select = document.getElementById('pacienteSelect');
    if (!select) return;
    select.innerHTML = '<option value="" disabled selected>Seleccione un paciente</option>';
  
    pacientes.forEach(paciente => {
      const option = document.createElement('option');
      option.value = paciente.id;
      option.textContent = paciente.nombre;
      select.appendChild(option);
    });
  }
  
  // Mostrar próximas citas en el dashboard
  function renderUpcomingAppointments() {
    const citas = obtenerCitas();
    const pacientes = obtenerPacientes();
    const lista = document.getElementById('lista-citas');
    if (!lista) return;
    lista.innerHTML = '';
  
    const hoy = new Date().toISOString().slice(0, 10);
  
    const citasFuturas = citas
      .filter(c => c.fecha >= hoy)
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .slice(0, 5);
  
    if (citasFuturas.length === 0) {
      lista.innerHTML = '<li class="list-group-item no-data">No hay citas programadas próximamente</li>';
      return;
    }
  
    citasFuturas.forEach(cita => {
      const paciente = pacientes.find(p => p.id === cita.pacienteId);
      const nombrePaciente = paciente ? paciente.nombre : 'Paciente eliminado';
      const item = document.createElement('li');
      item.className = 'list-group-item';
      item.innerHTML = `<strong>${cita.fecha}</strong> - ${cita.hora} - ${nombrePaciente}`;
      lista.appendChild(item);
    });
  }
  
  // Mostrar pacientes en el dashboard
  function renderPatientsList() {
    const pacientes = obtenerPacientes();
    const lista = document.getElementById('lista-pacientes');
    if (!lista) return;
    lista.innerHTML = '';
  
    if (pacientes.length === 0) {
      lista.innerHTML = '<li class="list-group-item no-data">No hay pacientes registrados</li>';
      return;
    }
  
    pacientes.slice(0, 5).forEach(paciente => {
      const item = document.createElement('li');
      item.className = 'list-group-item';
      item.textContent = `${paciente.nombre} (${paciente.edad} años)`;
      lista.appendChild(item);
    });
  }


  // APARTADO DE LOGIN

  
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
  
    // Credenciales simples para demostración.
    // En una aplicación real, estas se enviarían a un servidor para autenticación.
    const validUsername = 'admin';
    const validPassword = 'password';
  
    if (loginForm) { // Asegúrate de que el formulario exista en la página
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Previene el envío predeterminado del formulario
  
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        if (username === validUsername && password === validPassword) {
          // Inicio de sesión exitoso:
          // Normalmente, aquí manejarías el almacenamiento de la sesión (por ejemplo, localStorage, sessionStorage)
          // o redirigirías basándote en una respuesta del servidor.
          alert('¡Inicio de sesión exitoso!');
          window.location.href = 'index.html'; // Redirige al dashboard
        } else {
          // Inicio de sesión fallido
          loginError.style.display = 'block'; // Muestra el mensaje de error
        }
      });
    }
  });