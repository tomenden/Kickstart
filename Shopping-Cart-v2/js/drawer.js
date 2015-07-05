/**
 * Created by tome on 7/4/15.
 */

/********Helpers****************************************************************************************************************************/

function getNewFragment() {
    return document.createDocumentFragment();
}

function createNewElement(type, attributeObj) {
    var element = document.createElement(type.toString());
    if (attributeObj) {
        for (var attr in attributeObj) {
            if (attributeObj.hasOwnProperty(attr)) {
                element.setAttribute(attr.toString(), attributeObj[attr].toString());
            }
        }
    }
    return element;
}
var createDivTable = createNewElement.bind(null, 'div', {class: 'Table'});
var createDivTitle = createNewElement.bind(null, 'div', {class: 'Title'});
var createDivHeading = createNewElement.bind(null, 'div', {class: 'Heading'});
var createDivRow = createNewElement.bind(null, 'div', {class: 'Row'});
var createDivCell = createNewElement.bind(null, 'div', {class: 'Cell'});
var createImg = createNewElement.bind(null, 'img');
var createSpan = createNewElement.bind(null, 'span');
var createInput = createNewElement.bind(null, 'input');
var createButton = createNewElement.bind(null, 'button');


function createQuantityCellContent(itemId, quantity) {
    var fragment = getNewFragment();
    var plus = createSpan({class: 'plus'});
    var minus = createSpan({class: 'minus'});
    var input = createInput({type: 'number', min: 1, max: inventory.length, class: 'quantity-input'});
    if (quantity) {
        input.value = input.textContent = quantity;
    }

    plus.onclick = function() {
        incrementItem(itemId);
    };
    minus.onclick = function () {
        decrementItem(itemId);
    };

    fragment.appendChild(plus);
    fragment.appendChild(input);
    fragment.appendChild(minus);
    return fragment;

}

function createAddToCartButton(itemId) {
    var button = createButton();
    button.innerHTML = "Add";
    button.onclick = function () {
        shopWindow.addToCart(itemId);
    };
    return button;
}

function createItemRow(itemId, fields) {
    var item = getItemFromId(itemId);
    var row = createDivRow();
    //var fields = shopWindow.headers;
    for (var i = 0; i < fields.length; i++) {
        var cell = createDivCell();
        cell.dataset.id = itemId;
        cell.dataset.field = fields[i];

        if (fields[i] === 'image') {
            var img = createImg({'src': item['image']});
            cell.appendChild(img);
        }

        else if (fields[i] === 'quantity') {
            var quantityCellContent = createQuantityCellContent(itemId, item.quantity);
            cell.appendChild(quantityCellContent);
        }

        else if (fields[i] === 'action') {
            var addToCartButton = createAddToCartButton(itemId);
            cell.appendChild(addToCartButton);
        }

        else if (item[fields[i]]) {
            cell.textContent = item[fields[i]];
        }
        row.appendChild(cell);
    }
    return row;
}



//subscribe('shopWindow update done', drawShopWindow);

function drawShopWindow (ids) {//ids is an array from shopWindow.ids
    var fragment = getNewFragment(),
        table = createDivTable(),
        heading = createDivHeading(),
        shopWindowSkin = skinParts.shopWindow;// this is where the shopWindow resides
    for (var i = 0; i < shopWindow.headers.length; i++) {
        var headingCell = createDivCell();
        headingCell.textContent = shopWindow.headers[i];
        heading.appendChild(headingCell);
    }
    table.appendChild(heading);

    for (var j = 0; j < ids.length; j++) {
        var itemRow = createItemRow(ids[j], shopWindow.headers);
        table.appendChild(itemRow);
    }

    fragment.appendChild(table);
    shopWindowSkin.innerHTML = ""; //reset shopWindow
    shopWindowSkin.appendChild(fragment);
}

//** TODO: Combine drawShopWindow with drawShoppingCart, they're basically the same

function drawShoppingCart() {
    var fragment = getNewFragment(),
        table = createDivTable(),
        heading = createDivHeading(),
        shoppingCartSkin = skinParts.shoppingCart;
    for (var i = 0; i < shoppingCart.headers.length; i++) {
        var headingCell = createDivCell();
        headingCell.textContent = shoppingCart.headers[i];
        heading.appendChild(headingCell);
    }
    table.appendChild(heading);

    for (var j = 0; j < shoppingCart.itemsInCart.length; j++) {
        var itemId = shoppingCart.itemsInCart[j].id;
        var itemRow = createItemRow(itemId, shoppingCart.headers);
        table.appendChild(itemRow);
    }

    fragment.appendChild(table);
    shoppingCartSkin.innerHTML = ""; //reset
    shoppingCartSkin.appendChild(fragment);
    //return fragment;
}
