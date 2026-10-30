document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const $ = (selector, contexto = document) =>
        contexto.querySelector(selector);

    const $$ = (selector, contexto = document) =>
        [...contexto.querySelectorAll(selector)];

    const tarjetas = $$(".video-card");
    const corazones = $$(".corazon");
    const elementosReveal = $$(".reveal");

    const botonBuscar = $(".buscar");
    const botonCarrito = $(".carrito");

    const heroMedia = $(".hero-media");
    const videoPrincipal = heroMedia
        ? $("video", heroMedia)
        : null;

    const botonesPlay = $$(".video-card .boton-play");

    let modal = null;
    let videoModalActual = null;
    let botonOrigenModal = null;
    let desplazamientoAnterior = "";

    const videosOriginales = [
        videoPrincipal,
        ...tarjetas.map(tarjeta =>
            $(".video-imagen video", tarjeta)
        )
    ].filter(Boolean);

    function pausarVideos() {
        videosOriginales.forEach(video => {
            video.pause();
        });
    }

    if (!$("#estilos-interactivos-galeria")) {
        const estilos = document.createElement("style");

        estilos.id = "estilos-interactivos-galeria";

        estilos.textContent = `
            .boton-play-principal {
                position: absolute;
                z-index: 10;
                top: 50%;
                left: 50%;

                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 12px;

                max-width: calc(100% - 24px);
                min-height: 56px;
                padding: 13px 23px;

                transform: translate(-50%, -50%);

                border: 1px solid rgba(255,255,255,.85);
                border-radius: 999px;

                background: linear-gradient(
                    135deg,
                    rgba(77,37,25,.94),
                    rgba(139,71,56,.94)
                );

                color: #ffd78e;

                box-shadow:
                    0 8px 25px rgba(0,0,0,.24),
                    0 0 0 5px rgba(255,255,255,.12),
                    0 0 28px rgba(233,169,79,.28);

                font-family: "Trebuchet MS", Arial, sans-serif;
                font-size: .91rem;
                font-weight: 800;

                white-space: nowrap;
                cursor: pointer;

                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);

                transition:
                    background .3s ease,
                    box-shadow .3s ease,
                    color .3s ease,
                    transform .3s ease;
            }

            .icono-play-principal {
                display: grid;
                place-items: center;

                width: 32px;
                height: 32px;
                flex: 0 0 32px;

                padding-left: 2px;

                border: 1px solid rgba(255,215,142,.65);
                border-radius: 50%;

                background: rgba(255,255,255,.10);
                font-size: .85rem;

                transition:
                    transform .3s ease,
                    background .3s ease;
            }

            .boton-play-principal:hover {
                color: #3b2018;

                background: linear-gradient(
                    135deg,
                    #ffd78e,
                    #e9a94f
                );

                box-shadow:
                    0 12px 32px rgba(0,0,0,.27),
                    0 0 0 6px rgba(255,215,142,.15),
                    0 0 35px rgba(233,169,79,.45);

                transform: translate(-50%, -50%) scale(1.045);
            }

            .boton-play-principal:hover .icono-play-principal {
                background: rgba(255,255,255,.30);
                transform: scale(1.08);
            }

            .boton-play-principal:active {
                transform: translate(-50%, -50%) scale(.97);
            }

            .modal-video .contenido-modal {
                width: min(760px, 100%);
                max-height: calc(100vh - 40px);
            }

            .modal-video .modal-media {
                width: 100%;
                margin: 18px auto;

                border-radius: 12px;
                overflow: hidden;
            }

            .modal-video .modal-media video {
                display: block;
                width: 100%;
                max-height: min(52vh, 420px);

                aspect-ratio: 16 / 9;
                object-fit: contain;

                background: #170c08;
                border-radius: 8px;

                animation: entradaVideoGaleria .4s ease both;
            }

            .modal-video .mensaje-video {
                animation: entradaMensajeGaleria .5s .15s ease both;
            }

            .modal-video .cerrar-modal {
                transition:
                    transform .3s ease,
                    background .3s ease,
                    color .3s ease,
                    box-shadow .3s ease;
            }

            .modal-video .cerrar-modal:hover {
                transform: rotate(90deg) scale(1.08);
                box-shadow: 0 5px 15px rgba(77,37,25,.18);
            }

            .modal-sin-video {
                display: grid;
                place-items: center;
                gap: 14px;

                width: 100%;
                min-height: 220px;
                aspect-ratio: 16 / 9;

                padding: 24px;

                color: #f9dfe4;
                text-align: center;

                background:
                    radial-gradient(
                        ellipse at 50% 35%,
                        rgba(196,111,66,.33),
                        transparent 60%
                    ),
                    linear-gradient(
                        135deg,
                        #4d2519,
                        #2e160f
                    );
            }

            .modal-sin-video span {
                display: grid;
                place-items: center;

                width: 60px;
                height: 60px;

                color: #ffd78e;
                border: 1px solid rgba(255,215,142,.55);
                border-radius: 50%;

                font-size: 1.35rem;

                box-shadow: 0 0 24px rgba(233,169,79,.20);
            }

            .modal-sin-video p {
                margin: 0;
                font-size: .9rem;
                line-height: 1.6;
            }

            .modal-media video:focus-visible {
                outline: 3px solid #e9a94f;
                outline-offset: 4px;
            }

            .video-card.reproduciendo .video-imagen video {
                filter: saturate(1.12) contrast(1.04);
            }

            .video-card.reproduciendo {
                border-color: rgba(233,169,79,.55);
                box-shadow: 0 15px 35px rgba(196,111,66,.16);
            }

            @keyframes entradaVideoGaleria {
                from {
                    opacity: 0;
                    transform: scale(.97);
                }

                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes entradaMensajeGaleria {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            body.animaciones-listas .video-card.reveal.visible {
                animation: tarjetaEntra .75s cubic-bezier(.2,.7,.2,1) both;
                animation-delay: var(--reveal-delay, 0ms);
            }

            @media (max-width: 700px) {
                .boton-play-principal {
                    gap: 8px;
                    min-height: 47px;
                    padding: 9px 13px;
                    font-size: .76rem;
                }

                .icono-play-principal {
                    width: 28px;
                    height: 28px;
                    flex-basis: 28px;
                    font-size: .75rem;
                }

                .modal-sin-video {
                    min-height: 170px;
                    padding: 16px;
                }
            }

            @media (max-width: 600px) {
                .modal-video {
                    padding: 12px;
                }

                .modal-video .contenido-modal {
                    width: 100%;
                    max-height: calc(100vh - 24px);
                    padding: 18px;
                }

                .modal-video .modal-media video {
                    max-height: 38vh;
                }
            }

            @media (max-width: 380px) {
                .boton-play-principal {
                    gap: 6px;
                    padding: 8px 10px;
                    font-size: .7rem;
                }
            }
        `;

        document.head.appendChild(estilos);
    }

    function crearModal() {
        if (modal) return;

        modal = document.createElement("div");

        modal.className = "modal-video";

        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-hidden", "true");
        modal.setAttribute("aria-labelledby", "tituloModalVideo");
        modal.setAttribute("aria-describedby", "descripcionModalVideo");
        modal.setAttribute("tabindex", "-1");

        modal.innerHTML = `
            <div class="contenido-modal">

                <button
                    class="cerrar-modal"
                    type="button"
                    aria-label="Cerrar video"
                >×</button>

                <p class="modal-etiqueta">
                    ChocoManía · Galería
                </p>

                <h2 id="tituloModalVideo"></h2>

                <p id="descripcionModalVideo"></p>

                <div class="modal-media"></div>

                <p class="mensaje-video" aria-live="polite"></p>

            </div>
        `;

        document.body.appendChild(modal);

        $(".cerrar-modal", modal).addEventListener(
            "click",
            cerrarModal
        );

        modal.addEventListener("click", evento => {
            if (evento.target === modal) {
                cerrarModal();
            }
        });
    }

    function detenerVideoModal() {
        if (!videoModalActual) return;

        videoModalActual.pause();
        videoModalActual.removeAttribute("src");

        videoModalActual.load();
        videoModalActual.remove();

        videoModalActual = null;
    }

    function crearVistaPreviaSinVideo(zona, mensaje) {
        const contenedor = document.createElement("div");

        contenedor.className = "modal-sin-video";

        const icono = document.createElement("span");

        icono.textContent = "▶";
        icono.setAttribute("aria-hidden", "true");

        const texto = document.createElement("p");

        texto.textContent = mensaje;

        contenedor.append(icono, texto);

        zona.replaceChildren(contenedor);
    }

    function abrirVideo(videoOriginal, titulo, descripcion, botonOrigen) {
        crearModal();

        const tituloModal = $("#tituloModalVideo", modal);
        const descripcionModal = $("#descripcionModalVideo", modal);
        const zona = $(".modal-media", modal);
        const mensaje = $(".mensaje-video", modal);

        const fuenteOriginal = $("source", videoOriginal);

        const rutaVideo =
            videoOriginal.currentSrc ||
            fuenteOriginal?.src ||
            fuenteOriginal?.getAttribute("src") ||
            videoOriginal.getAttribute("src") ||
            "";

        const poster = videoOriginal.poster || "";

        pausarVideos();
        detenerVideoModal();

        botonOrigenModal = botonOrigen;

        tituloModal.textContent = titulo || "ChocoManía";

        descripcionModal.textContent =
            descripcion || "Descubre nuestros chocolates.";

        zona.replaceChildren();

        if (!rutaVideo.trim()) {
            crearVistaPreviaSinVideo(
                zona,
                "No se encontró el archivo de video."
            );

            mensaje.textContent =
                "Comprueba que la ruta del video sea correcta.";
        } else {
            const video = document.createElement("video");

            video.className = "video-ampliado";
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            video.preload = "auto";

            video.setAttribute("playsinline", "");
            video.setAttribute(
                "aria-label",
                titulo || "Video de ChocoManía"
            );

            if (poster) {
                video.poster = poster;
            }

            video.addEventListener("error", () => {
                if (videoModalActual === video) {
                    mensaje.textContent =
                        "No se pudo cargar el video. Comprueba que el archivo exista y que la ruta sea correcta.";
                }
            });

            video.src = rutaVideo.trim();

            zona.appendChild(video);

            videoModalActual = video;

            mensaje.textContent =
                "Disfruta este contenido de ChocoManía.";

            const reproduccion = video.play();

            if (
                reproduccion &&
                typeof reproduccion.catch === "function"
            ) {
                reproduccion.catch(() => {
                    if (videoModalActual === video) {
                        mensaje.textContent =
                            "Pulsa reproducir en el reproductor para iniciar el video.";
                    }
                });
            }
        }

        if (!modal.classList.contains("mostrar")) {
            desplazamientoAnterior = document.body.style.overflow;
        }

        document.body.style.overflow = "hidden";

        modal.classList.add("mostrar");
        modal.setAttribute("aria-hidden", "false");

        botonOrigenModal?.setAttribute("aria-expanded", "true");

        $(".cerrar-modal", modal).focus();
    }

    function cerrarModal() {
        if (!modal || !modal.classList.contains("mostrar")) {
            return;
        }

        detenerVideoModal();

        modal.classList.remove("mostrar");
        modal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = desplazamientoAnterior;

        botonOrigenModal?.setAttribute("aria-expanded", "false");

        const elementoEnfocado = botonOrigenModal;

        botonOrigenModal = null;

        if (elementoEnfocado?.isConnected) {
            elementoEnfocado.focus();
        }
    }

    if (heroMedia && videoPrincipal) {
        const botonPrincipal = document.createElement("button");

        botonPrincipal.type = "button";
        botonPrincipal.className = "boton-play-principal";

        botonPrincipal.setAttribute(
            "aria-label",
            "Abrir video publicitario de ChocoManía"
        );

        botonPrincipal.setAttribute("aria-haspopup", "dialog");
        botonPrincipal.setAttribute("aria-expanded", "false");

        botonPrincipal.innerHTML = `
            <span class="icono-play-principal" aria-hidden="true">▶</span>
            <span>Ver video publicitario</span>
        `;

        heroMedia.appendChild(botonPrincipal);

        botonPrincipal.addEventListener("click", () => {
            abrirVideo(
                videoPrincipal,
                "Video publicitario de ChocoManía",
                "Descubre nuestra marca y el mundo del chocolate.",
                botonPrincipal
            );
        });
    }

    botonesPlay.forEach(boton => {
        const tarjeta = boton.closest(".video-card");

        if (!tarjeta) return;

        const video = $(".video-imagen video", tarjeta);

        if (!video) return;

        const titulo = $("h3", tarjeta);
        const descripcion = $(".video-info p", tarjeta);

        boton.setAttribute("aria-haspopup", "dialog");
        boton.setAttribute("aria-expanded", "false");

        boton.addEventListener("click", () => {
            abrirVideo(
                video,
                titulo?.textContent.trim(),
                descripcion?.textContent.trim(),
                boton
            );
        });
    });

    corazones.forEach(corazon => {
        if (corazon.tagName !== "BUTTON") {
            corazon.setAttribute("role", "button");
            corazon.setAttribute("tabindex", "0");
        }

        corazon.setAttribute("aria-pressed", "false");
        corazon.setAttribute("aria-label", "Añadir a favoritos");

        function alternarFavorito() {
            const activo = corazon.classList.toggle("favorito");

            corazon.setAttribute(
                "aria-pressed",
                String(activo)
            );

            corazon.setAttribute(
                "aria-label",
                activo ? "Quitar de favoritos" : "Añadir a favoritos"
            );
        }

        corazon.addEventListener("click", alternarFavorito);

        if (corazon.tagName !== "BUTTON") {
            corazon.addEventListener("keydown", evento => {
                if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    alternarFavorito();
                }
            });
        }
    });

    document.addEventListener("keydown", evento => {
        if (
            evento.key === "Escape" &&
            modal?.classList.contains("mostrar")
        ) {
            cerrarModal();
        }
    });

    if (botonBuscar) {
        botonBuscar.setAttribute(
            "title",
            "Buscador disponible exclusivamente en Tienda"
        );

        botonBuscar.setAttribute(
            "aria-label",
            "Buscador disponible exclusivamente en Tienda"
        );
    }

    if (botonCarrito) {
        botonCarrito.addEventListener("click", () => {
            window.location.href = "tienda.html";
        });
    }

    tarjetas.forEach((tarjeta, indice) => {
        tarjeta.style.setProperty(
            "--reveal-delay",
            `${indice * 130}ms`
        );
    });

    const elementosAnimados = $$(".reveal");

    if ("IntersectionObserver" in window) {
        document.body.classList.add("animaciones-listas");

        const observador = new IntersectionObserver(
            (entradas, observer) => {
                entradas.forEach(entrada => {
                    if (!entrada.isIntersecting) return;

                    entrada.target.classList.add("visible");

                    observer.unobserve(entrada.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        elementosAnimados.forEach(elemento => {
            observador.observe(elemento);
        });

    } else {
        elementosAnimados.forEach(elemento => {
            elemento.classList.add("visible");
        });
    }

});