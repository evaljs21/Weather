export default {
	// 获取SessionKey
	getSessionKey(options = {}) {
		let sessionKey = uni.$cache.get('session_key');
		if (sessionKey && options.force !== true) {
			return Promise.resolve(sessionKey);
		}

		return uni.$promise.login().then((res) => {
			return uni.$http.post('wechat/code2session', {
				code: res.code
			}, {
				loading: false,
				successTips: false
			});
		}).then((res) => {
			uni.$cache.set('session_key', res.session_key, 7000);
			return res.session_key;
		});
	},

	// 解密微信用户手机号信息
	decryptPhoneNumber(data, options) {
		return uni.$http.post('wechat/decryptPhoneNumber', data, {
			successTips: false
		});
	},
}
