// ===============================
// EventPass | Funcionalidad JS
// Catálogo, filtros, compra,
// estados, asientos y servicio SOA
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const buscarEvento = document.getElementById("buscarEvento");
  const tipoEvento = document.getElementById("tipoEvento");
  const tipoAccesoFiltro = document.getElementById("tipoAccesoFiltro");
  const fechaFiltro = document.getElementById("fechaFiltro");

  const btnBuscarEventos = document.getElementById("btnBuscarEventos");
  const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");
  const eventosContainer = document.getElementById("eventosContainer");
  const eventCards = document.querySelectorAll(".event-card");

  const botonesSeleccionar = document.querySelectorAll(".seleccionar-evento");
  const eventoSeleccionado = document.getElementById("eventoSeleccionado");

  const formCompra = document.getElementById("formCompra");
  const btnReservar = document.getElementById("btnReservar");
  const btnCancelarCompra = document.getElementById("btnCancelarCompra");

  const nombreCliente = document.getElementById("nombreCliente");
  const correoCliente = document.getElementById("correoCliente");
  const telefonoCliente = document.getElementById("telefonoCliente");
  const tipoAcceso = document.getElementById("tipoAcceso");
  const numeroBoletos = document.getElementById("numeroBoletos");
  const zonaAsignada = document.getElementById("zonaAsignada");
  const metodoPago = document.getElementById("metodoPago");
  const datosContacto = document.getElementById("datosContacto");

  const estadoProceso = document.getElementById("estadoProceso");
  const estadoBoleto = document.getElementById("estadoBoleto");
  const estadoPago = document.getElementById("estadoPago");
  const totalCompra = document.getElementById("totalCompra");

  const seats = document.querySelectorAll(".seat");

  const formRegistroEvento = document.getElementById("formRegistroEvento");
  const btnActualizarEvento = document.getElementById("btnActualizarEvento");

  const btnConsultarEstado = document.getElementById("btnConsultarEstado");
  const folioBusqueda = document.getElementById("folioBusqueda");
  const resultadoEstado = document.getElementById("resultadoEstado");

  let asientoSeleccionado = null;
  let folioGenerado = "";
  let compraConfirmada = false;

  const precios = {
    General: 500,
    Preferente: 900,
    VIP: 1500,
  };

  // ===============================
  // Utilidades
  // ===============================

  function mostrarAlerta(mensaje, tipo = "info") {
    const alerta = document.createElement("div");
    alerta.className = `alerta alerta-${tipo}`;
    alerta.textContent = mensaje;

    document.body.appendChild(alerta);

    setTimeout(() => {
      alerta.classList.add("visible");
    }, 100);

    setTimeout(() => {
      alerta.classList.remove("visible");
      setTimeout(() => alerta.remove(), 300);
    }, 3000);
  }

  function generarFolio() {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const numero = Math.floor(Math.random() * 9000) + 1000;
    return `EVT-${anio}-${numero}`;
  }

  function actualizarTotal() {
    const acceso = tipoAcceso.value;
    const cantidad = Number(numeroBoletos.value) || 0;

    if (!acceso || !precios[acceso]) {
      totalCompra.textContent = "$0.00";
      return;
    }

    const total = precios[acceso] * cantidad;
    totalCompra.textContent = `$${total.toLocaleString("es-MX")}.00`;
  }

  function limpiarResultadoEstado() {
    resultadoEstado.className = "status-result";
    resultadoEstado.innerHTML =
      "<p>Ingresa un folio para consultar el estado de la transacción.</p>";
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validarTelefono(telefono) {
    return /^[0-9]{10}$/.test(telefono);
  }

  function validarCompra() {
    if (!eventoSeleccionado.value.trim()) {
      mostrarAlerta("Primero selecciona un evento del catálogo.", "error");
      return false;
    }

    if (!nombreCliente.value.trim()) {
      mostrarAlerta("Ingresa el nombre del usuario.", "error");
      nombreCliente.focus();
      return false;
    }

    if (!validarEmail(correoCliente.value.trim())) {
      mostrarAlerta("Ingresa un correo electrónico válido.", "error");
      correoCliente.focus();
      return false;
    }

    if (!validarTelefono(telefonoCliente.value.trim())) {
      mostrarAlerta("El teléfono debe contener 10 dígitos.", "error");
      telefonoCliente.focus();
      return false;
    }

    if (!tipoAcceso.value) {
      mostrarAlerta("Selecciona el tipo de acceso.", "error");
      tipoAcceso.focus();
      return false;
    }

    if (!numeroBoletos.value || Number(numeroBoletos.value) < 1) {
      mostrarAlerta("Selecciona al menos un boleto.", "error");
      numeroBoletos.focus();
      return false;
    }

    if (!zonaAsignada.value) {
      mostrarAlerta("Selecciona la zona o sección.", "error");
      zonaAsignada.focus();
      return false;
    }

    if (!metodoPago.value) {
      mostrarAlerta("Selecciona el método de pago.", "error");
      metodoPago.focus();
      return false;
    }

    return true;
  }

  // ===============================
  // Filtros del catálogo
  // ===============================

  function filtrarEventos() {
    const texto = buscarEvento.value.toLowerCase().trim();
    const tipo = tipoEvento.value.toLowerCase();
    const acceso = tipoAccesoFiltro.value.toLowerCase();

    let visibles = 0;

    eventCards.forEach((card) => {
      const nombre = card.dataset.nombre.toLowerCase();
      const cardTipo = card.dataset.tipo.toLowerCase();
      const cardAcceso = card.dataset.acceso.toLowerCase();

      const coincideTexto = !texto || nombre.includes(texto);
      const coincideTipo = !tipo || cardTipo === tipo;
      const coincideAcceso = !acceso || cardAcceso === acceso;

      if (coincideTexto && coincideTipo && coincideAcceso) {
        card.classList.remove("hidden");
        visibles++;
      } else {
        card.classList.add("hidden");
      }
    });

    let mensajeVacio = document.getElementById("mensajeSinEventos");

    if (visibles === 0) {
      if (!mensajeVacio) {
        mensajeVacio = document.createElement("div");
        mensajeVacio.id = "mensajeSinEventos";
        mensajeVacio.className = "status-result warning";
        mensajeVacio.innerHTML =
          "<p>No se encontraron eventos con los filtros seleccionados.</p>";
        eventosContainer.after(mensajeVacio);
      }
    } else if (mensajeVacio) {
      mensajeVacio.remove();
    }
  }

  btnBuscarEventos.addEventListener("click", filtrarEventos);

  btnLimpiarFiltros.addEventListener("click", () => {
    buscarEvento.value = "";
    tipoEvento.value = "";
    tipoAccesoFiltro.value = "";
    fechaFiltro.value = "";

    eventCards.forEach((card) => card.classList.remove("hidden"));

    const mensajeVacio = document.getElementById("mensajeSinEventos");
    if (mensajeVacio) mensajeVacio.remove();

    mostrarAlerta("Filtros limpiados correctamente.", "success");
  });

  buscarEvento.addEventListener("input", filtrarEventos);
  tipoEvento.addEventListener("change", filtrarEventos);
  tipoAccesoFiltro.addEventListener("change", filtrarEventos);

  // ===============================
  // Selección de evento
  // ===============================

  botonesSeleccionar.forEach((button) => {
    button.addEventListener("click", () => {
      const evento = button.dataset.evento;

      eventoSeleccionado.value = evento;
      estadoProceso.textContent = "En registro";
      estadoBoleto.textContent = "Disponible";
      estadoPago.textContent = "Pendiente";

      mostrarAlerta(`Evento seleccionado: ${evento}`, "success");

      document.getElementById("compra").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  // ===============================
  // Selección de asientos
  // ===============================

  seats.forEach((seat) => {
    seat.addEventListener("click", () => {
      if (seat.classList.contains("sold")) {
        mostrarAlerta("Este asiento ya está vendido.", "error");
        return;
      }

      if (seat.classList.contains("reserved")) {
        mostrarAlerta("Este asiento está reservado. Elige otro.", "warning");
        return;
      }

      seats.forEach((s) => s.classList.remove("selected"));
      seat.classList.add("selected");

      asientoSeleccionado = seat.textContent;
      mostrarAlerta(`Asiento seleccionado: ${asientoSeleccionado}`, "success");
    });
  });

  // ===============================
  // Reserva de espacio
  // ===============================

  btnReservar.addEventListener("click", () => {
    if (!eventoSeleccionado.value.trim()) {
      mostrarAlerta("Selecciona primero un evento.", "error");
      return;
    }

    if (!zonaAsignada.value) {
      mostrarAlerta("Selecciona una zona antes de reservar.", "error");
      zonaAsignada.focus();
      return;
    }

    estadoProceso.textContent = "En proceso";
    estadoBoleto.textContent = "Reservado";

    if (asientoSeleccionado) {
      const seat = Array.from(seats).find(
        (s) => s.textContent === asientoSeleccionado,
      );
      if (seat) {
        seat.classList.remove("available", "selected");
        seat.classList.add("reserved");
      }
    }

    mostrarAlerta("Espacio reservado temporalmente.", "success");
  });

  // ===============================
  // Total de compra
  // ===============================

  tipoAcceso.addEventListener("change", actualizarTotal);
  numeroBoletos.addEventListener("input", actualizarTotal);

  // ===============================
  // Confirmación de compra
  // ===============================

  formCompra.addEventListener("submit", (event) => {
    event.preventDefault();

    const datosValidos = validarCompra();

    if (!datosValidos) {
      estadoProceso.textContent = "En registro";
      return;
    }

    estadoProceso.textContent = "En proceso";
    estadoBoleto.textContent = "Reservado";
    estadoPago.textContent = "Pendiente";

    mostrarAlerta("Procesando pago...", "info");

    setTimeout(() => {
      const pagoAprobado = Math.random() > 0.25;

      if (pagoAprobado) {
        folioGenerado = generarFolio();
        compraConfirmada = true;

        estadoPago.textContent = "Aprobado";
        estadoBoleto.textContent = "Vendido";
        estadoProceso.textContent = "Confirmado";

        if (asientoSeleccionado) {
          const seat = Array.from(seats).find(
            (s) => s.textContent === asientoSeleccionado,
          );
          if (seat) {
            seat.classList.remove("available", "reserved", "selected");
            seat.classList.add("sold");
          }
        }

        resultadoEstado.className = "status-result success";
        resultadoEstado.innerHTML = `
          <h4>✅ Compra confirmada</h4>
          <p><strong>Folio:</strong> ${folioGenerado}</p>
          <p><strong>Cliente:</strong> ${nombreCliente.value}</p>
          <p><strong>Evento:</strong> ${eventoSeleccionado.value}</p>
          <p><strong>Acceso:</strong> ${tipoAcceso.value}</p>
          <p><strong>Zona:</strong> ${zonaAsignada.value}</p>
          <p><strong>Estado del pago:</strong> Aprobado</p>
        `;

        mostrarAlerta(`Compra confirmada. Folio: ${folioGenerado}`, "success");

        document.getElementById("estado").scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        compraConfirmada = false;

        estadoPago.textContent = "Rechazado";
        estadoBoleto.textContent = "Disponible";
        estadoProceso.textContent = "Cancelado";

        resultadoEstado.className = "status-result error";
        resultadoEstado.innerHTML = `
          <h4>❌ Pago rechazado</h4>
          <p>La compra no pudo confirmarse. El boleto fue liberado y vuelve a estar disponible.</p>
        `;

        mostrarAlerta(
          "Pago rechazado. Intenta con otro método de pago.",
          "error",
        );
      }
    }, 1200);
  });

  // ===============================
  // Cancelar compra
  // ===============================

  btnCancelarCompra.addEventListener("click", () => {
    estadoProceso.textContent = "En registro";
    estadoBoleto.textContent = "Disponible";
    estadoPago.textContent = "Pendiente";
    totalCompra.textContent = "$0.00";
    asientoSeleccionado = null;
    compraConfirmada = false;
    folioGenerado = "";

    seats.forEach((seat) => seat.classList.remove("selected"));

    limpiarResultadoEstado();
    mostrarAlerta("Compra cancelada.", "warning");
  });

  // ===============================
  // Registro administrativo de evento
  // ===============================

  formRegistroEvento.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombreEventoAdmin = document
      .getElementById("nombreEventoAdmin")
      .value.trim();
    const tipoEventoAdmin = document.getElementById("tipoEventoAdmin").value;
    const estadoEventoAdmin =
      document.getElementById("estadoEventoAdmin").value;
    const fechaEventoAdmin = document.getElementById("fechaEventoAdmin").value;
    const ubicacionEventoAdmin = document
      .getElementById("ubicacionEventoAdmin")
      .value.trim();
    const capacidadEventoAdmin = document.getElementById(
      "capacidadEventoAdmin",
    ).value;
    const responsableEventoAdmin = document
      .getElementById("responsableEventoAdmin")
      .value.trim();
    const precioBaseAdmin = document.getElementById("precioBaseAdmin").value;
    const imagenEventoAdmin = document
      .getElementById("imagenEventoAdmin")
      .value.trim();
    const descripcionEventoAdmin = document
      .getElementById("descripcionEventoAdmin")
      .value.trim();

    if (
      !nombreEventoAdmin ||
      !tipoEventoAdmin ||
      !estadoEventoAdmin ||
      !fechaEventoAdmin ||
      !ubicacionEventoAdmin ||
      !capacidadEventoAdmin ||
      !responsableEventoAdmin ||
      !precioBaseAdmin
    ) {
      mostrarAlerta(
        "Completa todos los campos obligatorios del evento.",
        "error",
      );
      return;
    }

    const nuevoEvento = document.createElement("article");
    nuevoEvento.className = "event-card";
    nuevoEvento.dataset.tipo = tipoEventoAdmin
      .toLowerCase()
      .includes("concierto")
      ? "concierto"
      : tipoEventoAdmin.toLowerCase().includes("deportivo")
        ? "deporte"
        : "teatro";

    nuevoEvento.dataset.acceso = "general";
    nuevoEvento.dataset.nombre = nombreEventoAdmin.toLowerCase();

    const imagenDefault =
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&auto=format&fit=crop";

    nuevoEvento.innerHTML = `
      <img
        src="${imagenEventoAdmin || imagenDefault}"
        alt="Imagen representativa de ${nombreEventoAdmin}"
      />
      <div class="event-body">
        <span class="event-type">⭐ ${tipoEventoAdmin}</span>
        <h3>${nombreEventoAdmin}</h3>
        <p>${descripcionEventoAdmin || "Evento registrado desde el módulo administrativo."}</p>

        <ul class="event-info">
          <li>📍 ${ubicacionEventoAdmin}</li>
          <li>📅 ${fechaEventoAdmin}</li>
          <li>🎫 Capacidad: <strong>${capacidadEventoAdmin}</strong></li>
          <li>📌 Estado: <strong>${estadoEventoAdmin}</strong></li>
          <li>👤 Responsable: <strong>${responsableEventoAdmin}</strong></li>
        </ul>

        <button class="btn primary seleccionar-evento" data-evento="${nombreEventoAdmin}">
          ✅ Seleccionar actividad
        </button>
      </div>
    `;

    eventosContainer.appendChild(nuevoEvento);

    const nuevoBoton = nuevoEvento.querySelector(".seleccionar-evento");
    nuevoBoton.addEventListener("click", () => {
      eventoSeleccionado.value = nombreEventoAdmin;
      estadoProceso.textContent = "En registro";
      estadoBoleto.textContent = "Disponible";
      estadoPago.textContent = "Pendiente";

      mostrarAlerta(`Evento seleccionado: ${nombreEventoAdmin}`, "success");

      document.getElementById("compra").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    formRegistroEvento.reset();
    mostrarAlerta(
      "Evento registrado correctamente y agregado al catálogo.",
      "success",
    );
  });

  btnActualizarEvento.addEventListener("click", () => {
    mostrarAlerta(
      "Vista actualizada. Los eventos registrados están disponibles en el catálogo.",
      "info",
    );
    document.getElementById("catalogo").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  // ===============================
  // Consulta de estado SOA
  // ===============================

  btnConsultarEstado.addEventListener("click", () => {
    const folio = folioBusqueda.value.trim();

    if (!folio) {
      resultadoEstado.className = "status-result warning";
      resultadoEstado.innerHTML =
        "<p>Ingresa un folio para consultar el estado.</p>";
      mostrarAlerta("Debes ingresar un folio de compra.", "warning");
      return;
    }

    if (compraConfirmada && folio === folioGenerado) {
      resultadoEstado.className = "status-result success";
      resultadoEstado.innerHTML = `
        <h4>✅ Operación encontrada</h4>
        <p><strong>Folio:</strong> ${folioGenerado}</p>
        <p><strong>Estado del proceso:</strong> Confirmado</p>
        <p><strong>Estado del boleto:</strong> Vendido</p>
        <p><strong>Estado del pago:</strong> Aprobado</p>
        <p><strong>Mensaje del servicio:</strong> Compra procesada correctamente.</p>
      `;

      mostrarAlerta("Estado consultado correctamente.", "success");
    } else {
      resultadoEstado.className = "status-result error";
      resultadoEstado.innerHTML = `
        <h4>❌ Folio no encontrado</h4>
        <p>No existe una operación confirmada con el folio ingresado.</p>
        <p>Verifica el folio o realiza una nueva compra.</p>
      `;

      mostrarAlerta("No se encontró el folio ingresado.", "error");
    }
  });

  // ===============================
  // Navegación activa
  // ===============================

  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // ===============================
  // Crear estilos de alerta desde JS
  // ===============================

  const alertaStyles = document.createElement("style");
  alertaStyles.textContent = `
    .alerta {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 9999;
      min-width: 280px;
      max-width: 380px;
      padding: 14px 18px;
      border-radius: 14px;
      font-weight: 700;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
      transform: translateY(20px);
      opacity: 0;
      transition: 0.3s ease;
    }

    .alerta.visible {
      transform: translateY(0);
      opacity: 1;
    }

    .alerta-info {
      background: #eaf2ff;
      color: #175cd3;
      border: 1px solid #b2ccff;
    }

    .alerta-success {
      background: #ecfdf3;
      color: #027a48;
      border: 1px solid #86efac;
    }

    .alerta-error {
      background: #fff1f3;
      color: #c01048;
      border: 1px solid #fda4af;
    }

    .alerta-warning {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fcd34d;
    }

    .seat.selected {
      background: #bfdbfe !important;
      color: #1d4ed8 !important;
      outline: 3px solid #60a5fa;
    }

    .nav-links a.active {
      background: #eaf2ff;
      color: #175cd3;
    }

    @media (max-width: 720px) {
      .alerta {
        left: 16px;
        right: 16px;
        bottom: 16px;
        min-width: auto;
        max-width: none;
      }
    }
  `;

  document.head.appendChild(alertaStyles);
});
