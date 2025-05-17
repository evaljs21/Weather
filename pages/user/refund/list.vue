<template>
	<custom-page class="page" :loaded="loaded">
		<!-- 订单列表 -->
		<template v-if="data.length">
			<view class="cu-card dynamic no-card margin-top" v-for="(item,index) in data" :key="item.id">
				<view class="cu-item shadow" @tap="linkTo" :data-url="'./detail?id='+item.id">
					<view class="padding flex flex-wrap">
						<text class="flex-sub">{{item.create_time}}</text>
						<text class="type">
							<template v-if="item.type==0">
								<text class="cuIcon-refund text-red text-lg margin-right-xs"></text>
								<text>退款</text>
							</template>
							<template v-else-if="item.type==1">
								<text class="cuIcon-refund text-red text-lg margin-right-xs"></text>
								<text>退货</text>
							</template>
							（{{ item.stateTip }}）
						</text>
					</view>
					<!-- 商品列表 -->
					<view class="cu-list goods-list">
						<view class="cu-item flex padding-sm">
							<view class="image-wrapper radius lg">
								<image :src="item.order_goods.goods_cover" mode="aspectFit" lazy-load="true"></image>
							</view>
							<view class="content flex-sub padding-lr-sm">
								<view class="title ellipsis-2 text-black">{{ item.order_goods.goods_title }}</view>
								<view class="text-gray text-sm margin-top-xs">
									<text>{{ item.order_goods.goods_spec || '' }}</text>
								</view>
							</view>
							<view class="action">
								<view class="text-price text-lg text-right">{{ item.order_goods.goods_price }}</view>
								<view class="text-black text-sm text-right">×{{ item.order_goods.goods_num }}</view>
							</view>
						</view>
					</view>

					<!-- 商品价格信息 -->
					<view class="padding-lr flex justify-end text-sm">
						<view class="text-black margin-left">
							<text class="">实付：</text>
							<text class="text-price text-lg"> {{ item.order_goods.total_price }}</text>
						</view>
						<view class="text-black margin-left">
							<text class="">退款金额：</text>
							<text class="text-price text-red text-lg"> {{ item.refund_amount }}</text>
						</view>
					</view>

					<view class="flex justify-end padding-lr padding-tb-sm">
						<button class="cu-btn round text-sm margin-left-sm"
								@tap.stop.prevent="onDeleteRefund(index)" v-if="item.status===0">删除售后单</button>
						<button class="cu-btn round text-sm margin-left-sm"
								@tap.stop.prevent="onCancelRefund(index)" v-if="item.status===10">取消申请</button>
						<button class="cu-btn round text-sm margin-left-sm"
								@tap.stop.prevent="linkTo" :data-url="'./express?id='+item.id"
								v-if="item.status==20">填写发货物流</button>
						<button class="cu-btn round bg-red text-sm margin-left-sm" @tap="linkTo"
								:data-url="'./detail?id='+item.id">查看详情</button>
					</view>

				</view>
			</view>
		</template>
		<custom-empty type="order" v-else></custom-empty>
	</custom-page>
</template>

<script>
	import refundMixin from './refund-mixins.js';
	import refundListMixin from './refund-list-mixins.js';

	export default {
		mixins: [refundMixin, refundListMixin],
		data() {
			return {
				data: [],
				page: 1,
				more: true,
				keywords: '',
				loaded: false,
			};
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
			// 加载数据
			loadData: function(page = 1) {
				return uni.$models.order.getRefundList({
					keywords: this.keywords,
					page: page,
				}).then(res => {
					this.data = page === 1 ? res.data : this.data.concat(res.data);
					this.more = res.data.length >= res.per_page;
					this.page = page;
					this.loaded = true;
				}, () => {
					uni.navigateBack();
				});
			},

			// 删除售后单
			onDeleteRefund(index) {
				uni.showModal({
					title: '温馨提示',
					content: '你确定要删除售后单吗？',
					showCancel: true,
					success: res => {
						const item = this.data[index];
						uni.$models.order.deleteRefund(item.id).then(() => {
							this.data.splice(index, 1);
						});
					},
				});
			},

			// 取消售后单
			onCancelRefund(index) {
				uni.showModal({
					title: '温馨提示',
					content: '你确定要取消售后申请吗？',
					showCancel: true,
					success: res => {
						if (res.cancel) {
							return;
						}

						const item = this.data[index];
						uni.$models.order.cancelRefund(item.id).then(() => {
							item.status = 0;

							const { stateTip, stateTipColor } = uni.$models.order.parseRefundState(
								item.status
							);
							item.stateTip = stateTip;
							item.stateTipColor = stateTipColor;
						});
					},
				});
			}
		}
	}
</script>

<style scoped>
	.goods-list .cu-item .title {
		font-size: 16px;
		line-height: 1.2;
		font-weight: bold;
		color: #333333;
		height: 38.4px;
	}

	.goods-list .cu-item .image-wrapper {
		width: 160rpx;
		height: 160rpx;
	}

	.m-price {
		font-size: 26rpx;
		text-decoration: line-through;
		margin-left: 10rpx;
		color: #999;
	}
</style>
