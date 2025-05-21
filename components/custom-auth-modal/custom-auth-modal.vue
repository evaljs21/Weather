<template>
	<view class="cu-modal bottom-modal" :class="{show:isShow}" @tap.stop="onClose">
		<view class="cu-dialog" @tap.stop="">
			<view class="padding-xl">
				<!-- #ifdef MP-WEIXIN -->
				<view class="auth-avatar-warpper">
					<open-data type="userAvatarUrl" default-avatar="/static/icon/default-avatar.png"
							   class="auth-avatar-inner" />
				</view>
				<view class="auth-nickname">
					<open-data type="userNickName" default-text="匿名用户" />
				</view>
				<!-- #endif -->

				<template v-if="sessionKey">
					<button @getphonenumber="decryptPhoneNumber" open-type="getPhoneNumber"
						class="cu-btn bg-red round lg block shadow margin-top" v-if="!phone">授权手机号</button>
					<button @tap="getUserInfo" class="cu-btn bg-red round lg block shadow margin-top" v-else>登
						录</button>
				</template>
				<template v-else>
					<view class="cu-load loading margin-top"></view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				sessionKey: '',
				allowClose: true,
				isShow: false,
			};
		},
		created: function() {
			this.$root.showAuthModal = this.show;
			this.$root.hideAuthModal = this.hide;

			uni.$emitter.on('sys.getUserInfo.to', this.onShowing, true);
		},
		beforeDestroy() {
			if (this.isShow) {
				uni.$emitter.emit('sys.getUserInfo.result', null);
			}
			uni.$emitter.off('sys.getUserInfo.to', this.onShowing);
		},
		methods: {
			getUserInfo(e) {
				uni.getUserProfile({
					lang: 'zh_CN',
					desc: '此操作需要您授权基本信息',
					success: (res) => {
						res.userInfo.phone = this.phone;
						uni.setStorageSync('user_profile', res.userInfo);
						uni.$emitter.emit('sys.getUserInfo.result', res);
						this.hide();
					}
				});
			},
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
			onShowing(options) {
				this.show();

				return false;
			},
			show(allowClose = true) {
				this.allowClose = allowClose;
				this.isShow = true;

				this.loadSessionKey();
			},
			hide() {
				this.isShow = false;
				this.sessionKey = '';
			},
			onClose() {
				if (this.allowClose) {
					uni.$emitter.emit('sys.getUserInfo.result', null);
					this.hide();
				}
			},
			loadSessionKey(force = false) {
				uni.$models.wechat.getSessionKey({
					force: force
				}).then((sessionKey) => {
					this.sessionKey = sessionKey;
				}, () => {
					uni.$emitter.emit('sys.getUserInfo.result', null);
					this.hide();
				});
			},
		}
	}
</script>

<style scoped>
	.auth-avatar-warpper {
		margin: 30upx auto;
		width: 180upx;
		height: 180upx;
		overflow: hidden;
		background-color: white;
		border: 2px solid #e54d42;
		border-radius: 180upx;
	}

	.auth-avatar-inner {
		width: 180upx;
		height: 180upx;
	}

	.auth-nickname {
		font-size: 19px;
		text-align: center;
	}
</style>
