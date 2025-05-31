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

  // Función para obtener y procesar datos de atenciones
  function obtenerDatosAtenciones() {
    const atenciones = JSON.parse(localStorage.getItem('atenciones')) || [];
    const tiposAtencion = {};
    const atencionesPorMes = {};

    atenciones.forEach(atencion => {
      // Contar por tipo de atención
      tiposAtencion[atencion.tipoAtencion] = (tiposAtencion[atencion.tipoAtencion] || 0) + 1;

      // Contar por mes
      const fecha = new Date(atencion.fecha);
      const mes = fecha.toLocaleString('es-ES', { month: 'long', year: 'numeric' }); // "junio de 2024"
      atencionesPorMes[mes] = (atencionesPorMes[mes] || 0) + 1;
    });

    // Ordenar los meses cronológicamente
    const mesesOrdenados = Object.keys(atencionesPorMes).sort((a, b) => {
        const dateA = new Date(a.split(' de ')[1], obtenerNumeroMes(a.split(' de ')[0]), 1);
        const dateB = new Date(b.split(' de ')[1], obtenerNumeroMes(b.split(' de ')[0]), 1);
        return dateA - dateB;
    });

    const atencionesMesValores = mesesOrdenados.map(mes => atencionesPorMes[mes]);


    return {
      tiposAtencion: {
        labels: Object.keys(tiposAtencion),
        data: Object.values(tiposAtencion)
      },
      atencionesPorMes: {
        labels: mesesOrdenados,
        data: atencionesMesValores
      }
    };
  }

  function obtenerNumeroMes(nombreMes) {
    const meses = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
      'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    return meses[nombreMes.toLowerCase()];
  }


  // Función para crear los gráficos
  function crearGraficos() {
    const datos = obtenerDatosAtenciones();

    // Gráfico de Atenciones por Tipo
    const ctxTipo = document.getElementById('graficoAtencionesTipo');
    if (ctxTipo) {
      new Chart(ctxTipo, {
        type: 'pie', // O 'bar', 'doughnut'
        data: {
          labels: datos.tiposAtencion.labels,
          datasets: [{
            label: 'Atenciones por Tipo',
            data: datos.tiposAtencion.data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Distribución de Atenciones por Tipo'
            }
          }
        }
      });
    }

    // Gráfico de Atenciones por Mes
    const ctxMes = document.getElementById('graficoAtencionesMes');
    if (ctxMes) {
        new Chart(ctxMes, {
            type: 'line',
            data: {
                labels: datos.atencionesPorMes.labels,
                datasets: [{
                    label: 'Número de Atenciones',
                    data: datos.atencionesPorMes.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Atenciones'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Mes'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Atenciones Registradas por Mes'
                    }
                }
            }
        });
    }
  }

  // Llamar a la función para crear los gráficos
  // Asegúrate de incluir la librería Chart.js en tu HTML de reportes.html
  // <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  if (typeof Chart !== 'undefined') {
    crearGraficos();
  } else {
    console.warn("Chart.js no está cargado. Asegúrate de incluirlo en reportes.html");
    // Mensaje alternativo o fallback si Chart.js no se carga
    const graphContainer = document.getElementById('contenedor-graficos');
    if(graphContainer) {
        graphContainer.innerHTML = '<p style="text-align: center; color: #e74c3c; font-weight: bold;">No se pueden mostrar los gráficos. La librería Chart.js no está cargada correctamente.</p>';
    }
  }
});