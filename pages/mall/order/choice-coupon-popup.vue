<template>
	<view class="cu-modal bottom-modal" :class="isShow?'show':''" @tap="cancel">
		<view class="cu-dialog coupon-dialog" @tap.stop.prevent="stopPrevent">
			<view class="text-bold padding header">选择优惠券</view>
			<view class="coupon-list" v-if="showList.length">
				<view v-for="userCoupon in showList" :key="userCoupon.id" class="margin coupon">
					<custom-coupon :coupon="userCoupon.coupon"
								   @actiontap="confirm(userCoupon)"></custom-coupon>
				</view>
			</view>
			<custom-empty type="coupon" v-else></custom-empty>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: Array
		},
		computed: {
			showList() {
				this.list.forEach((item) => {
					Object.assign(item.coupon, {
						color: '#FF3456',
						ltBg: "#FFFFFF",
						height: '180rpx',
						title: item.coupon.title,
						number: item.coupon.number_text,
						use_tips: item.coupon.use_tips,
						desc: "有效期至 " + (item.expire_time || item.coupon.end_time),
						btn: "使用",
					});
				});

				return this.list;
			}
		},
		data() {
			return {
				isShow: false
			};
		},
		methods: {

			// 关闭弹窗
			close() {
				// this.type = '';
				this.isShow = false;
			},

			// 取消弹框
			cancel() {
				this.close();

				if (this.$options.resolve) {
					this.$options.resolve({
						cancel: true,
						confirm: false,
					});
				}

				this.$options.resolve = null;
			},

			// 确认弹框
			confirm(userCoupon) {
				this.close();

				if (this.$options.resolve) {
					this.$options.resolve({
						cancel: false,
						confirm: true,
						userCoupon: userCoupon,
					});
				}

				this.$options.resolve = null;
			},

			// 显示弹窗
			choice() {
				this.isShow = true;

				return new Promise((resolve, reject) => {
					this.$options.resolve = resolve;
				});
			}
		}
	}
</script>

<style scoped>
	.coupon-dialog {
		max-height: 500px;
		transform: translate(0, 0);
		text-align: left;
		background-color: #F9F9F9;
		border-radius: 12rpx 12rpx 0 0;
		max-width: 1120rpx;
		padding-top: 48px;
	}

	.header {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 9999;
		background-color: white;
		text-align: center;
	}

	.coupon-list {
		overflow-y: auto;
		min-height: 100%;
		max-height: 452px;
	}
</style>
