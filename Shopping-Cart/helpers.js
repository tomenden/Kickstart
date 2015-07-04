/**
 * Created by tome on 7/1/15.
 */

var itemsTableBody = document.querySelector('table.items-list>tbody');
var itemsPerPage = 5; //TODO: Move to input for user selection
var itemCount = ITEMS.length;
var getPagesCount = function(){return Math.ceil(itemCount / itemsPerPage)};

/*
    organize item-table's headers by order
 */
var itemsTableHeaders = document.querySelectorAll('table.items-list th');
var itemsHeadersOrder = [];
(function getHeadersOrder() {
    for (var i = 0; i < itemsTableHeaders.length; i++) {
        itemsHeadersOrder.push(itemsTableHeaders[i].dataset.field);
    }
})();

/*
    Shared functions
 */
function createFragment() {
    return document.createDocumentFragment();
}

function getItemFromId(id) {
    for (var i = 0; i < itemCount; i++) {
        if (ITEMS[i]["id"] === id) {
            return ITEMS[i];
        }
    }
}


/**
 *
 * @param type String - e.g. 'div', 'tr'
 * @param attributesObject - e.g {'class': 'someClassName'}
 * @returns {Element}
 */
function createDomElement(type, attributesObject) {
    var element = document.createElement(type);
    if (attributesObject) {
        for (var attr in attributesObject) {
            if (attributesObject.hasOwnProperty(attr)) {
                element.setAttribute(attr, attributesObject[attr]);
            }
        }
    }
    return element;
}