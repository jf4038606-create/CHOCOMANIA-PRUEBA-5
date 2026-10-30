document.addEventListener("DOMContentLoaded", function () {

   const botonBuscar = document.querySelector(".buscar");
    const botonCarrito = document.querySelector(".carrito");

    if (botonBuscar) {
        botonBuscar.setAttribute(
            "aria-label",
            "Buscador disponible en Tienda"
        );

        botonBuscar.setAttribute(
            "title",
            "Busca productos en Tienda"
        );
    }

    if (botonCarrito) {
        botonCarrito.setAttribute(
            "aria-label",
            "Ir a la tienda"
        );

        botonCarrito.setAttribute(
            "title",
            "Visitar Tienda"
        );
    }


    const elementosAnimados = document.querySelectorAll(
        ".animacion-entrada"
    );

    if ("IntersectionObserver" in window) {

        document.body.classList.add("animaciones-listas");

        const observador = new IntersectionObserver(
            function (entradas, observer) {

                entradas.forEach(function (entrada) {

                    if (entrada.isIntersecting) {

                        entrada.target.classList.add(
                            "animacion-visible"
                        );

                        observer.unobserve(entrada.target);
                    }
                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -25px 0px"
            }
        );

        elementosAnimados.forEach(function (elemento) {
            observador.observe(elemento);
        });

    } else {

        elementosAnimados.forEach(function (elemento) {
            elemento.classList.add("animacion-visible");
        });
    }


    const notificacion = document.createElement("div");

    notificacion.className = "notificacion-contacto";

    notificacion.setAttribute("role", "status");
    notificacion.setAttribute("aria-live", "polite");
    notificacion.setAttribute("aria-atomic", "true");

    notificacion.innerHTML = `
        <span class="notificacion-icono" aria-hidden="true">
            <i class="fa-solid fa-check"></i>
        </span>

        <div class="notificacion-contenido">
            <strong class="notificacion-titulo"></strong>
            <p class="notificacion-texto"></p>
        </div>

        <button
            class="cerrar-notificacion"
            type="button"
            aria-label="Cerrar notificación"
        >
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    document.body.appendChild(notificacion);

    const iconoNotificacion = notificacion.querySelector(
        ".notificacion-icono"
    );

    const tituloNotificacion = notificacion.querySelector(
        ".notificacion-titulo"
    );

    const textoNotificacion = notificacion.querySelector(
        ".notificacion-texto"
    );

    const cerrarNotificacion = notificacion.querySelector(
        ".cerrar-notificacion"
    );

    let temporizadorNotificacion;


    function mostrarNotificacion(titulo, texto, tipo = "exito") {

        clearTimeout(temporizadorNotificacion);

        tituloNotificacion.textContent = titulo;
        textoNotificacion.textContent = texto;

        notificacion.classList.remove(
            "notificacion-exito",
            "notificacion-error",
            "mostrar-notificacion"
        );

        notificacion.classList.add(
            tipo === "error"
                ? "notificacion-error"
                : "notificacion-exito"
        );

        iconoNotificacion.innerHTML = tipo === "error"
            ? '<i class="fa-solid fa-exclamation"></i>'
            : '<i class="fa-solid fa-check"></i>';


        void notificacion.offsetWidth;

        notificacion.classList.add("mostrar-notificacion");

        temporizadorNotificacion = setTimeout(function () {
            ocultarNotificacion();
        }, 5000);
    }


    function ocultarNotificacion() {

        clearTimeout(temporizadorNotificacion);

        notificacion.classList.remove(
            "mostrar-notificacion"
        );
    }


    cerrarNotificacion.addEventListener(
        "click",
        ocultarNotificacion
    );



    const formulario = document.getElementById(
        "formularioContacto"
    );

    if (!formulario) {
        return;
    }

    const campoNombre = document.getElementById("nombre");
    const campoEmail = document.getElementById("email");
    const campoMotivo = document.getElementById("motivo");
    const campoMensaje = document.getElementById("mensaje");



    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const nombre = campoNombre.value.trim();
        const email = campoEmail.value.trim();
        const motivo = campoMotivo.value;
        const mensaje = campoMensaje.value.trim();


        if (!nombre || !email || !motivo || !mensaje) {

            mostrarNotificacion(
                "¡Faltan algunos datos!",
                "Completa todos los campos para continuar.",
                "error"
            );

            if (!nombre) {
                campoNombre.focus();
            } else if (!email) {
                campoEmail.focus();
            } else if (!motivo) {
                campoMotivo.focus();
            } else {
                campoMensaje.focus();
            }

            return;
        }



        if (!campoEmail.checkValidity()) {

            mostrarNotificacion(
                "Revisa tu correo",
                "Escribe una dirección de correo electrónico válida.",
                "error"
            );

            campoEmail.focus();

            return;
        }

        formulario.reset();

        mostrarNotificacion(
            "¡Mensaje enviado!",
            "Gracias por contactar con ChocoManía. ¡Nos alegra saber de ti!"
        );

    });

});