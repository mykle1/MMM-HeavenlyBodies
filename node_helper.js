/* Magic Mirror
 * Module: MMM-HeavenlyBodies
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getBodies: function(url) {
        request({
            url: "https://api.le-systeme-solaire.net/rest/bodies/",
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).bodies;
                    this.sendSocketNotification('BODIES_RESULT', result);

            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_BODIES') {
            this.getBodies(payload);
        }
    }
});
