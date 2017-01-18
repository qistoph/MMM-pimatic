/* Magic Mirror
 * Module: pimatic
 *
 * By Chris van Marle
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({
	start: function() {
		console.log("Starting node helper for: " + this.name);
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "PIMATIC_API_CALL") {
			var opts = {
				url: payload.url,
				qs: payload.params,
				method: "GET",
				auth: {
					user: payload.username,
					password: payload.password
				}
			};

			request(opts, function(err, res, body) {
				if (err) {
					console.log(err);
					return;
				}
			});
		}
	},
});
