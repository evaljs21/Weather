/**
 * 格式化日期
 * @param {string} formatStr
 * @param {Number,Date} [date]
 * @return {string}
 */
export function format(formatStr = 'yyyy-MM-dd hh:mm:ss', date = new Date()) {
	if (!(date instanceof Date)) date = new Date(date);

	const o = {
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};

	if (/(y+)/.test(formatStr)) {
		formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for (const k in o) {
		if (new RegExp("(" + k + ")").test(formatStr)) {
			formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}

	return formatStr;
}


/**
 * 格式化成日期
 * @param {Number,Date} date
 * @return {string}
 */
format.date = function(date = new Date()) {
	return format('yyyy-MM-dd', date);
}

/**
 * 格式化成时间
 * @param {Number,Date} date
 * @param {Boolean} isSeconds
 * @return {string}
 */
format.time = function(date = new Date(), isSeconds = false) {
	return format('h:i' + (isSeconds ? ':s' : ''), date);
}

/**
 * 格式化成日期时间
 * @param {Number,Date} date
 * @param {Boolean} isSeconds
 * @return {string}
 */
format.datetime = function(date = new Date(), isSeconds = false) {
	return format('yyyy-MM-dd hh:mm' + (isSeconds ? ':ss' : ''), date);
}

/**
 * 获取今天的开始时间
 * @param {Date} date
 * @return {number}
 */
export function todayStart(date = new Date()) {
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
}

/**
 * 获取今天的结束时间
 * @param {Date} date
 * @return {number}
 */
export function todayEnd(date = new Date()) {
	date.setHours(23);
	date.setMinutes(59);
	date.setSeconds(59);
	date.setMilliseconds(0);
	return date.getTime();
}

/**
 * 获取今天开始和结束的时间
 * @param {Date} start
 * @param {Date} end
 * @return {{start: number, end: number}}
 */
export function today(start = new Date(), end = new Date()) {
	return {
		start: todayStart(start),
		end: todayEnd(end)
	};
}
