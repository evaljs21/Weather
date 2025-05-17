<template>
	<custom-page class="page" :loaded="loaded">
		<view class="cu-list goods-list" v-if="data.length">
			<view class="cu-item flex padding-sm solid-bottom"
				  v-for="(item,index) in data" :key="item.id"
				  :class="modalName=='move-box-'+ index?'move-cur':''"
				  @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd"
				  :data-target="'move-box-' + index"
				  @tap="linkTo" :data-url="'/pages/mall/goods/detail?id='+item.topic_id">
				<view class="image-wrapper radius lg">
					<image :src="item.favoriteable.cover+'?imageView2/0/q/75/w/160/h/160'" mode="aspectFill"
						   lazy-load="true"></image>
				</view>
				<view class="content flex-sub padding-lr-sm">
					<view class="title ellipsis text-black">
						{{ item.favoriteable.title }}
						<text class="cuIcon-likefill text-red unfavorite-icon" @tap.stop="unFavorite(index)"></text>
					</view>
					<view class="tags margin-top-xs" style="height: 38px;">
						<view class="cu-tag light bg-red sm"
							  v-for="tag in item.favoriteable.tags" :key="tag.id">{{tag.title}}</view>
						<view class="cu-tag light bg-red sm" v-if="item.favoriteable.is_free_freight">包邮</view>
					</view>
				</view>

				<view class="move">
					<view class="bg-red" @tap.stop="unFavorite(index)">删除</view>
				</view>
			</view>
		</view>
		<custom-empty type="favorite" v-else></custom-empty>
	</custom-page>
</template>

<script>
	export default {
		data() {
			return {
				data: [],
				type: 'goods',
				page: 1,
				more: true,
				loaded: false,

				modalName: null,
				listTouchStart: null,
				listTouchMove: null,

				emptyBtns: [{
					text: '添加地址',
					class: 'bg-red',
					to: '/pages/user/address/edit',
				}]
			}
		},
		onLoad() {
			this.loadData();
		},
		onPullDownRefresh() {
			this.loadData().finally(() => {
				uni.stopPullDownRefresh();
			});
		},
		onReachBottom() {
			if (!this.more) {
				return;
			}

			this.loadData(this.page + 1);
		},
		methods: {
			// 加载信息
			loadData: function(page = 1) {
				return uni.$models.user.getFavoriteList({
					page: page,
					topic_type: this.type
				}).then(res => {
					res.data.forEach(it => it.checked = true);
					this.data = page === 1 ? res.data : this.data.concat(res.data);
					this.more = res.data.length >= res.per_page;
					this.page = page;
					this.loaded = true;
				}, (err) => {
					if (!this.loaded) {
						this.loadError = true;
					}

					return Promise.reject(err);
				});
			},

			// 取消收藏
			unFavorite(index) {
				const item = this.data[index];
				return uni.$models.user.unfavorite(item.topic_type, item.topic_id, {
					loading: this,
					hint: this
				}).then(() => {
					this.data.splice(index, 1);
				});
			},

			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = {
					x: e.touches[0].pageX,
					y: e.touches[0].pageY,
				};
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchMove = {
					x: e.touches[0].pageX,
					y: e.touches[0].pageY,
				};

				// e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				const start = this.listTouchStart;
				const move = this.listTouchMove;

				if (!start || !move || Math.abs(move.y - start.y) >= 10) {
					return;
				}

				const direction = move.x - start.x > 0 ? 'right' : 'left';
				if (direction == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
			}
		}
	}
</script>

<style scoped>
	.page {
		background: #F6F6F6;
	}

	.goods-list .cu-item {
		background-color: white;
	}

	.goods-list .cu-item .title {
		position: relative;
		font-size: 16px;
		line-height: 1.2;
		color: #333333;
		height: 18.4px;
	}

	.goods-list .cu-item .image-wrapper {
		width: 86px;
		height: 86px;
	}

	.goods-list>.cu-item.move-cur {
		transform: translateX(-130rpx);
	}

	.goods-list>.cu-item .move {
		top: 0;
		width: 130rpx;
	}

	.unfavorite-icon {
		position: absolute;
		right: 0;
		top: 0;
	}

	.tags .cu-tag {
		padding: 2rpx 4rpx;
		height: auto;
		border-radius: 4rpx;
		margin-right: 5px;
		margin-bottom: 2px;
	}

	.tags .cu-tag+.cu-tag {
		margin-left: 0;
	}

	.m-price {
		font-size: 26rpx;
		text-decoration: line-through;
		margin-left: 10rpx;
		color: #999;
	}
</style>
