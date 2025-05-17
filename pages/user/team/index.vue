<template>
	<custom-page class="page" :loaded="loaded">
		<custom-search class="search" v-model="search"
					   :showBackBtn="false"
					   :showStatusBar="false"
					   :menuButtonRect="false"
					   @search="loadData()" />
		<view class="padding-lr padding-tb-sm bg-white solid-bottom text-grey fixed titlebar">我的团队（{{num}}）</view>

		<view class="cu-list menu menu-avatar" v-if="data.length">
			<view class="cu-item arrow" v-for="item in data" :key="item.id" @tap="linkTo"
				  :data-url="'./detail?id='+item.id">
				<view class="cu-avatar radius lg" :style="'background-image:url('+item.avatar+');'"></view>
				<view class="content">
					<view class="text-grey">{{item.nickname}}</view>
					<view class="text-gray text-sm flex">
						<view class="text-cut">{{item.remark}}</view>
					</view>
				</view>
			</view>
		</view>
		<custom-empty type="default" v-else></custom-empty>
	</custom-page>
</template>

<script>
	export default {
		data() {
			return {
				search: '',

				num: 0,
				data: [],
				page: 1,
				more: true,
				keywords: '',
				loaded: false
			}
		},
		onLoad(options) {
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
			// 加载地址
			loadData: function(page = 1) {
				return uni.$models.user.getInvitedList({
					page: page,
					keywords: this.search,
				}).then(res => {
					this.data = page === 1 ? res.data : this.data.concat(res.data);
					this.more = res.data.length >= res.per_page;
					this.page = page;
					this.loaded = true;
				}, () => {
					uni.navigateBack();
				});
			},
		}
	}
</script>

<style>
	.page {
		background-color: white;
	}

	.search {
		background-color: white;
	}

	.titlebar {
		position: fixed;
		left: 0;
		width: 100%;
		z-index: 99;
	}

	.cu-list {
		margin-top: 76rpx;
	}
</style>
