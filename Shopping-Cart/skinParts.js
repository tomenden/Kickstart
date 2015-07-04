/**
 * Created by tome on 7/3/15.
 */

var skinParts = {
    productTable: document.querySelector('table.items-list'),
    productTableHeaders: skinParts.productTable.querySelectorAll('tr.header-row>th'),
    productTableBody: skinParts.productTable.querySelector('tbody'),

    pagination: document.querySelector('div.pagination'),
    paginationInput: skinParts.pagination.querySelector('input'),
    paginationList: skinParts.pagination.querySelector('ul.pagesList'),

    cart: document.querySelector('div.cart'),
    cartHeaders: skinParts.cart.querySelectorAll('table>thead>tr>th'),
    cartTotal: skinParts.cart.querySelector('div.total'),
    cartTotalQuantity: skinParts.cartTotal.querySelector('span.total-quantity'),
    cartTotalPrice: skinParts.cartTotal.querySelector('span.total-price')

};

console.dir(skinParts);