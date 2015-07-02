/**
 * Created by tome on 6/30/15.
 */
var cartHeaders = ['name', 'quantity', 'price'];

function addItemToCart(id, quantity) {
    quantity = quantity || 1; // default quantity
    var item = getItemFromId(id);
    if (cartObj.items[id]) {
        cartObj.items[id].quantity += quantity;
    } else {
        cartObj.items[id] = {
            name: item.name,
            quantity: quantity,
            price: parseInt(item.price)
        };
    }
}




function createAddToCart(id) {
    var imageFragment = createFragment();
    var td = document.createElement('td');
    var img = document.createElement('img');
    img.setAttribute('src', 'http://png-2.findicons.com/files/icons/808/on_stage/128/symbol_add.png');
    img.dataset.id = id;
    img.onclick = function () {
        publish('addToCart', id);
    };
    td.appendChild(img);
    imageFragment.appendChild(td);
    return imageFragment;
}

function drawAddToCart() {
    var trsToAppend = document.querySelectorAll('table.items-list>tbody > tr');
    for (var i = 0; i < trsToAppend.length; i++) {
        var id = trsToAppend[i].dataset.id;
        var addToCartFragment = createAddToCart(id);
        trsToAppend[i].appendChild(addToCartFragment);
    }
}

/*
 Cart Object
 */
var cartObj = {
    items: {},
    total: {
        quantity: 0,
        price: 0
    },
    calculateTotal: function () {
        var totalQuantity = 0, totalPrice = 0;
        for (var id in cartObj.items) {
            if (cartObj.items.hasOwnProperty(id)) {
                totalQuantity += cartObj.items[id].quantity;
                totalPrice += cartObj.items[id].quantity * cartObj.items[id].price;
            }
        }
        cartObj.total.quantity = totalQuantity;
        cartObj.total.price = totalPrice;
    }

};


function drawCart() {
    drawCartBody();
    drawCartFooter();
}

function drawCartBody() {
    var cartBody = document.querySelector('div.cart>table>tbody');
    cartBody.innerHTML = '';//reset cartBody
    for (var item in cartObj.items) {
        if (cartObj.items.hasOwnProperty(item)) {
            var tr = document.createElement('tr');
            for (var i = 0; i < cartHeaders.length; i++) {
                var td = document.createElement('td');
                td.innerHTML = cartObj.items[item][cartHeaders[i]];
                tr.appendChild(td);
            }
            cartBody.appendChild(tr);
        }
    }
}

function drawCartFooter() {
    var cartFooterTds = document.querySelectorAll('div.cart>table>tfoot>tr>td');
    for (var j = 0; j < cartFooterTds.length; j++) {
        if (cartFooterTds[j].dataset.field === 'quantity') {
            cartFooterTds[j].innerHTML = cartObj.total.quantity;
        }
        if (cartFooterTds[j].dataset.field === 'price') {
            cartFooterTds[j].innerHTML = cartObj.total.price;
        }
    }
}

subscribe('addToCart', addItemToCart);
subscribe('addToCart', cartObj.calculateTotal);
subscribe('addToCart', drawCart);