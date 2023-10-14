<template>
	<view>
		<view @click="showPop('year')" class="show-time">选择年：{{dateDefault.year}}</view>
		<view @click="showPop('year-month')" class="show-time">选择年-月：{{dateDefault.month}}</view>
		<view @click="showPop('date')" class="show-time">选择年-月-日：{{dateDefault.startTime}}</view>
		<view @click="showPop('datetime')" class="show-time">选择年-月-日 时:分：{{dateTimeDefault.startTime}}</view>
		<view @click="showPop('datetime-all')" class="show-time">选择年-月-日 时:分:秒：{{dateTimeAllDefault.startTime}}</view>
		<view @click="showPop('time')" class="show-time">选择时:分:秒：{{timeDefault.startTime}}</view>
		<view @click="showPop('hour-minute')" class="show-time">选择时:分：{{hmDefault.startTime}}</view>
		<view @click="showPop('week')" class="show-time">选择年 周：{{weekDefault.week}}</view>
		<view @click="showPop('quarter')" class="show-time">选择年 季度：{{quarterDefault.quarter}}</view>
		<view class="show-time">选择范围年：</view>
		<view @click="showPop('year-range')" class="show-time">{{yRangeDefault.startTime}} ~ {{yRangeDefault.endTime}}</view>
		<view class="show-time">选择范围年-月：</view>
		<view @click="showPop('year-month-range')" class="show-time">{{ymRangeDefault.startTime}} ~ {{ymRangeDefault.endTime}}</view>
		<view class="show-time">选择范围年-月-日：</view>
		<view @click="showPop('date-range')" class="show-time">{{dateRangeDefault.startTime}} ~ {{dateRangeDefault.endTime}}</view>
		<view class="show-time">选择范围年-月-日 时:分：</view>
		<view @click="showPop('datetime-range')" class="show-time">{{dateTimeRangeDefault.startTime}} ~ {{dateTimeRangeDefault.endTime}}</view>
		<view class="show-time">选择范围年-月-日 时:分:秒：</view>
		<view @click="showPop('datetime-all-range')" class="show-time">{{dateTimeAllRangeDefault.startTime}} ~ {{dateTimeAllRangeDefault.endTime}}</view>
		<view class="show-time">选择范围时:分:秒：</view>
		<view @click="showPop('time-range')" class="show-time">{{timeRangeDefault.startTime}} ~ {{timeRangeDefault.endTime}}</view>
		<lingfeng-timepicker ref="timePop" :type="pickerType" :defaultData="defaultData" :minDate="minDate" :maxDate="maxDate" @change="timeChange"></lingfeng-timepicker>
	</view>
</template>

<script>
import {getFormatDate} from "@/common/js/util.js";
export default {
	data() {
		const [year,month,date]=getFormatDate().split("-");
		return {
			pickerType:'year',
			defaultData:{},
			dateDefault:{
				year:year,
				month:year+'-'+month,
				startTime:year+'-'+month+'-'+date
			},
			dateTimeDefault:{
				startTime:'2023-02-20 08:30'
			},
			dateTimeAllDefault:{
				startTime:'2023-02-20 08:30:00'
			},
			timeDefault:{
				startTime:'08:30:00'
			},
			hmDefault:{
				startTime:'08:30'
			},
			weekDefault:{
				week:'2023 第1周'
			},
			quarterDefault:{
				quarter:'2023 一季度'
			},
			yRangeDefault:{
				startTime:'2022',
				endTime:'2023',
			},
			ymRangeDefault:{
				startTime:'2022-02',
				endTime:'2023-03',
			},
			dateRangeDefault:{
				startTime:'2023-02-20',
				endTime:'2023-03-20',
			},
			dateTimeRangeDefault:{
				startTime:'2023-02-20 08:00',
				endTime:'2023-03-20 18:00',
			},
			dateTimeAllRangeDefault:{
				startTime:'2023-02-20 08:00:00',
				endTime:'2023-03-20 18:00:00',
			},
			timeRangeDefault:{
				startTime:'08:00:00',
				endTime:'18:00:00',
			},
			minDate:{
				year: 2020,
				month: 5,
				date: 1,
				hour:6,
				minute:30,
				second:20
			},
			maxDate:{
				year: 2050,
				month: 5,
				date:5,
				hour:20,
				minute:30,
				second:0
			},
		}
	},
	onLoad() {
		this.defaultData=this.dateDefault;
	},
    methods: {
		showPop(type){
			this.pickerType=type;
			switch (type){
				case 'year':
				case 'year-month':
				case 'date':
					this.defaultData=this.dateDefault;
					break;
				case 'datetime':
					this.defaultData=this.dateTimeDefault;
					break;
				case 'datetime-all':
					this.defaultData=this.dateTimeAllDefault;
					break;
				case 'time':
					this.defaultData=this.timeDefault;
					break;
				case 'hour-minute':
					this.defaultData=this.hmDefault;
					break;
				case 'week':
					this.defaultData=this.weekDefault;
					break;
				case 'quarter':
					this.defaultData=this.quarterDefault;
					break;
				case 'year-range':
					this.defaultData=this.yRangeDefault;
					break;
				case 'year-month-range':
					this.defaultData=this.ymRangeDefault;
					break;
				case 'date-range':
					this.defaultData=this.dateRangeDefault;
					break;
				case 'datetime-range':
					this.defaultData=this.dateTimeRangeDefault;
					break;
				case 'datetime-all-range':
					this.defaultData=this.dateTimeAllRangeDefault;
					break;
				case 'time-range':
					this.defaultData=this.timeRangeDefault;
					break;
				default:
					break;
			}
			this.$refs.timePop.show();
		},
		timeChange(val){
			console.log('timeChange val:',val);
			switch (this.pickerType){
				case 'year':
					this.dateDefault.year=val;
					break;
				case 'year-month':
					this.dateDefault.month=val;
					break;
				case 'date':
					this.dateDefault.startTime=val;
					break;
				case 'datetime':
					this.dateTimeDefault.startTime=val;
					break;
				case 'datetime-all':
					this.dateTimeAllDefault.startTime=val;
					break;
				case 'time':
					this.timeDefault.startTime=val;
					break;
				case 'hour-minute':
					this.hmDefault.startTime=val;
					break;
				case 'week':
					this.weekDefault.week=val[0];
					break;
				case 'quarter':
					this.quarterDefault.quarter=val[0];
					break;
				case 'year-range':
					this.yRangeDefault.startTime=val[0];
					this.yRangeDefault.endTime=val[1];
					break;
				case 'year-month-range':
					this.ymRangeDefault.startTime=val[0];
					this.ymRangeDefault.endTime=val[1];
					break;
				case 'date-range':
					this.dateRangeDefault.startTime=val[0];
					this.dateRangeDefault.endTime=val[1];
					break;
				case 'datetime-range':
					this.dateTimeRangeDefault.startTime=val[0];
					this.dateTimeRangeDefault.endTime=val[1];
					break;
				case 'datetime-all-range':
					this.dateTimeAllRangeDefault.startTime=val[0];
					this.dateTimeAllRangeDefault.endTime=val[1];
					break;
				case 'time-range':
					this.timeRangeDefault.startTime=val[0];
					this.timeRangeDefault.endTime=val[1];
					break;
		
				default:
					break;
			}
		}
    }
}
</script>

<style scoped>
	.show-time{
		font-size: 30rpx;
		border-bottom: 2rpx solid #f7f7f7;
		padding: 10rpx;
	}
</style>