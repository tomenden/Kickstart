/**
 * Created by tome on 7/4/15.
 */

/********Helpers****************************************************************************************************************************/

function getEmptyFragment() {
    return document.createDocumentFragment();
}

function getFragmentWithChildren(childrenArray) {
    var fragment = getEmptyFragment();
    for (var i = 0; i < childrenArray.length; i++) {
        fragment.appendChild(childrenArray[i]);
    }
    return fragment;
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

// create quantity cell (plus - input - minus)
function createQuantityCellContent(itemId, quantity) {
    var plus = createPlus(itemId);
    var minus = createMinus(itemId);
    var input = createInputQuantity(quantity);
    return getFragmentWithChildren([minus, input, plus]);

}
function createPlus(itemId) {
    var plus = createSpan({class: 'plus'});
    plus.onclick = function () {
        incrementItem(itemId);
    };
    return plus;
}
function createMinus(itemId) {
    var minus = createSpan({class: 'minus'});
    minus.onclick = function () {
        decrementItem(itemId);
    };
    return minus;
}
function createInputQuantity(quantity) {
    var attr = {
        type: 'number',
        min: 1,
        max: inventory.length,
        class: 'quantity-input'
    };
    var input = createInput(attr);
    if (quantity) {
        input.value = input.textContent = quantity;
    }
    return input;
}

// create add to cart button
function createAddToCartButton(itemId) {
    var button = createButton();
    button.innerHTML = "Add";
    button.onclick = function () {
        shopWindow.addToCart(itemId);
    };
    return button;
}

function createItemRow(item, fields) {
    //var item = getItemFromId(itemId);
    var row = createDivRow();
    //var fields = shopWindow.headers;
    for (var i = 0; i < fields.length; i++) {
        var cell = createDivCell();
        cell.dataset.id = item.id;
        cell.dataset.field = fields[i];

        if (fields[i] === 'image') {
            var img = createImg({'src': item['image']});
            cell.appendChild(img);
        }

        else if (fields[i] === 'quantity') {
            var quantityCellContent = createQuantityCellContent(item.id, item.quantity);
            cell.appendChild(quantityCellContent);
        }

        else if (fields[i] === 'action') {
            var addToCartButton = createAddToCartButton(item.id);
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

function drawShopWindow(ids) {//ids is an array from shopWindow.ids
    var fragment = getEmptyFragment(),
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
        var item = getItemFromId(ids[j]);
        var itemRow = createItemRow(item, shopWindow.headers);
        table.appendChild(itemRow);
    }

    fragment.appendChild(table);
    shopWindowSkin.innerHTML = ""; //reset shopWindow
    shopWindowSkin.appendChild(fragment);
}

//** TODO: Combine drawShopWindow with drawShoppingCart, they're basically the same

function drawShoppingCart() {
    var fragment = getEmptyFragment(),
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
        var item = shoppingCart.itemsInCart[j];
        var itemRow = createItemRow(item, shoppingCart.headers);
        table.appendChild(itemRow);
    }

    fragment.appendChild(table);
    shoppingCartSkin.innerHTML = ""; //reset
    shoppingCartSkin.appendChild(fragment);
    //return fragment;
}
