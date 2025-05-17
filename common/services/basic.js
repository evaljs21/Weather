const $ = uni;

export default {
	// 分享链接
	shareUrl(url) {
		const app = getApp();
		const jumpParams = [];

		let shareUid = 0;
		let distributorId = 0;

		const user = uni.$user.value();
		if (user) {
			shareUid = parseInt(user.id) || 0;
			distributorId = parseInt(user.distributor_id) || 0;
		}

		if (shareUid) {
			jumpParams.push(`share_uid=${shareUid}`);
		}

		if (!distributorId) {
			distributorId = parseInt(app.globalData.distributorId) || 0;
		}

		if (distributorId) {
			jumpParams.push(`distributor_id=${distributorId}`);
		}

		url += (url.indexOf('?') === -1 ? '?' : '&') + jumpParams.join('&');
		console.info('share url:', url);

		return url;
	}
};
