<template>
	<custom-page class="page" :loaded="true">
		<mescroll-body ref="mescrollRef" :up="{use:false}" @init="mescrollInit"
					   @down="downCallback" @up="upCallback">

			<view class="userinfo" :style="{
				'margin-bottom':userInfo && userInfo.is_vip?'-106rpx':'-76rpx',
				'padding-top':(CustomBar*0.7)+'px'
			}">
				<image class="bg" src="/static/bg/user.png" mode="aspectFill"></image>
				<view class="userinfo-inner flex" data-logged
					  v-if="hasUserInfo">
					<image :src="userInfo.avatar" background-size="cover"
						   class="cu-avatar xl round userinfo-avatar"></image>
					<view class="flex-sub padding-lr">
						<view class="">
							<text class="userinfo-nickname"><text>Hi，</text>{{ userInfo.nickname }}</text>
							<view class="user-vip-title" v-if="userInfo.is_vip">
								<image src="../../static/icon/user-vip-title.png" mode="widthFix"></image>
								<text>会员</text>
							</view>
						</view>
						<view class="text-white" v-if="userInfo.parent_user_id">
							我的推荐人：{{userInfo.parent_user_nickname}}
						</view>
					</view>
					<view class="">
						<!-- #ifdef MP-WEIXIN -->
						<button type="default" open-type="contact" class="none">
							<text class="cuIcon-service text-white"></text>
						</button>
						<!-- #endif -->
					</view>
				</view>
				<view v-else>
					<!-- #ifdef MP-WEIXIN -->
					<view class="userinfo-inner flex">
						<view class="cu-avatar xl round userinfo-avatar">
							<open-data type="userAvatarUrl" default-avatar="/static/icon/default-avatar.png"
									   class="userinfo-avatar-inner" />
						</view>
						<view class="flex-sub padding-lr">
							<view class="userinfo-nickname">
								<text>Hi，</text>
								<open-data type="userNickName" default-text="匿名用户" />
							</view>
						</view>
					</view>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<button @tap="onLogin" class="cu-btn bg-red lg block shadow"
							open-type="getUserInfo">登 录</button>
					<!-- #endif -->
				</view>
			</view>

<!--			<view class="user-vip" @tap="linkTo" data-url="/pages/user/vip/apply" data-logged v-if="!userInfo.is_vip">-->
<!--				<template v-if="userInfo.vip_apply && userInfo.vip_apply.status!==1">-->
<!--					<image src="../../static/bg/user-vip-status.png" mode="widthFix" style="width:100%"></image>-->
<!--				</template>-->
<!--				<template v-else>-->
<!--					<image src="../../static/bg/user-vip.png" mode="widthFix" style="width:100%"></image>-->
<!--				</template>-->
<!--			</view>-->

			<!-- style="background-color: rgba(255,255,255,0.3);" -->
			<view class="grid col-3 margin padding-tb-sm text-center bg-white radius-lg">
				<view class="padding-sm" @tap="linkTo" data-url="/pages/user/wallet/index">
					<text class="num">{{userInfo.balance||'0.00'}}</text>
					<text class="text-sm">余额</text>
				</view>
				<view class="padding-sm" @tap="linkTo" data-url="/pages/user/coupon">
					<text class="num">{{userInfo.coupon_count||'0'}}</text>
					<text class="text-sm">优惠券</text>
				</view>
				<view class="padding-sm" @tap="linkTo" data-url="/pages/user/score">
					<text class="num">{{userInfo.score||'0'}}</text>
					<text class="text-sm">积分</text>
				</view>
			</view>

			<OrderStatusNav :info="config.order_status_count" />

			<MenuList :userInfo="userInfo" />

		</mescroll-body>

	</custom-page>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
	import OrderStatusNav from './components/order-status-nav.vue';
	import MenuList from './components/menu-list2.vue';

	export default {
		mixins: [MescrollMixin],
		components: {
			OrderStatusNav,
			MenuList
		},
		data() {
			return {
				config: {},
				userInfo: {},
				hasUserInfo: false,

				isFirst: true,
				CustomBar: this.CustomBar,
				// #ifdef H5
				showNavbar: false,
				// #endif
				// #ifndef H5
				showNavbar: true,
				// #endif
			};
		},

		onLoad: function(options) {},
		onShow: function() {
			if (this.isFirst) {
				this.isFirst = false;
				return;
			}

			this.downCallback();
		},
		onHide: function() {},

		methods: {
			onLogin(options) {
				console.log(options);
			},

			getUserInfo(e) {
				const data = e.detail.value;
				console.log(data)
			},

			downCallback() {
				// this.mescroll.resetUpScroll();
				uni.$models.user.center().then((res) => {
					this.userInfo = res.userinfo;
					this.config = res.config;
					this.hasUserInfo = true;
				}).finally(() => {
					this.mescroll.endSuccess();
					// uni.stopPullDownRefresh({ sound: true });
				});
				// uni.$getUserInfo({
				// 	firstLoad: true
				// }).then((res) => {
				// 	console.log(res)
				// 	this.userInfo = res;
				// 	this.hasUserInfo = true;
				// }).finally(() => {
				// 	this.mescroll.endSuccess();
				// 	// uni.stopPullDownRefresh({ sound: true });
				// });
			},

			sync() {
				console.log('同步用户信息...')
				uni.$models.user.syncWechat({
					force: true
				});
			},
		}
	};
</script>

<style>
	.page {
		padding-bottom: 30rpx;
		background-color: #f1f1f1;
	}

	.userinfo {
		background-color: white;
		box-sizing: border-box;
		overflow: hidden;
		position: relative;
		min-height: 375rpx;
		margin-bottom: -60rpx;
	}

	.userinfo image.bg {
		position: absolute;
		width: 100%;
		height: 375rpx;
		left: 0;
		top: 0;
	}

	.userinfo .userinfo-inner {
		/* 		display: flex;
		flex-direction: column; */
		align-items: center;
		position: relative;
		padding: 20rpx 30rpx 60rpx;
	}

	.userinfo-avatar {
		width: 128rpx;
		height: 128rpx;
		border-radius: 128rpx;
		background-color: white;
		border: 2px solid #fff;
		overflow: hidden;
	}

	.userinfo-avatar>.userinfo-avatar-inner {
		width: 128rpx;
		height: 128rpx;
	}

	.userinfo-nickname {
		/* color: #343434; */
		font-size: 19px;
		color: #fff;
	}

	.userinfo .grid {
		position: absolute;
		bottom: 30rpx;
		width: calc(100% - 60rpx);
	}

	.num {
		margin-bottom: 10px;
		font-size: 16px;
		color: #333;
		font-weight: 700;
	}

	.grid image {
		width: 64rpx;
		height: 64rpx;
		margin: 10rpx auto;
		display: block;
		background-color: #f9f9f9;
	}

	.grid text {
		display: block;
		text-align: center;
	}


	.cu-list.card-menu {
		border-radius: 6rpx;
	}

	.user-vip-title {
		position: relative;
		z-index: 99;
		display: inline-block;
		vertical-align: middle;
		width: 140rpx;
		padding-left: 45rpx;
		font-size: 20rpx;
		line-height: 40rpx;
	}

	.user-vip-title image {
		position: absolute;
		width: 100%;
		left: 0;
		z-index: -1;
	}

	.user-vip {
		position: relative;
		margin: 0 15px;
	}
</style>
