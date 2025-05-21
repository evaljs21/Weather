<template>
	<custom-page class="page" :loaded="true">
		<view class="tips">
			<!-- #ifndef H5 -->
			<open-data class="avatar" type="userAvatarUrl"></open-data>
			<open-data class="nickname" type="userNickName"></open-data>
			<!-- #endif -->
			<view>为了你能够更好的体验，本应用需要获取你的基本信息（昵称、头像等）</view>
		</view>
		<view class="container">
			<template v-if="sessionKey">
				<button @getphonenumber="decryptPhoneNumber" open-type="getPhoneNumber"
					class="cu-btn bg-blue lg block shadow margin-top" v-if="!phone">授权手机号</button>
				<button @tap="getUserInfo" class="cu-btn bg-blue lg block shadow margin-top" v-else>登
					录</button>
			</template>
			<template v-else>
				<view class="cu-load loading margin-top"></view>
			</template>
		</view>
	</custom-page>
</template>

<script>
	export default {
		name: 'auth',
		data() {
			return {
				phone: '',
				userInfo: null,
				sessionKey: '',
			};
		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			uni.$emitter.emit('sys.getUserInfo.result', this.userInfo);
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.loadSessionKey(true);
		},

		methods: {
			/**
			 * 获取用户信息
			 */
			getUserInfo: function(e) {
				uni.getUserProfile({
					lang: 'zh_CN',
					desc: '此操作需要您授权基本信息',
					success: (res) => {
						res.userInfo.phone = this.phone;
						this.userInfo = res;
						this.userInfo.phone = this.phone;
						uni.setStorageSync('user_profile', res.userInfo);
						uni.navigateBack();
					}
				});
			},

			// 解码手机号
			decryptPhoneNumber(e) {
				if (!e.detail.code && !e.detail.encryptedData) {
					return;
				}
				uni.$models.wechat.decryptPhoneNumber({
					code: e.detail.code,
					iv: e.detail.iv,
					encryptedData: e.detail.encryptedData,
					session_key: this.sessionKey
				}).then((res) => {
					this.phone = res.phoneNumber;
				}, () => {
					this.loadSessionKey(true);
				});
			},

			// 加载sessionkey
			loadSessionKey(force = false) {
				uni.$models.wechat.getSessionKey({
					force: force
				}).then((sessionKey) => {
					this.sessionKey = sessionKey;
				}, () => {
					uni.$back(1500);
				});
			},
		}
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.auth {}

	.avatar {
		display: block;
		text-align: center;
		background: #ccc;
		color: #fff;
		white-space: nowrap;
		position: relative;
		overflow: hidden;
		width: 128rpx;
		height: 128rpx;
		line-height: 128rpx;
		border-radius: 64rpx;
		font-size: 72px;
		margin: 0 auto;
	}

	.nickname {
		display: block;
		text-align: center;
		font-weight: bold;
		margin-top: 32rpx;
		margin-bottom: 32rpx;
	}

	.tips {
		position: relative;
		padding: 15% 30rpx 30rpx 30rpx;
	}

	.tips icon {
		display: block;
		text-align: center;
		line-height: 2rem;
	}
</style>
