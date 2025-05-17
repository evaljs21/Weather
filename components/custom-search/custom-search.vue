<template>
	<view class="search-wrapper" :style="wrapperStyle">
		<view class="cu-bar search" :class="showSearchClass" :style="innerStyle">
			<view class="action" @tap="BackPage" v-if="showBackBtn && isBackButton">
				<text class="cuIcon-back"></text>
			</view>
			<view class="search-form round" @tap="onSearchTap">
				<text class="cuIcon-search"></text>
				<input type="text"
					   :adjust-position="adjustPosition"
					   :placeholder="placeholder"
					   :maxlength="maxLength"
					   confirm-type="search"
					   v-model="search"
					   @blur="onBlur"
					   @search="toSearch"
					   @confirm="toSearch"
					   :disabled="disabled" />
				<text class="cuIcon-close clear" :style="{
					'display':search?'inline-block':'none'
				}" @tap="onClearTap"></text>
			</view>
			<view class="action" v-if="showRightActions">
				<button class="cu-btn round" @tap="toSearch" v-if="showSearchBtn">搜索</button>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "custom-search",
		options: {
			addGlobalClass: true,
		},
		props: {
			value: String,
			adjustPosition: Boolean,
			disabled: Boolean,
			placeholder: {
				type: String,
				default: '搜索...'
			},
			maxLength: {
				type: Number,
				default: 255
			},
			height: {
				type: Number | Boolean,
				default: true
			},
			fixed: {
				type: Boolean,
				default: true,
			},
			menuButtonRect: {
				type: Boolean,
				default: false,
			},
			showStatusBar: {
				type: Boolean,
				default: false
			},
			showRightActions: {
				type: Boolean,
				default: false,
			},
			showSearchBtn: {
				type: Boolean,
				default: true
			},
			showBackBtn: {
				type: Boolean,
				default: false
			},
			searchClass: {
				type: String | Object,
				default: ''
			}
		},
		computed: {
			wrapperStyle() {
				const height = typeof this.height === 'boolean' ?
					(this.height ? this.CustomBar + 'px' : 0) : this.height + 'px';
				let style = `height:${height};`;
				return style;
			},

			showSearchClass() {
				const classMap = {};
				if (typeof this.searchClass === 'string') {
					this.searchClass.split(' ').forEach(function(key) {
						if (key) {
							classMap[key] = true;
						}
					});
				} else {
					Object.assign(classMap, this.searchClass);
				}

				return Object.assign({
					'fixed': this.fixed
				}, classMap);
			},

			innerStyle() {
				const height = typeof this.height === 'boolean' ? (this.CustomBar + 'px') : this.height + 'px';

				let style = `height:${height};`;

				if (this.showStatusBar) {
					const StatusBar = this.StatusBar;
					style += `padding-top:${StatusBar}px;`;
				}

				// #ifdef MP
				if (this.menuButtonRect) {
					const MenuButtonRect = this.MenuButtonRect;
					style += `padding-right:${MenuButtonRect.width}px;`;
				}
				// #endif

				return style;
			}
		},
		data() {
			return {
				search: '',
				CustomBar: this.CustomBar,
				isBackButton: false
			};
		},
		created() {
			this.search = this.value || '';
			this.isBackButton = !uni.$isShowHomeButton();
		},
		methods: {
			// 去搜索
			toSearch() {
				// #ifndef APP-PLUS
				uni.hideKeyboard();
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif

				this.emitInput();
			},

			// 被点击
			onSearchTap(e) {
				this.$emit('searchtap', e);
			},

			// 失去焦点
			onBlur(e) {
				setTimeout(() => {
					this.search = this.value;
				}, 0);
			},

			// 返回上一页
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 清理
			onClearTap() {
				this.search = '';
				this.emitInput();
			},
			// 触发事件
			emitInput() {
				const detail = {
					value: this.search
				};
				this.$emit('input', this.search);
				this.$emit('search', detail);
			}
		},
		watch: {
			value(newVal) {
				this.search = newVal;
			}
		}
	}
</script>

<style scoped>
	.search-wrapper {
		position: relative;
		z-index: 1024;
	}

	.search {
		transition: all 0.2s;
		max-width: 1120rpx;
		min-height: auto;
		z-index: 1024;
	}

	.cu-btn {
		font-size: 12px;
	}

	.search.fixed {
		position: fixed;
		width: 100%;
		left: 0;
		top: 0;
	}

	.clear {
		display: inline-block;
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 20px;
		height: 20px;
		width: 20px;
		text-align: center;
		line-height: 20px;
	}

	@media screen and (min-width: 1120rpx) {
		.search.fixed {
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
