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


function createItemRow(itemId) {
    var item = getItemFromId(itemId);
    var row = createDivRow();
    var fields = shopWindow.headers;
    for (var i = 0; i < fields.length; i++) {
        var cell = createDivCell();
        cell.dataset.id = itemId;
        cell.dataset.field = fields[i];
        if (item[fields[i]]) {
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
        var itemRow = createItemRow(ids[j]);
        table.appendChild(itemRow);
    }

    fragment.appendChild(table);
    shopWindowSkin.innerHTML = ""; //reset shopWindow
    shopWindowSkin.appendChild(fragment);
}