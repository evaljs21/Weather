<template>
	<custom-page class="page" :loaded="loaded">

		<view class="status-tips bg-gradual-orange">
			<view class="">
				{{info.stateTip}}
			</view>
			<view class="">￥{{info.refund_amount}}</view>
		</view>

		<!-- 售后信息 -->
		<view class="bg-white margin-top">
			<view class="cu-bar bottom-border">
				<view class="action">
					<text class="cuIcon-titles text-red"></text>
					<text>售后信息</text>
				</view>
			</view>

			<view class="cu-list goods-list">
				<view v-for="(item,index) in info.order_goods_list" :key="item.id" class="cu-item padding-sm">
					<view class="flex goods-info">
						<view class="image-wrapper radius lg">
							<image :src="item.goods_cover" mode="aspectFit" lazy-load="true"></image>
						</view>
						<view class="content flex-sub padding-lr-sm">
							<view class="title ellipsis-2 text-black">{{ item.goods_title }}</view>
							<view class="text-gray text-sm margin-top-xs">
								<text>{{ item.goods_spec || '' }}</text>
							</view>
						</view>
						<view class="action">
							<view class="text-price text-red text-lg text-bold text-right">
								{{ item.goods_price }}</view>
							<view class="text-black text-sm text-right">×{{ item.goods_num }}</view>
						</view>
					</view>
					<view class="text-sm margin-top-sm">
						<view class="flex margin-top-sm">
							<view class="title">退款原因：</view>
							<view class="flex-sub">{{info.apply_desc}}</view>
						</view>
						<view class="flex margin-top-sm">
							<view class="title">退款金额：</view>
							<view class="flex-sub">￥{{info.refund_amount}}</view>
						</view>
						<view class="flex margin-top-sm">
							<view class="title">申请时间：</view>
							<view class="flex-sub">{{info.create_time | date(true)}}</view>
						</view>
						<view class="flex margin-top-sm">
							<view class="title">售后单号：</view>
							<view class="flex-sub">{{info.refund_no}}</view>
							<view class="text-blue" @tap="copy(info.refund_no)">复制</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 卖家收货地址信息 -->
		<view class="bg-white margin-top" v-if="info.audit_status==1">
			<view class="cu-bar bottom-border">
				<view class="action">
					<text class="cuIcon-titles text-red"></text>
					<text>卖家收货地址信息</text>
				</view>
				<view class="action text-blue text-sm" @tap="onCopyReceiver">复制</view>
			</view>
			<view class="flex align-center padding">
				<view class="text-xxl margin-right-sm">
					<text class="cuIcon-locationfill text-pink"></text>
				</view>
				<view class="flex-sub">
					<view class="text-black">
						<text class="margin-right-xs">{{ info.receiver_name }}</text>
						<text class="text-gray">{{ info.receiver_phone }}</text>
					</view>
					<view class="text-black">
						<text>{{ info.receiver_province }}</text>
						<text class="margin-left-xs">{{ info.receiver_city }}</text>
						<text class="margin-left-xs">{{ info.receiver_district }}</text>
						<text class="margin-left-xs">{{ info.receiver_address }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="cu-bar bg-white foot flex justify-end padding-lr">
			<button class="cu-btn round text-sm margin-left-sm"
					@tap.stop.prevent="onDeleteRefund" v-if="info.status===0">删除售后单</button>
			<button class="cu-btn round text-sm margin-left-sm"
					@tap.stop.prevent="onCancelRefund" v-if="info.status===10">取消申请</button>
			<button class="cu-btn round text-sm margin-left-sm" @tap.stop.prevent="linkTo"
					:data-url="'/pages/user/refund/express?id='+info.id"
					v-if="info.status==20">填写发货物流</button>
		</view>

	</custom-page>
</template>

<script>
	import refundMixin from './refund-mixins.js';
	export default {
		mixins: [refundMixin],
		data() {
			return {
				id: 0,
				info: null,
				loaded: false
			};
		},
		onLoad(options) {
			this.id = parseInt(options.id);

			if (isNaN(this.id)) {
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
				return uni.$models.order.getRefundDetail(this.id).then(res => {
					this.info = res;
					this.loaded = true;
				});
			},

			// 复制收货信息
			onCopyReceiver() {
				uni.setClipboardData({
					data: [
						"联系人：" + this.info.receiver_name,
						"手机号：" + this.info.receiver_phone,
						"收货地址：" + this.info.receiver_province + this.info.receiver_city +
						this.info.receiver_district + this.info.receiver_address,
					].join('\n'),
					success: () => {
						uni.$hintSuccess("已复制");
					}
				});
			},

			// 删除售后单
			onDeleteRefund(index) {
				uni.showModal({
					title: '温馨提示',
					content: '你确定要删除售后单吗？',
					showCancel: true,
					success: res => {
						uni.$models.order.deleteRefund(this.info.id).then(() => {
							uni.$back();
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
						uni.$models.order.cancelRefund(this.info.id).then(() => {
							this.info.status = 0;
							const { stateTip, stateTipColor } = uni.$models.order.parseRefundState(
								this.info.status
							);
							this.info.stateTip = stateTip;
							this.info.stateTipColor = stateTipColor;
						});
					},
				});
			}
		}
	}
</script>

<style scoped>
	.page {
		padding-bottom: 130rpx;
	}

	.status-tips {
		padding: 100rpx 30rpx;
		text-align: center;
		font-size: 24px;
		font-weight: bold;
	}

	.goods-list .goods-info .title {
		color: #333333;
		height: 38px;
	}

	.goods-list .goods-info .image-wrapper {
		width: 120rpx;
		height: 120rpx;
	}
</style>
