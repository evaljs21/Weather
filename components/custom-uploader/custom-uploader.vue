<template>
    <view class="grid col-4 grid-square flex-sub">
        <view class="bg-img" v-for="(item,index) in list" :key="index" @tap="onViewImage"
              :data-url="list[index].path||list[index].url">
            <image :src="list[index].path||list[index].url" mode="aspectFill"></image>
            <view class="cu-tag bg-red" @tap.stop="onDelImg" :data-index="index">
                <text class='cuIcon-close'></text>
            </view>
            <view class="state" v-if="item.state!==1">
                <text v-if="item.state===0">上传中</text>
                <text v-else-if="item.state===2">上传失败</text>
            </view>
        </view>
        <view class="solids" @tap="oChooseImage" v-if="list.length<9">
            <text class='cuIcon-cameraadd'></text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            list: [],
        };
    },
    props: {
        type: {
            type: String,
            default: 'image'
        },
        value: {
            type: [Array, String],
            default: () => []
        },
        max: {
            type: Number,
            default: 9
        },
        multiple: {
            type: Boolean,
            default: true
        },
        complex: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // 是否需要显示添加按钮
        isShowAddBtn: function() {
            return this.multiple ? this.list.length < this.max : !this.list.length;
        },
        // 可以上传的数量
        canUploadCount: function() {
            return this.multiple ? this.max - this.list.length : 1;
        }
    },
    watch: {
        value: function(values) {
            if (this.multiple) {
                this.list = values.map((path) => {
                    if (this.complex) {
                        return Object.assign({
                            title: '',
                            file: null,
                            state: 1
                        }, path);
                    }

                    return {
                        url: path,
                        title: '',
                        file: null,
                        state: 1
                    };
                });
            } else {
                if (this.complex) {
                    this.list = [Object.assign({
                        file: null,
                        state: 1
                    }, values)];
                } else {
                    if (values) {
                        this.list = [{
                            url: values,
                            file: null,
                            state: 1
                        }];
                    } else {
                        this.list = [];
                    }

                }
            }
        }
    },
    methods: {
        oChooseImage() {
            uni.chooseImage({
                count: 9 - this.list.length,
                success: (res) => {
                    const uploadList = res.tempFiles.map(it => {
                        return {
                            path: it.path,
                            file: it,
                            state: 0
                        };
                    });
                    this.list = this.list.concat(uploadList);
                    this.upload(uploadList);
                }
            });
        },

        onViewImage(e) {
            uni.previewImage({
                urls: this.list.map(it => it.path || it.url),
                current: e.currentTarget.dataset.url
            });
        },

        onDelImg(e) {
            uni.showModal({
                content: '确定要删除这张图片吗？',
                cancelText: '再看看',
                confirmText: '再见',
                success: res => {
                    if (res.cancel) {
                        return;
                    }

                    this.list.splice(e.currentTarget.dataset.index, 1)
                }
            })
        },

        // 开始上传
        upload(list) {
            uni.$upload({
                files: list.map(it => it.file),
                onUploadChange: function(info) {
                    const {state, index} = info;
                    const item = list[index];
                    item.state = state;
                    if (state === 1) {
                        item.url = info.url;
                    } else if (state === 2) {
                        item.errMsg = info.errMsg;
                    }
                }
            });
        }
    }
}
</script>

<style scoped>
.bg-img {
    position: relative;
}

.bg-img .state {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;

    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    text-align: center;
    font-size: 10px;
    line-height: 1.6;
}
</style>
