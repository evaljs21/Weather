<template>
	<view class="cu-list goods-list" :class="{
		'goods-list-horizontal':horizontal||row,
		'goods-list-horizontal-row':row,
	}" v-if="list.length">
		<view class="cu-item padding"
			  v-for="item in list"
			  :key="item.id"
			  :class="{
				  'radius':radius
			  }"
			  @tap="linkTo" :data-url="'/pages/mall/goods/detail?id='+item.id">
			<view class="image-wrapper" :class="{
				'radius':radius||!(horizontal||row)
			}">
				<image :src="item.cover+'?imageView2/0/q/75'" class="goods-image" mode="aspectFill" lazy-load="true"></image>
			</view>
			<view class="content">
				<view class="goods-title">{{ item.title }}</view>
				<view class="tags margin-top-xs">
					<view class="cu-tag light bg-red sm"
						  v-for="tag in item.tags" :key="tag.id">{{tag.title}}</view>
					<view class="cu-tag light bg-red sm" v-if="item.is_free_freight">包邮</view>
				</view>
				<view class="flex align-center">
					<view class="flex-sub">
						<view class="flex flex-wrap margin-top-xs">
							<text class="text-price text-red">{{ item.show_price || item.price }}</text>
							<text class="text-xs text-red" style="line-height: 18px;">/件</text>
							<text v-if="item.market_price > item.price"
								  class="m-price margin-left-xs">￥{{ item.market_price }}</text>
						</view>
						<view class="text-gray text-sm flex flex-wrap margin-top-xs" v-if="isShowSale">
							<text class="sales">{{ item.sale_count || 0 }}人已购买</text>
						</view>
					</view>
					<view class="action" v-if="isShowBuyBtn">
						<button class="cu-btn round bg-green sm margin-right-xs" @tap.stop="buyTap(item)">购买</button>
					</view>
				</view>
			</view>
		</view>
	</view>
	<custom-empty @refresh="$emit('refresh')" v-else />
</template>

<script>
	export default {
		data() {
			return {};
		},
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
			isShowSale: { type: Boolean, default: true },
			isShowBuyBtn: { type: Boolean, default: false },
			radius: { type: Boolean, default: false },
			horizontal: { type: Boolean, default: false },
			row: { type: Boolean, default: false },
		},
		created() {},
		methods: {
			buyTap: function(item) {
				this.$emit('sampletap', item);
			}
		},
		watch: {
			list(list) {
				if (this.loadType === 'add') {
					this.renderList = this.renderList.concat(list.slice(this.renderList.length));
				} else {
					this.renderList = list;
				}
			}
		},
	}
</script>

<style scoped lang="scss">
	.goods-list {
		// background-color: white;
	}

	.image-wrapper {
		width: 212rpx;
		height: 212rpx;
		margin-right: 20rpx;
		border-radius: 6rpx;
		float: left;
		overflow: hidden;
	}

	.cu-item {
		background-color: white;
	}

	.cu-item::after {
		content: '';
		height: 0;
		display: block;
		clear: both;
	}

	.goods-title {
		color: black;
		font-size: 16px;
		line-height: 1.2;
		height: 38.4px;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: normal !important;
		word-wrap: break-word;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.text-price {
		font-size: 16px;
		font-weight: bold;
	}

	.m-price {
		font-size: 20rpx;
		text-decoration: line-through;
		margin-left: 10rpx;
		color: #999;
	}

	.tags {
		.cu-tag {
			padding: 2rpx 4rpx;
			height: auto;
			border-radius: 4rpx;
			margin-right: 5px;
			margin-bottom: 2px;
		}

		.cu-tag+.cu-tag {
			margin-left: 0;
		}
	}

	.goods-list-horizontal {
		display: flex;
		overflow-x: auto;
		align-items: stretch;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.goods-list-horizontal>.cu-item {
		width: 40%;
		flex: none;
		margin-right: 30rpx;
		display: inline-block;
	}

	.goods-list-horizontal::after {
		content: ' ';
		display: block;
		width: 30rpx;
		white-space: pre;
	}

	.goods-list-horizontal .image-wrapper {
		float: none;
		margin: -30rpx -30rpx 0 -30rpx;
		width: unset;
		display: block;
		padding-bottom: 100%;
	}

	.goods-list-horizontal .image-wrapper .goods-image {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.goods-list-horizontal .content {
		margin-top: 10rpx;
	}

	.goods-list-horizontal .goods-title {
		line-height: 1.2;
		font-size: 14px;
		height: auto;

		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.goods-list-horizontal-row {
		flex-wrap: wrap;
	}

	.goods-list-horizontal-row>.cu-item {
		width: calc(50% - 16rpx);
		margin-bottom: 30rpx;
	}

	.goods-list-horizontal-row>.cu-item:nth-child(even) {
		margin-right: 0;
	}
</style>
