/**
 * Created by tome on 7/4/15.
 */

subscribe('shopWindow update done', drawShopWindow);

subscribe('quantityChanged', shopWindow.update);
subscribe('shopWindowChanged', shopWindow.update);
subscribe('updatedItemsOnPage', shopWindow.displayNewItems);//Subscribe to pagination change/update

subscribe('changePage', pagination.update);
subscribe('setItemsPerPage', pagination.update);


subscribe('addToCartButtonPressed', shoppingCart.addItemToCart);
subscribe('Added item to cart', shoppingCart.getTotal);
subscribe('Removed item from cart', shoppingCart.getTotal);