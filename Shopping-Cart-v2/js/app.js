/**
 * Created by tome on 7/3/15.
 */

// Data variable - inventory (located at data/)

/********Helpers****************************************************************************************************************************/
function getItemFromId(id) {
    for (var i = 0; i < inventory.length; i++) {
        var item = inventory[i];
        if (item.id === id) {
            return item;
        }
    }
    console.log('could not find item with id: ' + id);
    return false;
}
function getItemWithQuantity(itemId, quantity) {//TODO: change this function
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
    var item = getItemFromId(itemId);
    if (itemAlreadySelected(itemId)) {
        if (item.quantity >= item.stock) {//TODO change handling of this case, and function in general
            console.log('Item limit reached');
            return false;
        }
        item.quantity += 1;
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
    //add itemId, in case not in Headers
    obj.id = itemId;
    return obj;
}

var shopWindow = {//TODO: consider changing all instances of shopWindow in this function to this, and binding to shopWindow in the pubsub
    items: [],
    ids: [],
    headers: ['name', 'description', 'image', 'price', 'quantity', 'action'],
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

function ShoppingCart() {
    this.items = [];
    this.headers = ['name', 'quantity', 'price', 'action'];//TODO: Remove from here, belongs in drawer
    var that = this;
    this.addItemToCart = function (item) {
        var indexInCart = itemIndexInCart(item.id, that);
        if (indexInCart > -1) {
            that.items[indexInCart].quantity = item.quantity;
            that.items[indexInCart].price = parseInt(item.quantity, 10) * parseInt(item.price, 10);
        }
        else {
            var itemObj = {
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: parseInt(item.quantity, 10) * parseInt(item.price, 10)
            };
            that.items.push(itemObj);
        }
        publish('Added item to cart');
    };
    this.removeItemFromCart = function (itemId) {
        var indexInCart = itemIndexInCart(itemId, this);
        if (indexInCart > -1) {
            that.items.splice(indexInCart, 1);
            publish('Removed item from cart', itemId);
        }
    };
    this.getTotal = function () {
        var quantity = 0, price = 0;
        for (var i = 0; i < that.items.length; i++) {
            quantity += that.items[i].quantity;
            price += parseInt(that.items[i].price, 10);
        }
        that.totalQuantity = quantity;
        that.totalPrice = price;
        return {'Total Quantity': quantity, 'Total Price': price};
    };
}

var shoppingCart = new ShoppingCart();