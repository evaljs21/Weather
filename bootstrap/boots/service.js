import $ from "../$";

let services = null;

try {
	services = require('../../common/services/index.js');

	if (typeof services === 'function') {
		services = services();
	}

	for (const key in services) {
		if (services.hasOwnProperty(key)) {
			$.$define('key', services[key]);
		}
	}
} catch (e) {
	console.warn("/common/services/index.js not found!");
	services = {};
}
