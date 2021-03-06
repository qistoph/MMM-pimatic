/* global Module, Log */

/* Magic Mirror
 * Module: pimatic
 *
 * By Chris van Marle
 * MIT Licensed.
 */

Module.register("pimatic",{

	// Default module config.
	defaults: {
		url: undefined,
		username: undefined,
		password: undefined,
		mappings: []
	},

	pimaticCall: function(uri, params) {
		if (typeof(uri) !== "string") {
			Log.error("Invalid call to pimaticCall, uri must be a string.");
			return;
		}

		this.sendSocketNotification("PIMATIC_API_CALL", {
			"url": this.config.url + "" + uri,
			"username": this.config.username,
			"password": this.config.password,
			"params": params
		});
	},

	notificationReceived: function(notification, payload, sender) {
		if (sender) {
			Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
		} else {
			Log.log(this.name + " received a system notification: " + notification);
		}

		var self = this;
		this.config.mappings.forEach(function(func) {
			var result = func(notification, payload, sender);
			if (result !== undefined) {
				console.log("Sending pimatic api call event: ", result);
				console.log(self);
				self.pimaticCall(result.uri, result.params);
			}
		});
	}
});
