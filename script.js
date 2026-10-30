document.addEventListener("DOMContentLoaded", () => {

    /* 
       1. IDENTIFICAR LA PAGINA ACTUAL
     */

    const nombrePagina = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const esTienda =
        nombrePagina === "tienda.html" ||
        document.body.dataset.page === "tienda";

    const buscarBtn = document.querySelector(".buscar");
    const carritoBtn = document.querySelector(".carrito");
    const encabezado = document.querySelector(".topbar");

    const productosBuscables = document.querySelectorAll(
        ".producto-card, .producto-destacado"
    );


    /* 
       2. BUSCADOR
       Solo funciona en tienda.html
    */

    let buscador = null;
    let inputBuscar = null;
    let mensajeBusqueda = null;

    if (esTienda && buscarBtn) {

        buscador = document.createElement("div");
        buscador.className = "buscador";

        buscador.innerHTML = `
            <label
                class="solo-lectores"
                for="inputBuscar">
                Buscar productos de ChocoManía
            </label>

            <input
                type="search"
                id="inputBuscar"
                placeholder="Buscar chocolates..."
                autocomplete="off"
                aria-describedby="estadoBusqueda">

            <p
                id="estadoBusqueda"
                class="estado-busqueda"
                aria-live="polite">
                Escribe el nombre de un producto para buscar.
            </p>
        `;

        if (encabezado) {
            encabezado.appendChild(buscador);
        } else {
            document.body.appendChild(buscador);
        }

        inputBuscar = buscador.querySelector("#inputBuscar");

        mensajeBusqueda = buscador.querySelector(
            "#estadoBusqueda"
        );

        buscarBtn.setAttribute("aria-expanded", "false");
        buscarBtn.setAttribute("aria-controls", "inputBuscar");
        buscarBtn.setAttribute(
            "aria-label",
            "Abrir buscador de productos"
        );
    }


    /* 
       3. POSICION DEL BUSCADOR
     */

    function posicionarBuscador() {

        if (!buscador || !encabezado) {
            return;
        }

        buscador.style.top =
            `${encabezado.offsetHeight + 8}px`;
    }


    /* 
       4. ABRIR BUSCADOR
     */

    function abrirBuscador() {

        if (!buscador || !inputBuscar || !buscarBtn) {
            return;
        }

        posicionarBuscador();

        buscador.classList.add("mostrar");

        buscarBtn.setAttribute("aria-expanded", "true");

        inputBuscar.focus();
    }


    /* 
       5. CERRAR BUSCADOR
     */

    function cerrarBuscador(devolverFoco = false) {

        if (!buscador || !buscarBtn) {
            return;
        }

        buscador.classList.remove("mostrar");

        buscarBtn.setAttribute("aria-expanded", "false");

        if (devolverFoco) {
            buscarBtn.focus();
        }
    }


    /* 
       6. BOTON DE BUSQUEDA
     */

    if (esTienda && buscarBtn) {

        buscarBtn.addEventListener("click", () => {

            if (buscador.classList.contains("mostrar")) {
                cerrarBuscador();
            } else {
                abrirBuscador();
            }

        });

    } else if (buscarBtn) {

        buscarBtn.setAttribute("aria-expanded", "false");

        buscarBtn.setAttribute(
            "aria-label",
            "Búsqueda disponible en la tienda"
        );

    }


    /* 
       7. AJUSTAR EL BUSCADOR AL CAMBIAR EL TAMAÑO
     */

    window.addEventListener("resize", () => {

        if (buscador?.classList.contains("mostrar")) {
            posicionarBuscador();
        }

    });


    /* 
       8. FILTRAR PRODUCTOS
       Solo en la tienda
     */

    function filtrarProductos() {

        if (!esTienda || !inputBuscar || !mensajeBusqueda) {
            return;
        }

        const consulta = inputBuscar.value
            .trim()
            .toLocaleLowerCase("es");

        let coincidencias = 0;

        productosBuscables.forEach((producto) => {

            const textoImagenes = Array.from(
                producto.querySelectorAll("img")
            )
                .map((imagen) => imagen.alt)
                .join(" ");

            const contenido = (
                `${producto.textContent} ${textoImagenes}`
            ).toLocaleLowerCase("es");

            const coincide =
                consulta === "" ||
                contenido.includes(consulta);

            producto.hidden = !coincide;

            if (coincide && consulta !== "") {
                coincidencias++;
            }

        });

        if (consulta === "") {

            mensajeBusqueda.textContent =
                "Escribe el nombre de un producto para buscar.";

        } else if (coincidencias > 0) {

            mensajeBusqueda.textContent =
                `Se encontraron ${coincidencias} coincidencias.`;

        } else {

            mensajeBusqueda.textContent =
                "No encontramos productos con ese nombre.";

        }

    }


    if (esTienda && inputBuscar) {

        inputBuscar.addEventListener(
            "input",
            filtrarProductos
        );

    }


    /* 
       9. CERRAR EL BUSCADOR AL HACER CLIC FUERA
     */

    document.addEventListener("click", (evento) => {

        if (!esTienda || !buscador || !buscarBtn) {
            return;
        }

        if (
            !buscador.contains(evento.target) &&
            !buscarBtn.contains(evento.target)
        ) {
            cerrarBuscador();
        }

    });


    /* 
       10. CERRAR CON LA TECLA ESCAPE
     */

    document.addEventListener("keydown", (evento) => {

        if (
            esTienda &&
            evento.key === "Escape" &&
            buscador?.classList.contains("mostrar")
        ) {
            cerrarBuscador(true);
        }

    });


    /* 
       11. CARRITO
     */

    if (carritoBtn && !esTienda) {

        carritoBtn.addEventListener("click", (evento) => {

            evento.preventDefault();

            window.location.href = "tienda.html";

        });

    }


    /* 
       12. ANIMACIONES AL DESPLAZARSE(SCROLL)
     */

    const elementosParaRevelar = document.querySelectorAll(
        [
            ".caracteristicas-principales",
            ".productos h2",
            ".titulo-destacados",
            ".promocion",
            "footer"
        ].join(", ")
    );


    if (
        elementosParaRevelar.length &&
        "IntersectionObserver" in window
    ) {

        document.body.classList.add("animaciones-listas");

        elementosParaRevelar.forEach((elemento) => {
            elemento.classList.add("revelar");
        });

        const observador = new IntersectionObserver(
            (entradas, observer) => {

                entradas.forEach((entrada) => {

                    if (entrada.isIntersecting) {

                        entrada.target.classList.add("visible");

                        observer.unobserve(entrada.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );


        elementosParaRevelar.forEach((elemento) => {
            observador.observe(elemento);
        });

    } else {

        elementosParaRevelar.forEach((elemento) => {

            elemento.classList.add("visible");

        });

    }

});