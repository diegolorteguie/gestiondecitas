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

  const tablaBody = document.getElementById('tbody-atenciones');
  const filtro = document.getElementById('search-atenciones');

  function cargarAtenciones() {
    const atenciones = JSON.parse(localStorage.getItem('atenciones')) || [];
    const filtroValor = filtro.value.trim().toLowerCase();

    const filtradas = atenciones.filter(at => {
      return (
        at.nombre.toLowerCase().includes(filtroValor) ||
        at.dni.includes(filtroValor)
      );
    });

    tablaBody.innerHTML = '';

    if (filtradas.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No se encontraron atenciones.</td></tr>`;
      return;
    }

    filtradas.forEach(at => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${at.nombre}</td>
        <td>${at.dni}</td>
        <td>${at.edad}</td>
        <td>${at.tipoAtencion}</td>
        <td>${at.fecha}</td>
        <td>${at.diagnostico}</td>
        <td>
          <a href="editar.html?id=${at.id}" class="btn btn-warning btn-sm">Editar</a>
          <button class="btn btn-danger btn-sm btn-eliminar" data-id="${at.id}">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  // Eliminar atención
  tablaBody.addEventListener('click', e => {
    if (e.target.classList.contains('btn-eliminar')) {
      const id = e.target.dataset.id;
      if (confirm('¿Seguro que desea eliminar esta atención?')) {
        let atenciones = JSON.parse(localStorage.getItem('atenciones')) || [];
        atenciones = atenciones.filter(at => at.id !== id);
        localStorage.setItem('atenciones', JSON.stringify(atenciones));
        cargarAtenciones(); // Volver a cargar la tabla después de eliminar
      }
    }
    // Para el botón de editar, guardar el ID en localStorage antes de redirigir
    if (e.target.classList.contains('btn-warning')) {
      const id = e.target.getAttribute('href').split('id=')[1];
      localStorage.setItem('idEditar', id);
    }
  });


  // Evento de búsqueda
  filtro.addEventListener('keyup', cargarAtenciones);

  // Cargar atenciones al inicio
  cargarAtenciones();
});