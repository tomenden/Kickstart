/**
 * Created by tome on 6/30/15.
 */

var subscriptions = {};
var counter = 0;

function subscribe(eventType, cb) {
    subscriptions[eventType] = subscriptions[eventType] || {};
    subscriptions[eventType][counter] = cb;
    return counter++;

}

function publish(eventType, args) {
    var subscribers = subscriptions[eventType];
    for (var subscriber in subscribers) {
        if (subscribers.hasOwnProperty(subscriber)) {
            subscribers[subscriber](args);
        }
    }
}

function unsubscribe(eventType, uniqueID) {
    if (subscriptions[eventType] && subscriptions[eventType][uniqueID]) {
        delete subscriptions[eventType][uniqueID];
    }
}