<template>
	<view class="order-status margin radius">
		<view class="flex padding-lr padding-top">
			<text class="flex-sub text-bold">更多功能</text>
		</view>
		<view class="cu-list grid col-5 no-border">
			<view class="cu-item" @tap="linkTo" data-url="/pages/user/team/index" data-logged
				  v-if="userInfo.is_distributor">
				<text class="cuIcon-group_fill text-grey"></text>
				<text class="text-sm">分销团队</text>
			</view>
			<view class="cu-item" @tap="linkTo" data-url="/pages/user/wallet/index" data-logged>
				<text class="cuIcon-circlefill text-grey"></text>
				<text class="text-sm">我的钱包</text>
			</view>
			<view class="cu-item" @tap="linkTo" data-url="/pages/user/coupon" data-logged>
				<text class="cuIcon-cardboardfill text-grey"></text>
				<text class="text-sm">优惠券</text>
			</view>
			<view class="cu-item" @tap="linkTo" data-url="/pages/user/address/list" data-logged>
				<text class="cuIcon-locationfill text-grey"></text>
				<text class="text-sm">收货地址</text>
			</view>
			<view class="cu-item" @tap="linkTo" data-url="/pages/user/favorite" data-logged>
				<text class="cuIcon-favorfill text-grey"></text>
				<text class="text-sm">我的收藏</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			userInfo: {
				type: Object,
				default: () => null
			}
		}
	}
</script>

<style scoped>
	.order-status {
		background-color: white;
		overflow: hidden;
		position: relative;
		z-index: 99;
	}

	.icon-wrapper {
		position: relative;
		width: 56rpx;
		height: 56rpx;
		margin: 0 auto;
	}

	.icon-wrapper image {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-color: unset;
	}
</style>
