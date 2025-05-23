<template>
	<view class="loading" v-show="isShowLoading">
		<!-- bounceIn:showLoadingCount, -->
		<view class="cu-load load-modal animated" :class="{bounceOut:!showLoadingCount}"
			:style="'border-color:'+innerBorderColor+';'">
			<image :src="icon" class="margin-top loading-img" mode="aspectFit"></image>
			<view class="gray-text text-xs">{{loadingText}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			icon: {
				type: String,
				default: () => {
					return uni.$config.loadingIcon || '/static/logo.png';
				}
			},
			innerBorderColor: {
				type: String,
				default: () => {
					return uni.$config.loadingInnerColor || '#f37b1d';
				}
			}
		},
		data() {
			return {
				loadingText: '加载中...',
				isShowLoading: false,
				showLoadingCount: 0,
			};
		},
		created: function() {
			this.$root.showLoading = this.showLoading;
			this.$root.hideLoading = this.hideLoading;
		},
		methods: {
			showLoading() {
				this.showLoadingCount++;
				this.isShowLoading = true;
			},

			hideLoading() {
				// this.showLoadingCount--;
				// if (this.showLoadingCount <= 0) {
				// 	this.showLoadingCount = 0;
				// 	setTimeout(() => {
				// 		// this.isShowLoading = false;
				// 	}, 200);
				// }
			},

		}
	}
</script>

<style scoped>
	.loading {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: transparent;
		z-index: 9999;
	}

	.cu-load {
		box-shadow: 0 0 30upx rgba(0, 0, 0, 0.1);
	}

	@keyframes turn {
		0% {
			-webkit-transform: rotate(0deg);
		}

		25% {
			-webkit-transform: rotate(90deg);
		}

		50% {
			-webkit-transform: rotate(180deg);
		}

		75% {
			-webkit-transform: rotate(270deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
		}
	}

	.cu-load.load-modal::after {
		border-left-color: inherit;
	}
</style>
