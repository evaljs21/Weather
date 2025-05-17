<template>
	<view class="cu-list goods-list" v-if="list.length">
		<template v-for="(item,index) in list">
			<view class="cu-item flex padding-sm" :id="'main-'+item.id" :key="item.id"
				  @tap="linkTo" :data-url="'/pages/mall/goods/detail?id='+item.id">
				<view class="image-wrapper radius lg">
					<image :src="item.cover+'?imageView2/0/q/75/w/120/h/120'" mode="aspectFill" lazy-load="true"></image>
				</view>
				<view class="content flex-sub">
					<view class="title text-black">{{ item.title }}</view>
					<view class="tags margin-top-xs">
						<view class="cu-tag light bg-red sm"
							  v-for="tag in item.tags" :key="tag.id">{{tag.title}}</view>
						<view class="cu-tag light bg-red sm" v-if="item.is_free_freight">包邮</view>
					</view>
					<view class="flex margin-top-xs">
						<view class="flex-sub margin-right-xs">
							<text class="text-price text-red text-lg text-bold">{{ item.show_price || item.price }}</text>
							<text v-if="item.market_price > item.price"
								  class="m-price">￥{{ item.market_price }}</text>
						</view>
						<view class="flex-sub text-right" style="white-space: nowrap;">
							<button class="cu-btn bg-green sm margin-right-xs" @tap.stop="buyTap(item)">购买</button>
							<button class="cu-btn bg-red sm cuIcon" @tap.stop="shoppingCardTap(item)">
								<text class="cuIcon-cartfill text-lg" style="vertical-align: middle;"></text>
							</button>
						</view>
					</view>
					<!-- <view class="text-gray text-sm flex flex-wrap margin-top-xs">
						<text class="sales">{{ item.sale_count || 0 }}人已购买</text>
					</view> -->
				</view>
			</view>
		</template>
	</view>
	<custom-empty v-else></custom-empty>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: () => ([])
			}
		},
		methods: {
			buyTap(e) {
				this.$emit('buytap', e);
			},
			shoppingCardTap(e) {
				this.$emit('shoppingcart', e);
			}
		}
	}
</script>

<style>
	.goods-list .cu-item {
		/* background-color: white; */
	}

	.goods-list .cu-item .title {
		color: #333333;
		font-size: 14px;
		line-height: 1.2;
		height: 16px;
		/* height: 33.6px; */

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: normal !important;
		word-wrap: break-word;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.goods-list .cu-item .image-wrapper {
		width: 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
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

	.tags {}

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

	.tags-a .cu-tag {
		background-color: transparent;
		margin-left: 0;
	}
</style>
