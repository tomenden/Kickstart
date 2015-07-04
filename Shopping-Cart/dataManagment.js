/**
 * Created by tome on 7/3/15.
 */
/**
 * shopWindow will hold the items that are currently displayed
 * Each item will also have a selected quantity
 */
var shopWindow = {
    products : []
};

/**
 * Cart Object
 * @type {{products: {}, total: {quantity: number, price: number}}}
 */
var cart = {
    products: {},
    total: {
        quantity: 0,
        price: 0
    }
};

var paging = {
    currentPage: 1,
    itemsPerPage: 5,
    numberOfPages: ITEMS.length / paging.itemsPerPage
};