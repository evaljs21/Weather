<template>
	<custom-page class="page" :loaded="true">
		<custom-search v-model="keywords"
					   :height="42"
					   @search="loadData(1)"
					   search-class="bg-white" />

		<mescroll-body ref="mescrollRef" @init="mescrollInit"
					   :down="{auto:false}" :up="{auto:false,empty:false}"
					   @down="downCallback" @up="upCallback">
			<view class="margin-top">
				<GoodsList :list="data" :row="true" :isShowBtn="true" @buytap="sampleTap">
				</GoodsList>
			</view>
		</mescroll-body>

		<!-- 商品规格 -->
		<GoodsSku ref="sku" :info="showGoodsSkuData" />
		<!-- /商品规格 -->
	</custom-page>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import GoodsList from '../components/goods-list';
	import GoodsSku from '../components/goods-sku.vue';
	export default {
		mixins: [MescrollMixin],
		components: {
			GoodsList,
			GoodsSku
		},
		data() {
			return {
				loaded: false,

				page: 1,
				more: true,
				keywords: '',
				data: [],

				showGoodsSkuData: null,
			};
		},
		onLoad(options) {
			this.keywords = decodeURIComponent(options.keywords || '');
			this.loadData();
		},
		methods: {
			// 上拉加载数据
			upCallback(mescroll) {
				this.loadData(mescroll.num).then(() => {
					mescroll.endSuccess(this.data.length, this.more);
				}, () => {
					mescroll.endErr();
				});
			},

			// 加载数据
			loadData: function(page = 1) {
				if (this.search === '') {
					this.data = [];
					return Promise.resolve();
				}

				return uni.$models.mall.getGoodsList({
					keywords: this.keywords,
					page: page,
				}).then(res => {
					this.data = page === 1 ? res.data : this.data.concat(res.data);
					this.more = res.data.length >= res.per_page;
					this.page = page;
					this.loaded = true;
				});
			},

			// 开始选择规格
			toChooseSpec(info, type) {
				return uni.$models.mall.getGoodsSku(info.id).then((res) => {
					this.showGoodsSkuData = Object.assign({}, info, res);
					return this.$refs.sku.open(type).then((res) => {
						return res;
					});
				});
			},

			// 试样点击
			sampleTap(info) {
				this.toChooseSpec(info, 'sample').then((res) => {
					if (res.cancel) {
						return;
					}

					uni.$logged({
						loginUserInfo: true
					}).then(() => {
						uni.navigateTo({
							url: `/pages/mall/order/create?goods_id=${info.id}&goods_sku_id=${res.sku.id}&count=${res.count}&sample=1`
						});
					});
				});
			},
		}
	}
</script>

<style scoped>

</style>
