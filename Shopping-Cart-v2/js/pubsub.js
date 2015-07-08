/**
 * Created by tome on 7/8/15.
 */
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