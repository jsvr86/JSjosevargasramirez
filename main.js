//VARIABLES PARA CREAR CARDS Y CARRITO

const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

//GUARDAR CARRITO EN LOCALSTORAGE

document.addEventListener('DOMContentLoaded', () => { 
    fetchData() 
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click' , e =>{
    btnAccion(e)
})

//CONTRUCTOR DE CARDS CON JSON

const fetchData = async () => {
    try{
        const res = await fetch('api.json');
        const data = await res.json()
        // console.log(data)
        pintarCards(data)
    }   catch (error) {
            console.log(error)
    }
}

//PINTAR CARDS CON JSON

const pintarCards = data =>{
    data.forEach(producto =>{
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute('src',producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    // console.log(e.target)
    // console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    // console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
}

//AGREGAR PRODUTOS A LA LISTA

const pintarCarrito = () => {
    // console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).lenght === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad,0)
    // console.log(nCantidad)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad, precio}) => acc + cantidad * precio,0)
    // console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () =>{
        carrito = {}
        pintarCarrito()
    })
}

//BORRAR O AGREGAR PRODUCTOS DE LA LISTA

const btnAccion = e => {

    if(e.target.classList.contains('btn-info')){
        // console.log(carrito[e.target.dataset.id])

        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0 ){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}

//FORMULARIO

$(document).ready(() => {
    $('#consejosVladimir').submit(function(){
        let nombre = $('#nombre').val();
        let correo = $('#correo').val();
        
        $("#formEnviado").text(`Gracias ${nombre}. Ahora recibiras los utiles consejos del gran Vladimir Putin`);
        $("#consejosVladimir").hide();
        
    });

    $(".productos").click(function(){
        $("#porductosenCarrito").text(`Tienes productos en el carrito`);
    });

    $("#tabla").click(function(){
        $("#comprado").text(`Gracias. Pronto recibirás tus productos`);
        $("#tabla").hide();
    });

});

// AJAX NO INCLUIDO EN ENTREGA FINAL

// $.ajax({
//     url:'http://api.openweathermap.org/data/2.5/weather',
//     type: "GET",
//     data:{
//         q: 'Moscu',
//         appid: "eca60b31b95c74f674af9365f8140926",
//         dataType: 'jsonp',
//         units: 'metric'
//     },
//     success:function(data){
//         let icono = data.weather[0].icon;
//         let iconoURL = "http://openweathermap.org/img/w/" + icono + ".png";
//         $("#icono").attr("src",iconoURL);
//         let contenido = `<div>

//                         <p style="color:white";>${data.name}</p>

//                         </div>`
        
//         $("#caja").append(contenido)
//     }
// })
