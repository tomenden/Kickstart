/**
 * Created by tome on 7/8/15.
 */
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
function itemAlreadySelected(itemId) {
    var item = getItemFromId(itemId);
    return !!item.quantity;

}

/********Increment & Decrement****************************************************************************************************************************/

function incrementItem(itemId) {
    var item = getItemFromId(itemId);
    if (itemAlreadySelected(itemId)) {
        if (item.quantity >= item.stock) {
            console.log('Item limit reached');
            return false;
        }
        item.quantity += 1;
    }
    else {
        item.quantity = 1;
    }
    publish('quantityChanged', itemId);
    return item;
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



