import Vue from 'vue';
import App from './App';

import './bootstrap';
import "./common/services";

// 组件区
import Loading from '@/components/loading';
import Hint from '@/components/hint';
import Empty from '@/components/empty.vue';
import LoadMore from '@/components/load-more.vue';
import cuCustom from '@/common/colorui/components/cu-custom.vue';


Vue.component('Hint', Hint);
Vue.component('XLoading', Loading);
Vue.component('Empty', Empty);
Vue.component('LoadMore', LoadMore);
Vue.component('cu-custom',cuCustom);

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
	...App
});

app.$mount();
