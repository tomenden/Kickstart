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

// Subscribe increment and decrement events to



// Shop Window Constructor. There will be one instance of shop window.
// To change the items displayed in the window use method displayNewItems([ids])
function ShopWindow(ids) {//array of item ids
    this.ids = ids;
    this.headers = ['name', 'description', 'image', 'price', 'quantity'];
    this.displayData = [];
    this.update = function () {
        var itemsDisplayData = [];
        for (var i = 0; i < this.ids.length; i++) {
            var obj = {};
            var item = getItemFromId(this.ids[i]);
            for (var j = 0; j < this.headers.length; j++) {
                var header = this.headers[j];
                if (item[header]) {
                    obj[header] = item[header];
                }
            }
            itemsDisplayData.push(obj);
        }
        this.displayData = itemsDisplayData;
        console.log(itemsDisplayData);
        return itemsDisplayData;
    }.bind(this);
    this.subscribe = function() {
        subscribe('quantityChanged', this.update);
        subscribe('shopWindowChanged', this.update);
        subscribe('updatedItemsOnPage', this.displayNewItems);//Subscribe to pagination change/update
    };
    this.displayNewItems = function (ids) {
        this.ids = ids;
        publish('shopWindowChanged');
        return 'success';
    }.bind(this);

    this.addToCart = function (itemId) {
        var item = getItemFromId(itemId);
        if (item.quantity) {
            publish('addToCartButtonPressed', item);
        }
    };
    //Initialize
    this.subscribe();
}

ShopWindow = new ShopWindow();




// pagination
function Pagination(currentPage, itemsPerPage) {
    this.currentPage = currentPage || 1;
    this.itemsPerPage = itemsPerPage || 5;
    this.getCurrentPageItemsIds = function () {
        var ids = [];
        for (var i = this.firstItemIndex; i < this.lastItemIndex; i++) {
            ids.push(inventory[i].id);
        }
        return ids;
    }.bind(this);
    this.update = function () {
        this.numberOfPages = Math.ceil(inventory.length / this.itemsPerPage);
        this.firstItemIndex = this.currentPage * this.itemsPerPage - this.itemsPerPage;
        this.lastItemIndex = this.firstItemIndex + this.itemsPerPage;
        if (this.lastItemIndex > inventory.length) {
            this.lastItemIndex = inventory.length;
        }
        publish('updatedItemsOnPage', this.getCurrentPageItemsIds());
    }.bind(this);
    this.goToPage = function (pageNumber) {
        this.currentPage = pageNumber;
        publish('changePage');
    }.bind(this);
    this.changeItemsPerPage = function(limit) {
        this.itemsPerPage = limit;
        publish('changeItemsPerPage');
    }.bind(this);
    this.subscribe = function () {
        subscribe('changePage', this.update);
        subscribe('changeItemsPerPage', this.update);
    };

    //init
    this.update();
    this.subscribe();
}

Pagination = new Pagination(1, 5);

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
    this.addItemToCart = function (item) {
        var indexInCart = itemIndexInCart(item.id, this);
        if (indexInCart > -1) {
            delete this.itemsInCart[indexInCart];
        }
        var itemObj = {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: parseInt(item.quantity, 10) * parseInt(item.price, 10)
        };
        this.itemsInCart.push(itemObj);
        publish('Added item to cart');
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


    this.subscribe = function () {
        subscribe('addToCartButtonPressed', this.addItemToCart);
        subscribe('Added item to cart', this.getTotal)
    };

    this.subscribe();
}

ShoppingCart = new ShoppingCart();