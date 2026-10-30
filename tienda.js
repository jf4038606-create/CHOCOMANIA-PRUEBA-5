document.addEventListener("DOMContentLoaded", function () {

   const encabezado = document.querySelector("header");

    const botonBuscar = document.querySelector(".buscar");
    const botonCarrito = document.querySelector(".carrito");

    const botonesAgregar = document.querySelectorAll(
        ".agregar-carrito"
    );

    const contenedorProductos = document.querySelector(
        ".lista-productos"
    );

    const productos = document.querySelectorAll(".producto");

    let carrito = [];
    let temporizadorMensaje;


    if (
        encabezado &&
        botonBuscar &&
        botonCarrito &&
        !encabezado.querySelector(".header-actions")
    ) {
        const acciones = document.createElement("div");

        acciones.className = "header-actions";

        encabezado.insertBefore(acciones, botonBuscar);

        acciones.appendChild(botonBuscar);
        acciones.appendChild(botonCarrito);
    }

    function prepararBoton(elemento, etiqueta) {

        if (!elemento) {
            return;
        }

        elemento.setAttribute("role", "button");
        elemento.setAttribute("tabindex", "0");
        elemento.setAttribute("aria-label", etiqueta);
        elemento.setAttribute("title", etiqueta);
    }

    prepararBoton(botonBuscar, "Abrir buscador de productos");

    prepararBoton(botonCarrito, "Abrir carrito de compras");


    const elementosAnimados = document.querySelectorAll(
        ".categorias, .imagen-inicio, .titulo-tienda, .producto"
    );

    elementosAnimados.forEach(function (elemento, indice) {

        elemento.classList.add("revelar");

        if (elemento.classList.contains("producto")) {

            const retraso = (indice % 8) * 0.07;

            elemento.style.setProperty(
                "--delay-entrada",
                `${retraso}s`
            );
        }
    });


    if ("IntersectionObserver" in window) {

        document.documentElement.classList.add(
            "animaciones-activas"
        );

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

    } else {

        elementosAnimados.forEach(function (elemento) {
            elemento.classList.add("visible");
        });
    }


    const mensajeFlotante = document.createElement("div");

    mensajeFlotante.className = "mensaje-carrito";

    mensajeFlotante.setAttribute("role", "status");
    mensajeFlotante.setAttribute("aria-live", "polite");

    mensajeFlotante.hidden = true;

    document.body.appendChild(mensajeFlotante);


    function mostrarMensaje(texto) {

        clearTimeout(temporizadorMensaje);

        mensajeFlotante.textContent = texto;
        mensajeFlotante.hidden = false;

        mensajeFlotante.classList.remove("visible");

        void mensajeFlotante.offsetWidth;

        mensajeFlotante.classList.add("visible");

        temporizadorMensaje = setTimeout(function () {

            mensajeFlotante.classList.remove("visible");

            setTimeout(function () {

                if (
                    !mensajeFlotante.classList.contains("visible")
                ) {
                    mensajeFlotante.hidden = true;
                }

            }, 350);

        }, 2400);
    }


    let contadorCarrito = null;

    if (botonCarrito) {

        contadorCarrito = document.createElement("span");

        contadorCarrito.className = "contador-carrito";
        contadorCarrito.textContent = "0";

        contadorCarrito.setAttribute("aria-hidden", "true");

        botonCarrito.appendChild(contadorCarrito);
    }


    function contarUnidades() {

        return carrito.reduce(function (total, producto) {
            return total + producto.cantidad;
        }, 0);
    }


    function actualizarContador() {

        const unidades = contarUnidades();

        if (contadorCarrito) {
            contadorCarrito.textContent =
                unidades > 99 ? "99+" : String(unidades);
        }

        if (botonCarrito) {
            botonCarrito.setAttribute(
                "aria-label",
                `Abrir carrito. ${unidades} unidades`
            );
        }
    }


    const fondoCarrito = document.createElement("div");

    fondoCarrito.className = "carrito-fondo";

    fondoCarrito.setAttribute("aria-hidden", "true");


    const panelCarrito = document.createElement("aside");

    panelCarrito.className = "carrito-panel";

    panelCarrito.setAttribute("role", "dialog");
    panelCarrito.setAttribute("aria-modal", "true");
    panelCarrito.setAttribute("aria-labelledby", "tituloCarrito");
    panelCarrito.setAttribute("aria-label", "Carrito de compras");

    panelCarrito.innerHTML = `
        <div class="encabezado-carrito">

            <div>
                <h2 id="tituloCarrito">Mi carrito</h2>
                <p>Prepara tu selección de ChocoManía.</p>
            </div>

            <button
                class="cerrar-carrito"
                type="button"
                aria-label="Cerrar carrito"
            >×</button>

        </div>

        <div class="lista-carrito"></div>

       <div class="pie-carrito">

    <div class="total-carrito">
        <span>Unidades seleccionadas</span>
        <strong class="cantidad-total">0</strong>
    </div>

    <div class="total-carrito total-pagar">
        <span>Total estimado</span>
        <strong class="importe-total">$0.00</strong>
    </div>

    <p class="detalle-total">
        Calculado con los precios base publicados.
        El valor final puede variar según la presentación elegida.
    </p>

    <button
        class="vaciar-carrito"
        type="button"
        disabled
    >
        Vaciar carrito
    </button>

    </div>
    `;

    document.body.appendChild(fondoCarrito);
    document.body.appendChild(panelCarrito);


    const listaCarrito = panelCarrito.querySelector(
        ".lista-carrito"
    );

    const cantidadTotal = panelCarrito.querySelector(
        ".cantidad-total"
    );

    const importeTotal = panelCarrito.querySelector(
    ".importe-total"
    );

    const cerrarCarrito = panelCarrito.querySelector(
        ".cerrar-carrito"
    );

    const vaciarCarrito = panelCarrito.querySelector(
        ".vaciar-carrito"
    );

    let elementoAnterior = null;


    function abrirCarrito() {

        cerrarBuscador();

        elementoAnterior = document.activeElement;

        panelCarrito.classList.add("abierto");
        fondoCarrito.classList.add("abierto");

        fondoCarrito.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        renderizarCarrito();

        cerrarCarrito.focus();
    }


    function cerrarPanelCarrito() {

        panelCarrito.classList.remove("abierto");
        fondoCarrito.classList.remove("abierto");

        fondoCarrito.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        if (elementoAnterior && elementoAnterior.focus) {
            elementoAnterior.focus();
        }
    }


    if (botonCarrito) {

        botonCarrito.addEventListener("click", function () {
            abrirCarrito();
        });

        botonCarrito.addEventListener("keydown", function (evento) {

            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {
                evento.preventDefault();
                abrirCarrito();
            }
        });
    }


    cerrarCarrito.addEventListener(
        "click",
        cerrarPanelCarrito
    );

    fondoCarrito.addEventListener(
        "click",
        cerrarPanelCarrito
    );


    function renderizarCarrito() {

        listaCarrito.replaceChildren();

        const unidades = contarUnidades();

    cantidadTotal.textContent = String(unidades);

    // Calcular el importe total en centavos
    const totalCentavos = carrito.reduce(function (total, producto) {
    const precio = Math.round(
        (Number(producto.precioUnitario) || 0) * 100
    );

    return total + precio * producto.cantidad;
    }, 0);

    // Mostrar el importe con dos decimales
    importeTotal.textContent =
    "$" + (totalCentavos / 100).toFixed(2);

    vaciarCarrito.disabled = carrito.length === 0;


        if (carrito.length === 0) {

            const vacio = document.createElement("div");

            vacio.className = "carrito-vacio";

            const icono = document.createElement("span");

            icono.setAttribute("aria-hidden", "true");
            icono.textContent = "♡";

            const titulo = document.createElement("h3");

            titulo.textContent = "Tu carrito está vacío";

            const texto = document.createElement("p");

            texto.textContent =
                "Explora nuestras delicias y agrega tus productos favoritos.";

            vacio.append(icono, titulo, texto);

            listaCarrito.appendChild(vacio);

            actualizarContador();

            return;
        }

        carrito.forEach(function (producto) {

            const item = document.createElement("article");

            item.className = "item-carrito";


            const informacion = document.createElement("div");

            informacion.className = "item-carrito-info";


            const nombre = document.createElement("strong");

            nombre.textContent = producto.nombre;


            const precio = document.createElement("small");

            precio.textContent = producto.precioTexto
                ? `Precio indicado: ${producto.precioTexto}`
                : "Precio sujeto a presentación";


            informacion.append(nombre, precio);


            const acciones = document.createElement("div");

            acciones.className = "acciones-item-carrito";


            const controles = document.createElement("div");

            controles.className = "control-cantidad";


            const botonMenos = document.createElement("button");

            botonMenos.type = "button";
            botonMenos.className = "cantidad-btn";
            botonMenos.dataset.accion = "menos";
            botonMenos.dataset.producto = producto.nombre;
            botonMenos.textContent = "−";

            botonMenos.setAttribute(
                "aria-label",
                `Reducir cantidad de ${producto.nombre}`
            );


            const numero = document.createElement("span");

            numero.className = "cantidad-valor";
            numero.textContent = String(producto.cantidad);


            const botonMas = document.createElement("button");

            botonMas.type = "button";
            botonMas.className = "cantidad-btn";
            botonMas.dataset.accion = "mas";
            botonMas.dataset.producto = producto.nombre;
            botonMas.textContent = "+";

            botonMas.setAttribute(
                "aria-label",
                `Aumentar cantidad de ${producto.nombre}`
            );


            controles.append(botonMenos, numero, botonMas);


            const eliminar = document.createElement("button");

            eliminar.type = "button";
            eliminar.className = "eliminar-producto";
            eliminar.dataset.accion = "eliminar";
            eliminar.dataset.producto = producto.nombre;
            eliminar.textContent = "Eliminar";


            acciones.append(controles, eliminar);

            item.append(informacion, acciones);

            listaCarrito.appendChild(item);
        });


        actualizarContador();
    }


    panelCarrito.addEventListener("click", function (evento) {

        const boton = evento.target.closest("[data-accion]");

        if (!boton) {
            return;
        }

        const accion = boton.dataset.accion;
        const nombre = boton.dataset.producto;

        const producto = carrito.find(function (item) {
            return item.nombre === nombre;
        });

        if (!producto) {
            return;
        }


        if (accion === "mas") {

            producto.cantidad += 1;

        } else if (accion === "menos") {

            producto.cantidad -= 1;

            if (producto.cantidad <= 0) {
                carrito = carrito.filter(function (item) {
                    return item.nombre !== nombre;
                });
            }

        } else if (accion === "eliminar") {

            carrito = carrito.filter(function (item) {
                return item.nombre !== nombre;
            });
        }


        renderizarCarrito();
    });


    vaciarCarrito.addEventListener("click", function () {

        if (carrito.length === 0) {
            return;
        }

        carrito = [];

        renderizarCarrito();

        mostrarMensaje("Tu carrito se ha vaciado.");
    });


    botonesAgregar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const tarjeta = boton.closest(".producto");

            if (!tarjeta) {
                return;
            }

            const titulo = tarjeta.querySelector("h3");
            const precio = tarjeta.querySelector(".precio");

            const nombre =
                boton.dataset.producto ||
                (titulo ? titulo.textContent.trim() : "Producto");

            const precioTexto = precio
                ? precio.textContent.trim()
                : "";

            // Obtener el precio numérico desde el texto del producto
            const coincidenciaPrecio = precioTexto.match(
            /\d+(?:[.,]\d{1,2})?/
            );

            const precioUnitario = coincidenciaPrecio
            ? Number(coincidenciaPrecio[0].replace(",", "."))
            : 0;


            const existente = carrito.find(function (producto) {
                return producto.nombre === nombre;
            });


            if (existente) {

                existente.cantidad += 1;

            } else {

               carrito.push({
               nombre: nombre,
               cantidad: 1,
               precioTexto: precioTexto,
               precioUnitario: precioUnitario
               });
            }


            actualizarContador();
            renderizarCarrito();


            boton.classList.remove("animacion-agregado");

            void boton.offsetWidth;

            boton.classList.add("animacion-agregado");



            if (botonCarrito) {

                botonCarrito.classList.remove("pulso-carrito");

                void botonCarrito.offsetWidth;

                botonCarrito.classList.add("pulso-carrito");
            }


            mostrarMensaje(
                `${nombre} se agregó al carrito.`
            );
        });
    });


    const buscador = document.createElement("div");

    buscador.className = "buscador";

    buscador.innerHTML = `
        <label
            for="buscarProducto"
            class="etiqueta-buscador"
        >
            Buscar productos
        </label>

        <input
            type="search"
            id="buscarProducto"
            placeholder="Escribe un producto..."
            autocomplete="off"
            aria-describedby="resultadoBusqueda"
        >

        <p
            class="resultado-busqueda"
            id="resultadoBusqueda"
            aria-live="polite"
        >
            Escribe para encontrar tus favoritos.
        </p>
    `;

    if (encabezado) {
        encabezado.appendChild(buscador);
    } else {
        document.body.appendChild(buscador);
    }


    const inputBuscar = buscador.querySelector(
        "#buscarProducto"
    );

    const resultadoBusqueda = buscador.querySelector(
        "#resultadoBusqueda"
    );

    const etiquetaBuscador = buscador.querySelector(
        ".etiqueta-buscador"
    );

    etiquetaBuscador.style.position = "absolute";
    etiquetaBuscador.style.width = "1px";
    etiquetaBuscador.style.height = "1px";
    etiquetaBuscador.style.overflow = "hidden";
    etiquetaBuscador.style.clipPath = "inset(50%)";


    let mensajeSinResultados = null;

    if (contenedorProductos) {

        mensajeSinResultados = document.createElement("p");

        mensajeSinResultados.className = "sin-resultados";

        mensajeSinResultados.textContent =
            "No encontramos productos con ese nombre.";

        mensajeSinResultados.hidden = true;

        contenedorProductos.appendChild(mensajeSinResultados);
    }


    function filtrarProductos() {

        const texto = inputBuscar.value
            .trim()
            .toLocaleLowerCase("es");

        let cantidadCoincidencias = 0;


        productos.forEach(function (producto) {

            const titulo = producto.querySelector("h3");
            const descripcion = producto.querySelector(
                ".contenido-producto p"
            );

            const imagen = producto.querySelector("img");

            const contenido = [
                titulo ? titulo.textContent : "",
                descripcion ? descripcion.textContent : "",
                imagen ? imagen.alt : ""
            ].join(" ").toLocaleLowerCase("es");


            const coincide =
                texto === "" || contenido.includes(texto);

            producto.classList.toggle(
                "producto-oculto",
                !coincide
            );

            if (coincide) {
                cantidadCoincidencias++;
            }
        });


        if (mensajeSinResultados) {
            mensajeSinResultados.hidden =
                cantidadCoincidencias > 0;
        }


        if (texto === "") {

            resultadoBusqueda.textContent =
                "Escribe para encontrar tus favoritos.";

        } else if (cantidadCoincidencias === 1) {

            resultadoBusqueda.textContent =
                "Encontramos 1 producto.";

        } else {

            resultadoBusqueda.textContent =
                `Encontramos ${cantidadCoincidencias} productos.`;
        }
    }


    function abrirBuscador() {

        cerrarPanelCarrito();

        buscador.classList.add("mostrar");

        botonBuscar.setAttribute("aria-expanded", "true");

        inputBuscar.focus();
    }


    function cerrarBuscador() {

        if (!buscador) {
            return;
        }

        buscador.classList.remove("mostrar");

        if (botonBuscar) {
            botonBuscar.setAttribute("aria-expanded", "false");
        }
    }


    if (botonBuscar) {

        botonBuscar.setAttribute("aria-expanded", "false");

        botonBuscar.addEventListener("click", function () {

            if (buscador.classList.contains("mostrar")) {

                cerrarBuscador();

            } else {

                abrirBuscador();
            }
        });


        botonBuscar.addEventListener("keydown", function (evento) {

            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {
                evento.preventDefault();

                if (buscador.classList.contains("mostrar")) {
                    cerrarBuscador();
                } else {
                    abrirBuscador();
                }
            }
        });
    }


    inputBuscar.addEventListener("input", filtrarProductos);


    document.addEventListener("click", function (evento) {

        if (
            !buscador.contains(evento.target) &&
            !botonBuscar.contains(evento.target)
        ) {
            cerrarBuscador();
        }
    });


    document.addEventListener("keydown", function (evento) {

        if (evento.key === "Escape") {

            if (buscador.classList.contains("mostrar")) {

                cerrarBuscador();

                if (botonBuscar) {
                    botonBuscar.focus();
                }
            }

            if (panelCarrito.classList.contains("abierto")) {
                cerrarPanelCarrito();
            }
        }
    });

    actualizarContador();
    renderizarCarrito();

});