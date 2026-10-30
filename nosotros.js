document.addEventListener("DOMContentLoaded", function () {
    
const iconoCarrito = document.querySelector(".carrito");

    if (iconoCarrito) {

        iconoCarrito.setAttribute("role", "link");
        iconoCarrito.setAttribute("tabindex", "0");
        iconoCarrito.setAttribute("aria-label", "Ir a la tienda");
        iconoCarrito.setAttribute("title", "Ir a la tienda");

        function irATienda() {
            window.location.href = "tienda.html";
        }

        iconoCarrito.addEventListener("click", function () {
            irATienda();
        });

        iconoCarrito.addEventListener("keydown", function (evento) {

            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {
                evento.preventDefault();
                irATienda();
            }

        });
    }



    const iconoBuscar = document.querySelector(".buscar");

    if (iconoBuscar) {

        iconoBuscar.setAttribute(
            "title",
            "Buscador disponible en Tienda"
        );

    }



    const elementosAnimados = document.querySelectorAll(
        ".historia, " +
        ".tarjeta-nosotros, " +
        ".valor, " +
        ".especiales, " +
        ".tarjeta-especial, " +
        ".compromiso, " +
        ".frase-nosotros"
    );



    const reducirMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    if (
        elementosAnimados.length === 0 ||
        reducirMovimiento ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }


    document.body.classList.add("animaciones-listas");


    elementosAnimados.forEach(function (elemento) {
        elemento.classList.add("animar-entrada");
    });



    const observador = new IntersectionObserver(
        function (entradas, observer) {

            entradas.forEach(function (entrada) {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("visible");


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

});



document.addEventListener("DOMContentLoaded", function () {
    const videoPortada = document.querySelector(".video-portada");
    const botonAbrir = document.querySelector(".boton-reproducir-video");

    if (!videoPortada || !botonAbrir) return;

    const modal = document.createElement("div");
    modal.className = "modal-video-choco";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Video de ChocoManía");
    modal.setAttribute("aria-hidden", "true");

    const contenido = document.createElement("div");
    contenido.className = "modal-video-choco__contenido";

    const botonCerrar = document.createElement("button");
    botonCerrar.type = "button";
    botonCerrar.className = "modal-video-choco__cerrar";
    botonCerrar.setAttribute("aria-label", "Cerrar video");
    botonCerrar.innerHTML = "&times;";

    const videoAmpliado = videoPortada.cloneNode(true);
    videoAmpliado.className = "modal-video-choco__player";
    videoAmpliado.controls = true;
    videoAmpliado.preload = "auto";
    videoAmpliado.playsInline = true;

    contenido.append(botonCerrar, videoAmpliado);
    modal.appendChild(contenido);
    document.body.appendChild(modal);

    let elementoAnterior = null;
    let overflowAnterior = "";

    function abrirVideo() {
        elementoAnterior = document.activeElement;
        overflowAnterior = document.body.style.overflow;

        modal.classList.add("abierto");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        videoAmpliado.load();

        const reproduccion = videoAmpliado.play();

        if (reproduccion) {
            reproduccion.catch(function () {
                // Los controles permiten iniciar el video manualmente.
            });
        }

        botonCerrar.focus();
    }

    function cerrarVideo() {
        if (!modal.classList.contains("abierto")) return;

        videoAmpliado.pause();

        modal.classList.remove("abierto");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = overflowAnterior;

        if (elementoAnterior && elementoAnterior.isConnected) {
            elementoAnterior.focus();
        }
    }

    botonAbrir.addEventListener("click", abrirVideo);
    botonCerrar.addEventListener("click", cerrarVideo);

    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) cerrarVideo();
    });

    document.addEventListener("keydown", function (evento) {
        if (
            evento.key === "Escape" &&
            modal.classList.contains("abierto")
        ) {
            cerrarVideo();
        }
    });
});
