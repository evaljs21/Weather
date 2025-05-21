<template>
	<custom-page class="page" :loaded="true" :showTechnicalSupport="false">
		<view class="back-btn cuIcon-close" @click="navBack"></view>

		<view class="left-bottom-sign"></view>
		<view class="right-top-sign"></view>

		<form class="form-wrapper" @submit="onSubmit">
			<view class="left-top-sign">REGISTER</view>
			<view class="welcome">
				欢迎加入！
			</view>
			<view class="form-group margin-lr">
				<view class="cu-form-group">
					<input id="mobile" v-model="form.mobile" placeholder="手机号" type="number" />
				</view>
				<view class="cu-form-group">
					<input v-model="form.code" placeholder="验证码" type="number" />
					<custom-verify-code url="/verify_code" :mobile="form.mobile" />
				</view>
				<view class="cu-form-group">
					<input id="password" v-model="form.password" placeholder="密码" type="password" />
				</view>
				<view class="cu-form-group" style="border-bottom: 1rpx solid #eee;">
					<input id="password" v-model="form.repassword" placeholder="确认密码" type="password" />
				</view>
			</view>

			<view class="block text-sm margin-lr margin-top" @tap="checkAgreement">
				<text :class="agreement?'cuIcon-roundcheckfill text-blue':'cuIcon-roundcheck'"></text>
				<text class="title">请认真阅读并同意</text>
				<text class="text-blue" @click="navToAgreementDetail('member')">《用户服务协议》</text>
				<text class="text-blue" @click="navToAgreementDetail('privacy')">《隐私权政策》</text>
			</view>

			<view class="form-btn-group margin-lr margin-top">
				<button class="cu-btn block lg" form-type='submit'>登录</button>
			</view>
			<navigator class="toPageTips" url="./login" open-type="redirect">已有账号，去登录</navigator>
		</form>
	</custom-page>
</template>

<script>
	export default {
		data() {
			return {
				agreement: false,
				form: {
					mobile: '',
					code: '',
					password: '',
					repassword: '',		//重复密码
				}
			};
		},
		methods: {
			// 返回上一页
			navBack() {
				if (getCurrentPages().length > 1) {
					uni.navigateBack();
				} else {
					uni.redirectTo({
						url: '/pages/index/index'
					});
				}
			},
			//同意协议
			checkAgreement() {
				this.agreement = !this.agreement;
			},
			//打开协议
			navToAgreementDetail(name) {
				uni.navigateTo({
					url: '/pages/auth/agreement?name=' + name
				})
			},

			/**
			 * 登录
			 */
			onSubmit: function(e) {
				const data = e.detail.value;
				if (!this.agreement) {
					return uni.$hintError('请先确认用户服务协议与隐私权政策！');
				}

				uni.$http.post('register', this.form, {
					loading: this,
					hint: this
				}).then(function() {
					uni.$hintSuccess('注册成功！');
					uni.redirectTo({
						url: './login',
					})
				});
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	.page {
		position: relative;
		width: 100vw;
		height: 100vh;
		max-width: 1120rpx;
		overflow: hidden;
		background: #fff;
	}


	.back-btn {
		position: absolute;
		left: 20rpx;
		top: calc(var(--status-bar-height) + 20rpx);
		z-index: 90;
		padding: 20rpx;
		font-size: 48rpx;
		color: #606266;
	}

	.left-top-sign {
		font-size: 120rpx;
		color: #f8f8f8;
		position: relative;
		left: -12rpx;
	}

	.right-top-sign {
		position: absolute;
		top: 80rpx;
		right: -30rpx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400rpx;
			height: 80rpx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-top-right-radius: 50px;
		}

		&:after {
			position: absolute;
			right: -198rpx;
			top: 0;
			transform: rotate(-50deg);
			border-top-left-radius: 50px;
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270rpx;
		bottom: -320rpx;
		border: 100rpx solid #d0d1fd;
		border-radius: 50%;
		padding: 180rpx;
	}

	.form-wrapper {
		position: relative;
		z-index: 90;
		top: 15vh;
	}

	.welcome {
		position: relative;
		left: 50rpx;
		top: -90rpx;
		font-size: 46rpx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}
	.toPageTips{padding: 20rpx ;margin-top: 20rpx;display: inline-block;font-size: 12px;color: #0081ff;margin-left: 30rpx;}
</style>
