/**
 * Created by tome on 7/4/15.
 */

//subscribe('shopWindow update done', drawShopWindow);
//TODO: fix
subscribe('shopWindow update done', drawShopWindow);

subscribe('quantityChanged', shopWindow.update);
subscribe('shopWindowChanged', shopWindow.update);
subscribe('updatedItemsOnPage', shopWindow.displayNewItems);//Subscribe to pagination change/update


//TODO: Change this so it gets redrawn only on INITIAL load and when added/removed item from cart
//subscribe('shopWindow update done', drawShoppingCart);
//subscribe('Added item to cart', drawShoppingCart);
//TODO: fix
subscribe('Added item to cart', drawShoppingCart);
subscribe('shopWindow update done', drawShoppingCart);


subscribe('changePage', pagination.update);
subscribe('setItemsPerPage', pagination.update);


subscribe('addToCartButtonPressed', shoppingCart.addItemToCart);
subscribe('Added item to cart', shoppingCart.getTotal);
subscribe('Removed item from cart', shoppingCart.getTotal);