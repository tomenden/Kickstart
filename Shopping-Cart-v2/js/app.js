/**
 * Created by tome on 7/3/15.
 */

// Data variable - inventory (located at data/)

/********Helpers****************************************************************************************************************************/
function getItemFromId(id) {
    for (var i = 0; i < inventory.length; i++) {
        var item = inventory[i];
        if (item.id === id) {
            console.log('success, item id: ' + id);
            return item;
        }
    }
    console.log('could not find item with id: ' + id);
    return false;
}
function getItemWithQuantity(itemId, quantity) {
    var item = getItemFromId(itemId);
    if (quantity > item.stock) {
        console.log('No more soup for you!');
    }
    else {
        item.quantity = quantity;
    }
    return item;
}
function itemAlreadySelected(itemId) {
    var selectedItems = shoppingSession.selectedItems;
    for (var i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i].id === itemId) {
            return true;
        }
    }
    return false;
}

/********Pub/Sub****************************************************************************************************************************/

var counter = 0;
var subscriptions = {};
function subscribe(eventType, callback) {
    subscriptions[eventType] = subscriptions[eventType] || [];
    subscriptions[eventType].push(callback);

}
function publish(eventType, args) {
    var subscribers = subscriptions[eventType];
    for (var i = 0; i < subscribers.length; i++) {
        subscribers[i](args);
    }
}
function unsubscribe(eventType, uniqueID) {
    if (subscriptions[eventType] && subscriptions[eventType][uniqueID]) {
        delete subscriptions[eventType][uniqueID];
    }
}


// shopping session state: {selectedItems:[item (withQuantity, id), item], inCart: [{item, quantity}]
/********Shopping Session****************************************************************************************************************************/

var shoppingSession = {
    selectedItems: [],
    inCart: []
};

/********Increment & Decrement****************************************************************************************************************************/

function incrementItem(itemId) {
    if (itemAlreadySelected(itemId)) {
        getItemFromId(itemId).quantity += 1;
    }
    else {
        shoppingSession.selectedItems.push(getItemWithQuantity(itemId, 1));
    }
    publish('quantityChanged', itemId);
    return shoppingSession.selectedItems;
}

function decrementItem(itemId) {
    if (itemAlreadySelected(itemId)) {
        var item = getItemFromId(itemId);
        if (item.quantity - 1 === 0) {
            var i = shoppingSession.selectedItems.indexOf(item);
            shoppingSession.selectedItems.splice(i, 1);
            delete item.quantity;
            console.log('Item: ' + itemId + ' quantity has been removed')
        }
        else {
            item.quantity--;
            console.log('new quantity: ' + item.quantity);
        }
        publish('quantityChanged', itemId);
    }
    else {
        console.log('item is not selected, and thus can not be decremented');
    }
    return shoppingSession.selectedItems;
}




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
    return obj;
}


function ShopWindow(ids) {//array of item ids
    this.ids = ids;
    this.headers = ['name', 'description', 'image', 'price', 'quantity', 'action'];
    this.displayData = [];
    var that = this;
    this.update = function () {
        for (var i = 0; i < that.ids.length; i++) {
            var obj = getItemObjectWithFields(that.ids[i], that.headers);
            that.displayData.push(obj);
        }
        publish('shopWindow update done', that.ids);
    };
    this.displayNewItems = function (ids) {
        that.ids = ids;
        publish('shopWindowChanged');
        return 'success';
    };
    this.addToCart = function (itemId) {
        var item = getItemFromId(itemId);
        if (item.quantity) {
            publish('addToCartButtonPressed', item);
        }
    };
}

//ShopWindow = new ShopWindow();
var shopWindow = new ShopWindow();

/********Pagination****************************************************************************************************************************/

function Pagination(currentPage, itemsPerPage) {
    this.currentPage = currentPage || 1;
    this.itemsPerPage = itemsPerPage || 5;
    var that = this;
    this.getCurrentPageItemsIds = function () {
        var ids = [];
        for (var i = that.firstItemIndex; i < that.lastItemIndex; i++) {
            ids.push(inventory[i].id);
        }
        return ids;
    };
    this.update = function () {
        that.numberOfPages = Math.ceil(inventory.length / that.itemsPerPage);
        that.firstItemIndex = that.currentPage * that.itemsPerPage - that.itemsPerPage;
        that.lastItemIndex = that.firstItemIndex + that.itemsPerPage;
        if (that.lastItemIndex > inventory.length) {
            that.lastItemIndex = inventory.length;
        }
        publish('updatedItemsOnPage', that.getCurrentPageItemsIds());
    };
    this.goToPage = function (pageNumber) {
        that.currentPage = pageNumber;
        publish('changePage');
    };
    this.setItemsPerPage = function (limit) {
        that.itemsPerPage = limit;
        publish('setItemsPerPage');
    };
}

var pagination = new Pagination(1, 5);

//Helper
function itemIndexInCart(itemId, cart) {
    for (var i = 0; i < cart.itemsInCart.length; i++) {
        if (cart.itemsInCart[i].id === itemId) {
            return i;
        }
    }
    return -1;
}

function ShoppingCart() {
    this.itemsInCart = [];
    this.headers = ['name', 'quantity', 'price'];
    this.addItemToCart = function (item) {
        var indexInCart = itemIndexInCart(item.id, this);
        if (indexInCart > -1) {
            this.itemsInCart[indexInCart].quantity = item.quantity;
            this.itemsInCart[indexInCart].price = parseInt(item.quantity, 10) * parseInt(item.price, 10);
        }
        else {
            var itemObj = {
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: parseInt(item.quantity, 10) * parseInt(item.price, 10)
            };
            this.itemsInCart.push(itemObj);
        }
        publish('Added item to cart');
    }.bind(this);
    this.removeItemFromCart = function (itemId) {
        var indexInCart = itemIndexInCart(itemId, this);
        if (indexInCart > -1) {
            this.itemsInCart.splice(indexInCart, 1);
            publish('Removed item from cart', itemId);
        }
    }.bind(this);
    this.getTotal = function () {
        var quantity = 0, price = 0;
        for (var i = 0; i < this.itemsInCart.length; i++) {
            quantity += this.itemsInCart[i].quantity;
            price += parseInt(this.itemsInCart[i].price, 10);
        }
        this.totalQuantity = quantity;
        this.totalPrice = price;
        return {'Total Quantity': quantity, 'Total Price': price};
    }.bind(this);
}

var shoppingCart = new ShoppingCart();