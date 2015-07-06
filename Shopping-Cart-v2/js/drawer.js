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
var createUl = createNewElement.bind(null, 'ul');
var createLi = createNewElement.bind(null, 'li');

// create quantity cell (plus - input - minus)
function createShopWindowQuantityCell(itemId, quantity) {
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
    button.textContent = "Add";
    button.onclick = function () {
        shopWindow.addToCart(itemId);
    };
    return button;
}

function createItemRow(item, fields, context) {
    var row = createDivRow();
    for (var i = 0; i < fields.length; i++) {
        var cell = createDivCell();
        cell.dataset.id = item.id;
        cell.dataset.field = fields[i];

        if (fields[i] === 'image') {
            var img = createImg({'src': item['image']});
            cell.appendChild(img);
        }

        else if (fields[i] === 'quantity' && context === 'shopWindow') {
            var quantityCellContent = createShopWindowQuantityCell(item.id, item.quantity);
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

function createHeadingRow(headers) {
    var heading = createDivHeading();
    for (var i = 0; i < headers.length; i++) {
        var headingCell = createDivCell();
        headingCell.textContent = headers[i];
        heading.appendChild(headingCell);
    }
    return heading;
}

function drawTable(object, skinPart) {
    var table = createDivTable();
    var heading = createHeadingRow(object.headers);
    var itemRow;
    table.appendChild(heading);
    for (var i = 0; i < object.items.length; i++) {
        var item = object.items[i];
        if (object instanceof ShopWindow) {
            itemRow = createItemRow(item, object.headers, 'shopWindow');
        }
        else {
            itemRow = createItemRow(item, object.headers);
        }
        table.appendChild(itemRow);
    }
    skinPart.innerHTML = "";//reset
    skinPart.appendChild(table);
    return table;

}

function drawShoppingCart() {
    return drawTable(shoppingCart, skinParts.shoppingCart);
}

function drawShopWindow() {
    return drawTable(shopWindow, skinParts.shopWindow);
}

function drawPagination() {//hard-coded to work on the pagination object. Consider changing it
    var ul = createUl({class: "page-list"});
    for (var i = 1; i <= pagination.numberOfPages; i++) {
        var li = createLi({class: "page-number", "data-number": i});
        li.textContent = i.toString();
        if (i === pagination.currentPage) {
            li.className = li.className + " current-page";
        }
        ul.appendChild(li);
    }

    ul.addEventListener('click', function (event) {
        var target = event.target;
        if (target && target.tagName.toLowerCase() === 'li') {
            pagination.goToPage(parseInt(target.dataset.number, 10));
        }
    });

    skinParts.pagination.innerHTML = "";//reset
    skinParts.pagination.appendChild(ul);
}

// create remove Button
function createRemoveButton(itemId) {
    var button = createButton({class: 'remove'});
    button.textContent = "Remove";
    button.onclick = function () {
        shoppingCart.removeItemFromCart(itemId);
    };
    return button;
}
