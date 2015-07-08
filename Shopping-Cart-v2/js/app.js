/**
 * Created by tome on 7/3/15.
 */

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



