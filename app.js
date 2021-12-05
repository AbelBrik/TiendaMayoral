// Constantes
// Ropa
const containerCards = document.getElementById('containerCards')
const templateCard = document.getElementById('template-card').content
// Cesta
const containerCart = document.getElementById('containerCart')
const templateCart = document.getElementById('template-cart').content

const memory = document.createDocumentFragment()

// Let
let cart = {}
let isColumn1Active = false

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', e => callJson())
document.getElementById('column2').style.color = "#0172ea"

// Obtener productos del Json
const callJson = async () => {
    const res = await fetch('api.json')
    const data = await res.json()
    printCard(data)  
}

// Pintar las tarjetas
const printCard = data =>{
    data.forEach(item => {
        templateCard.getElementById('btn').dataset.id = item.id
        templateCard.getElementById('img').setAttribute("src", item.img)
        templateCard.getElementById('img').setAttribute("alt", item.title)
        templateCard.getElementById('img').setAttribute("title", item.title)
        item.title.length>28 ? 
            templateCard.getElementById('title').textContent = `${item.title.slice(0, 25)}...`
            :templateCard.getElementById('title').textContent = item.title
        templateCard.getElementById('price').textContent = item.price
        
        const totalElement = (((100-item.discountedRate)*item.price)/100).toFixed(2)
        if(item.discountedRate && item.discountedRate>0){
            templateCard.getElementById('discountedRate').textContent = item.discountedRate
            templateCard.getElementById('totalElement').textContent = totalElement
        } else {
            templateCard.getElementById('discountedRate').textContent = 0
            templateCard.getElementById('totalElement').textContent = totalElement
        }
        if(item.disponibility !==" " || !item.disponibility || item.disponibility === ""){
            templateCard.getElementById('disponibility').textContent = item.disponibility
        }
        
        const clone = templateCard.cloneNode(true)
        memory.appendChild(clone)
    })
    containerCards.appendChild(memory)
}
// Filtro de busqueda
function search(textFilter){
    const collection =  Array.from(document.getElementsByClassName('card'))
    collection.forEach(item => item.textContent.toLowerCase().includes(textFilter)
        ? item.classList.remove("filter")
        : item.classList.add("filter")
    ) 
}

// Iconos
function changeGrid(id){
    if(id==="column"){
        isColumn1Active = true
        document.getElementById(id).style.color = "#0172ea"
        document.getElementById('column2').style.color = "grey"
        document.getElementById('containerCards').style.gap = "20px 20000px"
    }
    if(id==="column2"){
        isColumn1Active = false
        document.getElementById(id).style.color = "#0172ea"
        document.getElementById('column').style.color = "grey"
        document.getElementById('containerCards').style.gap = "20px"
    }
} 

// Boton añadir
function addToProductCart(e) {
    const product = {
        'id': e.dataset.id,
        'title': e.parentNode.childNodes[3].textContent,
        'price': e.parentNode.childNodes[10].textContent || e.parentNode.childNodes[5].textContent ,
        'amount': 1
    }

    cart.hasOwnProperty(product.id) ?
        product.amount = cart[product.id].amount++
        : cart[product.id] = {...product}   
    printCart()
}

const printCart = () =>{
    containerCart.innerHTML=""
    let priceTicket = 0

    Object.values(cart).forEach( item =>{
        let priceForElements = item.price * item.amount
        priceTicket = priceTicket + priceForElements    

        templateCart.getElementById('idProduct').textContent = `Id: ${item.id} - ` 
        templateCart.getElementById('titleProduct').textContent = `${item.title}. `
        templateCart.getElementById('priceProduct').textContent = `Precio unidad: ${item.price} €. `
        templateCart.getElementById('amountProduct').textContent = `Cantidad: ${item.amount}. `
        templateCart.getElementById('totalProduct').textContent = `Precio: ${priceForElements.toFixed(2)} €. `
        document.getElementById('total').textContent = `Total: ${priceTicket.toFixed(2)} €`

        const clone = templateCart.cloneNode(true)
        memory.appendChild(clone)
    })
    containerCart.appendChild(memory)
}
