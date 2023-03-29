/**
 * 获取某年某月有多少天
 */
export const getOneMonthDays = (year,month)=>{
	month = Number(month);
	const baseMonthsDays = [31,28,31,30,31,30,31,31,30,31,30,31];
	if(year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)){
		if(month === 1){
			baseMonthsDays[month] = 29;
		}
	}
	return baseMonthsDays[month];
}

/**
 * 获取日期的年月日时分秒
 */
export const getTimeArray = (date)=>{
	const year = date.getFullYear();
	const month = date.getMonth()+1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return [year,month,day,hour,minute,second];
}
/**
 * 小于10的数字前面补0
 */
export const addZero = (num)=>{
	if(num/1==0){
		return "00";
	}
	num = "" + num ;
	return num < 10 ? (num.substr(0, 1) == 0 ? num : ('0' + num)) : num;
}
/**
 * 小于10的数字前面去除0
 */
export const removeZero = (num)=>{
	if(num/1==0){
		return 0
	}
	num = "" + num ;
	return  num.substr(0, 1) == 0 ? (num.substr(1)) : num ;
}
/**
 * 获取当前值在数组中的索引
 */
export const getIndexOfArray = (value,array,key)=>{
	let index;
	if(key){
		index = array.findIndex(item => item[key] == value);
	}else{
		index = array.findIndex(item => item == value);
	}
	return index > -1 ? index : 0;
}

/**
 * 获取季度
 */
export const getQuarterArray=(startMOnth,endMOnth)=>{
	let arr=["一季度","二季度","三季度","四季度"];
	let start=Math.ceil(startMOnth/3);
	let end=Math.ceil(endMOnth/3);
	if(end<start){
		return arr;
	}else{
		return arr.slice(start-1,end);
	}
}
/**
 * 是否为范围选择
 */
export const isRange=(type)=>{
	return type.indexOf("range")>-1;
}
/**
 * 是否仅为时间选择
 */
export const isOnlyTime=(type)=>{
	return ["time", "hour-minute", "time-range"].includes(type);
}