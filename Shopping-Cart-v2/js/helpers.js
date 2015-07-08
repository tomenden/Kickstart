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