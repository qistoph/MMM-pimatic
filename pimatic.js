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
		pimaticUrl: undefined,
		pimaticUser: undefined,
		pimaticPass: undefined,
		mappings: [
			/*function(notification, payload, sender) {
				if (notification == "USER_PRESENCE" && payload == true) {
					return {'device': 'magicmirror-presence', 'action': 'changePresenceTo', 'params': {'presence': 'true'}};
				}
			}*/
			function(notification, payload, sender) {
				if (notification == "USER_PRESENCE") {
					return {"uri": "device/magicmirror-presence/changePresenceTo", "params": {"presence": (payload === true) }};
				}
			}
		]
	},

	pimaticCall: function(uri, params) {
		if (typeof(uri) !== "string") {
			Log.error("Invalid call to pimaticCall, uri must be a string.");
			return;
		}

		this.sendSocketNotification("PIMATIC_API_CALL", {
			"url": this.config.pimaticUrl + "" + uri,
			"username": this.config.pimaticUser,
			"password": this.config.pimaticPass,
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
