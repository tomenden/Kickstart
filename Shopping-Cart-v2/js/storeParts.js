/**
 * Created by tome on 7/8/15.
 */
/********ShopWindow****************************************************************************************************************************/
/**
 * Function used by ShopWindow.update()
 * @param itemId
 * @param headers
 * @returns {{}}
 */
function getItemObjectWithFields(itemId, headers) {
    var obj = {};
    var item = getItemFromId(itemId);
    for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        if (item[header]) {
            obj[header] = item[header];
        }
    }
    //add itemId, in case not in Headers
    obj.id = itemId;
    return obj;
}

var shopWindow = {//TODO: consider changing all instances of shopWindow in this function to this, and binding to shopWindow in the pubsub
    items: [],
    ids: [],
    headers: ['name', 'description', 'image', 'price', 'quantity', 'add'],
    update: function () {
        shopWindow.items = [];
        for (var i = 0; i < shopWindow.ids.length; i++) {
            var obj = getItemObjectWithFields(shopWindow.ids[i], shopWindow.headers);
            shopWindow.items.push(obj);
        }
        publish('shopWindow update done', shopWindow.ids);
    },
    displayNewItems: function (ids) {
        shopWindow.ids = ids;
        publish('shopWindowChanged');
        return 'success';
    },
    addToCart: function (itemId) {
        var item = getItemFromId(itemId);
        if (item.quantity) {
            publish('addToCartButtonPressed', item);
        }
    }
};
/********Pagination****************************************************************************************************************************/
var pagination = {
    currentPage: 1,
    itemsPerPage: 5,
    getCurrentPageItems: function () {
        var ids = [];
        for (var i = this.firstItemIndex; i < this.lastItemIndex; i++) {
            ids.push(inventory[i].id);
        }
        return ids;
    },
    update: function () {
        this.numberOfPages = Math.ceil(inventory.length / this.itemsPerPage);
        this.firstItemIndex = this.currentPage * this.itemsPerPage - this.itemsPerPage;
        this.lastItemIndex = this.firstItemIndex + this.itemsPerPage;
        if (this.lastItemIndex > inventory.length) {
            this.lastItemIndex = inventory.length;
        }
        publish('updatedItemsOnPage', this.getCurrentPageItems());
    },
    goToPage: function (pageNumber) {
        this.currentPage = pageNumber;
        publish('changePage');
    },
    setItemsPerPage: function (limit) {
        this.itemsPerPage = limit;
        publish('setItemsPerPage');
    }
};


//Helper
function itemIndexInCart(itemId, cart) {
    for (var i = 0; i < cart.items.length; i++) {
        if (cart.items[i].id === itemId) {
            return i;
        }
    }
    return -1;
}
/********Shopping Cart****************************************************************************************************************************/
var shoppingCart = {
    items: [],
    headers: ['name', 'added', 'price', 'remove'],//TODO: Remove from here, belongs in drawer
    addItemToCart: function (item) {
        var indexInCart = itemIndexInCart(item.id, this);
        if (indexInCart > -1) {
            this.items[indexInCart].quantity = item.quantity;
            this.items[indexInCart].price = parseInt(item.quantity, 10) * parseInt(item.price, 10);
        }
        else {
            var itemObj = {
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: parseInt(item.quantity, 10) * parseInt(item.price, 10)
            };
            this.items.push(itemObj);
        }
        publish('Added item to cart');
    },
    removeItemFromCart: function (itemId) {
        var indexInCart = itemIndexInCart(itemId, this);
        if (indexInCart > -1) {
            this.items.splice(indexInCart, 1);
            publish('Removed item from cart', itemId);
        }
    },
    getTotal: function () {
        var quantity = 0, price = 0;
        for (var i = 0; i < this.items.length; i++) {
            quantity += this.items[i].quantity;
            price += parseInt(this.items[i].price, 10);
        }
        this.totalQuantity = quantity;
        this.totalPrice = price;
        return {'Total Quantity': quantity, 'Total Price': price};
    }
};