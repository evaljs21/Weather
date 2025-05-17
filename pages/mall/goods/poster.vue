<template>
	<custom-page class="page" :loaded="loaded">
		<!-- 		<image src="https://sanxuan.flashnet.cn/images/weapp/bg_poster.png" mode="widthFix" style="width: 100%;">
		</image> -->
		<view v-if="loaded" class="poster">
			<image :src="info.img" mode="widthFix" style="width: 100%;" show-menu-by-longpress="true"></image>
			<view class="footer padding">
				<view class="padding">
					<button class="cu-btn block lg round bg-red" @tap="saveTap">立即保存</button>
				</view>
			</view>
		</view>
	</custom-page>
</template>

<script>
	export default {
		data() {
			return {
				goodsId: 0,
				info: null,
				loaded: false,
				loadError: false,
			}
		},
		onLoad(options) {
			this.goodsId = parseInt(options.goods_id);
			if (isNaN(this.goodsId)) {
				uni.$hintError('参数错误！');
				return uni.$back();
			}

			this.loadData();
		},

		onPullDownRefresh() {
			this.loadData().finally(() => {
				uni.stopPullDownRefresh();
			});
		},


		methods: {
			// 加载数据
			loadData() {
				return uni.$models.mall.getGoodsPoster({
					goods_id: this.goodsId,
					distributor_id: getApp().globalData.distributorId || 0
				}).then(res => {
					this.info = res;
					this.loaded = true;
				}, () => {
					if (!this.loaded) {
						this.loadError = true;
					}
				});
			},

			// 立即保存
			saveTap() {
				// #ifdef H5
				// 直接跳转图片地址
				Location.href = '';
				// #endif
				// #ifndef H5
				uni.showLoading();
				uni.$promise.getImageInfo({
					src: this.info.img
				}).then((res) => {
					return uni.$promise.saveImageToPhotosAlbum({
						filePath: res.path
					});
				}).then(() => {
					uni.hideLoading();
				}, (err) => {
					uni.hideLoading();
					if (err.errMsg.indexOf('cancel') === -1) {
						uni.$hintError('保存失败：' + err.errMsg);
					}
				});
				// #endif
			}
		}
	}
</script>

<style>
	.poster {
		/* 		position: absolute;
		left: 15px;
		right: 15px;
		top: 130rpx; */
	}

	.footer {
		margin-top: -320rpx;
	}

	.foot {
		position: absolute;
		z-index: 99;
		width: 100%;
		left: 0;
		bottom: 30rpx;
	}
</style>
