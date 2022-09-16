
//variables
const carrito = document.querySelector("#carrito");
const listaCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
const finalizar = document.querySelector("#finalizar")
const productos = document.querySelector("#productos");
const menorPrecio = document.querySelector("#menorPrecio");
const mayorPrecio = document.querySelector("#mayorPrecio");
const precioTotal = document.querySelector("#precioTotal")
// const arrayProductos = [producto1, producto2, producto3, producto4, producto5, producto6];

let arrayProductos = []
const cardQuery = document.querySelector("#productCard");
let articulosCarrito = [];
let preciosCarrito = [];


//eventos
cargarEventos();
function cargarEventos(){

    productos.addEventListener("click", agregarProducto);

    carrito.addEventListener("click", eliminarProducto);

    //eventos para ordenar productos
    mayorPrecio.addEventListener("click", ordenarMayor);
    menorPrecio.addEventListener("click", ordenarMenor);

    document.addEventListener("DOMContentLoaded", () => {
        articulosCarrito = JSON.parse( localStorage.getItem("carrito")) || [];

        carritoHTML();
    })

    vaciarCarrito.addEventListener("click", () => {

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: true
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Esta segur@?',
            text: "No podremos revertir  esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, vaciar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                articulosCarrito = [];
                carritoHTML();
            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
              
            }
          })

        
    })

    finalizar.addEventListener("click", () => {

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: true
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Desea finalizar su compra?',
            text: "Lo redireccionaremos a los medios de pago.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Volver',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Su compra ha sido realizada con éxito!',
                    showConfirmButton: false,
                    timer: 1500,
                    width: '400px'
                  })

                articulosCarrito = [];
                carritoHTML();

            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
              
            }
          })

        
    })

}



//FETCH

const getProd = async () => {
    const response = await fetch("../data/products.json")
    const data = await response.json()
    arrayProductos = data
    renderizarListaProductos(arrayProductos)
}


//crear html
const renderizarListaProductos = () => {
    arrayProductos.forEach((producto) => {
        const nuevaCard = document.createElement("div")
        nuevaCard.innerHTML = `
            <div class="card">
                    <div class="container">
                        <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">  
                    </div>
                    <div class="card-body">
                        <div class="text"><button class="agregar-carrito" data-id="${producto.id}">AGREGAR</button></div>
                        <h4 class="card-title">${producto.nombre} </h4>
                        <h5 class="card-title"> $ <span> ${producto.precio} </span></h5>
                        <p class="card-text">${producto.info} </p>
                    </div>
            </div>
        `
        nuevaCard.className = "col"
        cardQuery.append(nuevaCard)

    })

}



//PRUEBA DE FUNCIONES SORT BY 
//RESOLVER COMO IMPRIMIR

function ordenarMayor(){
    const mayorPrecio = arrayProductos.sort((prod1, prod2) => {
        if(prod1.precio < prod2.precio) {
            return 1;
        }
        if(prod1.precio > prod2.precio) {
            return -1;
        }
        return 0;

    })
    console.log(mayorPrecio)
}
function ordenarMenor(){
    const menorPrecio = arrayProductos.sort((prod1, prod2) => {
        if(prod1.precio < prod2.precio) {
            return -1;
        }
        if(prod1.precio > prod2.precio) {
            return 1;
        }
        return 0;

    })
    console.log(menorPrecio)
    renderizarListaProductos()
}

//FUNCIONES

function agregarProducto(e){
    e.preventDefault();
    if(e.target.classList.contains("agregar-carrito")){
        const seleccionado = e.target.parentElement.parentElement.parentElement;
        leerDatos (seleccionado);

        //AGREGAR SWEET ALERT
        
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 1500,
            icon: 'success',
            title: 'EL PRODUCTO SE AGREGÓ AL CARRITO'
        })
    }
}



function eliminarProducto(e){
    if(e.target.classList.contains("borrar")){
        const productoId =e.target.getAttribute("data-id");
        articulosCarrito = articulosCarrito.filter( producto => producto.id !== productoId);
        carritoHTML();
    }
}


function leerDatos(producto){

    //crear nuevo objeto
    const infoProducto = {
        
        img: producto.querySelector("img").src,
        nombre: producto.querySelector("h4").textContent,
        precio: producto.querySelector("span").textContent,
        id: producto.querySelector("button").getAttribute("data-id"),
        cantidad: 1
    }

    //revisar si ya existe producto
    const existe = articulosCarrito.some( producto => producto.id === infoProducto.id )
    if (existe) {
        const productoUpdate = articulosCarrito.find((producto) => producto.id === infoProducto.id)
        productoUpdate.cantidad ++ 
        productoUpdate.precio = productoUpdate.precio * productoUpdate.cantidad

    } else {
        articulosCarrito.push(infoProducto)
    }

    limpiarHTML();
    carritoHTML();
}


function carritoHTML(){

    limpiarHTML();

    //imprime en carrito
    articulosCarrito.forEach( producto => {
        const { img, nombre, precio, cantidad, id } = producto;
        const row = document.createElement("tr");
        row.innerHTML = `
            
            <td><img class="agregadoimg" src="${img}"}></td>
            <td class="agregado">${nombre}</td>
            <td class="agregado precio">${precio}</td>
            <td class="agregado">${cantidad}</td>
            <td>
                <a href="#" class="borrar" data-id="${id}" > X </a>
            </td>
            
        `;

        listaCarrito.appendChild(row);
        

        //no
        preciosCarrito = [ producto.precio]
        console.log(preciosCarrito)
        
    })
    

    //no
    precioTotal.innerHTML = articulosCarrito.reduce((acc, prod) => acc + prod.precio , 0)
    console.log(precioTotal);


    sincroStorage();

}

function sincroStorage(){
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

//limpia el tbody
function limpiarHTML() {
    listaCarrito.innerHTML = ""
}

//EJECUTAR
getProd()
