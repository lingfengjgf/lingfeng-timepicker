<template>
	<uni-popup ref="popup" type="bottom" @change="popChange">
		<view class="date-time-picker" v-if="showPopPicker">
			<!-- <view class="date-time-mask" @click.stop="hide"></view> -->
			<view class="date-time-container" @click.stop="handleEvent">
				<view class="time-picker-tool">
					<view :class="[cancelButtonClass]" @click.stop="close">
						<text>{{cancelButtonText}}</text>
					</view>
					<view :class="[toolBarTitleClass]">
						<text>{{toolBarTitle}}</text>
					</view>
					<view :class="[confirmButtonClass]" @click.stop="confirm">
						<text>{{confirmButtonText}}</text>
					</view>
				</view>
				<view class="picker-tab" v-if="isShowRange">
					<view @click="dateTabChange(1)" class="picker-tab-item" :style="[rangeBtnStyle,dateTab==1?rangeBtnActiveStyle:'']"
					>{{pickerData.startTime}}</view>
					至
					<view @click="dateTabChange(2)" class="picker-tab-item" :style="[rangeBtnStyle,dateTab==2?rangeBtnActiveStyle:'']"
					>{{pickerData.endTime}}</view>
				</view>
				<picker-view class="picker-view" :indicator-style="popupIndicatorStyleString" :value="dateTime" @change="dateTimePickerChange">
					<picker-view-column data-id='year' v-if='isShowYear'>
						<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
					</picker-view-column>
					<picker-view-column data-id='month' v-if='isShowMonth'>
						<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
					</picker-view-column>
					<picker-view-column data-id='day' v-if='isShowDay'>
						<view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
					</picker-view-column>
					<picker-view-column data-id='hour' v-if='isShowHour'>
						<view class="item" v-for="(item,index) in hours" :key="index">{{item}}时</view>
					</picker-view-column>
					<picker-view-column data-id='minute' v-if='isShowMinute'>
						<view class="item" v-for="(item,index) in minutes" :key="index">{{item}}分</view>
					</picker-view-column>
					<picker-view-column data-id='second' v-if='isShowSecond'>
						<view class="item" v-for="(item,index) in seconds" :key="index">{{item}}秒</view>
					</picker-view-column>
					<picker-view-column data-id='quarter' v-if='isShowQuarter'>
						<view class="item" v-for="(item,index) in quarters" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import {
		getOneMonthDays,
		getTimeArray,
		addZero,
		removeZero,
		getIndexOfArray,
		getQuarterArray,
		isOnlyTime
	} from './uitls/util.js'
	export default {
		name: 'TimePicker',
		props: {
			minDate: { //最小选择时间 
				type: Object,
				default: function() {
					return {
						year: 1970,
						month: 1,
						date: 1
					}
				}
			},
			maxDate: { //最大选择时间 
				type: Object,
				default: function() {
					return {
						year: new Date().getFullYear(),
						month: new Date().getMonth() + 1,
						date: new Date().getDate()
					}
				}
			},
			type: {
				/**
				 * date 年月日
				 * year-month 年月
				 * year 年
				 * datetime 年月日 时分
				 * datetime-all 年月日 时分秒
				 * time 时分秒
				 * hour-minute 时分
				 * quarter 季度
				 * date-range 年月日-范围
				 * datetime-range 年月日 时分-范围
				 * datetime-all-range 年月日 时分秒-范围
				 * time-range 时分秒-范围
				 */
				type: String,
				default: 'date'
			},
			defaultData: {
				type: Object,
				default: function() {
					return {
						startTime: "", //默认开始日期/时间 yyyy-mm-dd (HH:MM:SS)
						endTime: "", //默认结束日期/时间 yyyy-mm-dd (HH:MM:SS)
						year: "", //默认年份		yyyy		
						month: "", //默认年-月份 yyyy-mm
						quarter: "", //默认季度 2020 一季度
					}
				}
			},
			popIindicatorStyle:{
				type: Object,
				default: null
			},
			rangeBtnStyle: { // 范围选择按钮样式
				type: Object,
				default: function(){
					return {
						color:'#666'
					}
				}
			},
			rangeBtnActiveStyle: { // 范围选择按钮激活样式
				type: Object,
				default: function(){
					return {
						color:'#049bff',
						borderColor:'#049bff'
					}
				}
			},
			cancelButtonText: {
				type: String,
				default: '取消'
			},
			cancelButtonClass: {
				type: String,
				default: 'cancel-btn'
			},
			toolBarTitle: {
				type: String,
				default: ''
			},
			toolBarTitleClass: {
				type: String,
				default: 'tool-title'
			},
			confirmButtonText: {
				type: String,
				default: '确定'
			},
			confirmButtonClass: {
				type: String,
				default: 'confirm-btn'
			},
		},
		data() {
			return {
				showPicker: false,
				showPopPicker: false,
				dateTab: 1,
				popupIndicatorStyleString:"",
				dateTime: [],//picker-view-column 选中的值
				lastDateTime: [],//选中的时间,小于10的数不加0
				days: [],//可选的日列表
				months: [],//可选的月列表
				quarters: getQuarterArray(1, 12),//可选的季度列表
				datestring: "",//选中的时间,格式化后的展示
				allQuarter: [{
						name: "一季度",
						start: "01-01",
						end: "03-31"
					},
					{
						name: "二季度",
						start: "04-01",
						end: "06-30"
					},
					{
						name: "三季度",
						start: "07-01",
						end: "09-30"
					},
					{
						name: "四季度",
						start: "10-01",
						end: "12-31"
					}
				],
				pickerData: {
					startTime: "",
					endTime: "",
					month: "",
					quarter: "",
					year: ""
				}
			};
		},
		methods: {
			showPop() {
				this.dateTab = 1;
				this.getPopIndicatorStyle();
				this.showPopPicker = true;
				this.tempTime = new Date().getTime();
				this.$refs.popup.open();
			},
			close() {
				this.$emit('close');
				this.showPopPicker = false;
				this.$refs.popup.close();
				this.pickerData={
					startTime: "",
					endTime: "",
					month: "",
					quarter: "",
					year: ""
				}
				this.lastDateTime=[];
			},
			dateTabChange(i) {
				if (this.dateTab == i) {
					return;
				}
				this.dateTab = i;
				this.datestring = i == 2 ? this.pickerData.endTime : this.pickerData.startTime;
				this.initDateTime();
				this.tempTime = new Date().getTime();
			},
			dateTimePickerChange(e) {
				let columns = e.target.value;
				if(new Date().getTime()-this.tempTime < 100){
					//dateTimePickerChange 小程序端有时点击dateTabChange就触发了change
					// console.log("无效滚动")
					return;
				}
				if (['date','datetime','datetime-all','date-range','datetime-range','datetime-all-range'].includes(this.type)) {
					if (this.lastDateTime[0] != this.years[columns[0]]) {
						this.getMonths(this.years[columns[0]], this.lastDateTime[1]);
					}
					this.dateTime.splice(0, 1, columns[0]);
					if (columns[0] != this.dateTime[0]) {
						// this.getDays(this.years[this.dateTime[0]], this.months[this.dateTime[1]]);
						if (this.dateTime[1] == 1) {
							if (this.dateTime[2] == this.days.length - 1) {
								if (getOneMonthDays(this.years[columns[0]], this.dateTime[1]) < getOneMonthDays(this.years[this.dateTime[0]],
										this.dateTime[1])) {
									this.dateTime.splice(2, 1, this.days.length - 1)
								}
							}
						}
					} else {
						if (columns[1] != this.dateTime[1]) {
							this.dateTime.splice(1, 1, columns[1]);
							this.getDays(this.years[this.dateTime[0]], this.months[this.dateTime[1]] - 1);
						} else {
							this.dateTime.splice(2, 1, columns[2])
						}
					}
					
					if (columns.length > 2) {
						columns.splice(3).forEach((column, index) => {
							this.dateTime.splice(index + 3, 1, column);
						})
					}
				} else if (this.type === "quarter") {
					if (this.lastDateTime[0] != this.years[columns[0]]) {
						if (columns[0] == 0) {
							this.quarters = getQuarterArray(this.minDate.month, 12);
						} else if (columns[0] == this.years.length - 1) {
							this.quarters = getQuarterArray(1, this.maxDate.month);
						} else {
							this.quarters = getQuarterArray(1, 12);
						}
					}
				} else if (this.type === "year-month") {
					this.getMonths(this.years[columns[0]]);
				} else {
					columns.forEach((column, index) => {
						this.dateTime.splice(index, 1, column);
					})
				}
				setTimeout(() => {
					if (['date','datetime','datetime-all','year-month','date-range','datetime-range','datetime-all-range'].includes(this.type)) {
						if (this.lastDateTime[0] != this.years[columns[0]]) {
							//年份变化后 查看月份是否在范围 否则重新选择,this.months上面已更新
							let index = this.months.findIndex(val => val == this.lastDateTime[1]);
							if (index < 0) {
								index = columns[0] == this.years.length - 1 ? this.months.length - 1 : 0
							}
							columns.splice(1, 1, index)
							if (this.type != 'year-month') {
								//月份变化后 查看日是否在范围 否则重新选择,this.days上面已更新
								let d_index = this.days.findIndex(val => val == this.lastDateTime[2]);
								if (d_index < 0) {
									d_index = this.lastDateTime[2] <= this.days[0] ? 0 : this.days.length - 1;
								}
								columns.splice(2, 1, d_index)
							}
						}
						
						if (['date','datetime','date-range','datetime-range','datetime-all-range'].includes(this.type) && this.lastDateTime[1] != this.months[columns[1]]) {
							//月份变化后 查看日是否在范围 否则重新选择,this.days上面已更新
							let d_index = this.days.findIndex(val => val == this.lastDateTime[2]);
							if (d_index < 0) {
								d_index = this.lastDateTime[2] <= this.days[0] ? 0 : this.days.length - 1;
							}
							columns.splice(2, 1, d_index)
						}
						
					} else if (this.type === "quarter") {
						if (this.lastDateTime[0] != this.years[columns[0]]) {
							let index = columns[1];
							index = this.quarters.findIndex(val => val == this.lastDateTime[1]);
							if (index < 0) {
								index = columns[0] == 0 ? 0 : this.quarters.length - 1;
							}
							columns.splice(1, 1, index)
						}
					}
					columns.forEach((column, index) => {
						this.dateTime.splice(index, 1, column);
					})

					this.formatDate();
				})
			},
			formatDate() {//选中的时间记录 及格式化
				let names = ['year', 'month', 'day', 'hour', 'minute', 'second'];
				let dateString, formatDateArray = [];
				if (['date','year','year-month','date-range'].includes(this.type)) {
					formatDateArray = this.dateTime.map((item, index) => {
						let num=this[names[index] + 's'][item] ? this[names[index] + 's'][item] : this[names[index] + 's'][this[names[index] + 's'].length-1];
						return  addZero(num);
					})
					dateString = formatDateArray.join('-');
				} else if (['time','hour-minute','time-range'].includes(this.type)) {
					names = names.splice(3);
					formatDateArray = this.dateTime.map((item, index) => {
						return addZero(this[names[index] + 's'][item]);
					})
					dateString = formatDateArray.join(':');
				} else if (this.type === "quarter") {
					dateString = this.years[this.dateTime[0]] + " " + this.quarters[this.dateTime[1]];
				} else {
					let name1 = names.splice(0, 3);
					formatDateArray = this.dateTime.map((item, index) => {
						if (index > 2) {
							return addZero(this[names[index - 3] + 's'][item]);
						} else {
							return addZero(this[name1[index] + 's'][item]);
						}
					})
					dateString = formatDateArray.splice(0, 3).join('-') + ' ' + formatDateArray.join(':');
				}
				if(this.type === "quarter"){
					this.lastDateTime = dateString.split(/[-: ]/);
				}else{
					let tempDate = [];
					dateString.split(/[-: ]/).forEach((val) => {
						tempDate.push(parseInt(removeZero(val)));
					})
					this.lastDateTime = tempDate;
				}
				
				switch (this.type) {
					case "date":
					case "datetime":
					case "datetime-all":
					case "time":
					case "hour-minute":
					case "date-range":
					case "datetime-range":
					case "datetime-all-range":
					case "time-range":
						if (this.dateTab == 2) {
							this.pickerData.endTime = dateString;
						} else {
							this.pickerData.startTime = dateString;
						};
						break;
					case "year-month":
						this.pickerData.month = dateString;
						break;
					case "year":
						this.pickerData.year = dateString;
						break;
					case "quarter":
						this.pickerData.quarter = dateString;
						break;
				}
				// this.$emit('change', dateString)
			},
			getPopIndicatorStyle() {
				if (this.popIindicatorStyle) {
					for (let key in this.popIindicatorStyle) {
						this.popupIndicatorStyleString += `${key}:${this.popIindicatorStyle[key]};`
					}
				}
			},
			initDefaultDate() {//初始化起始时间
				Object.keys(this.defaultData).forEach(key=>{
					this.pickerData[key] = this.defaultData[key];
				})
				if (this.type === 'year') {
					this.datestring = this.pickerData.year;
				} else if (this.type === 'year-month') {
					this.datestring = this.pickerData.month;
				} else if (this.type === 'quarter') {
					this.datestring = this.pickerData.quarter;
				} else {
					// 处理默认开始时间和结束时间
					let [y, m, d] = getTimeArray(new Date());
					let startTime=isOnlyTime(this.type) ? y + "/" + m + "/" + d + " " + this.pickerData.startTime : this.pickerData.startTime.replace(/-/g,"/");
					startTime=this.getMinDate(startTime);
					this.pickerData.startTime = isNaN(Date.parse(startTime)) ? this.formatPickerData(new Date(),this.type) : this.formatPickerData(startTime,this.type);
					let endTime=isOnlyTime(this.type) ? y + "/" + m + "/" + d + " " + this.pickerData.endTime : this.pickerData.endTime.replace(/-/g,"/");
					startTime=this.getMinDate(endTime);
					this.pickerData.endTime = isNaN(Date.parse(endTime)) ? this.formatPickerData(new Date(),this.type) : this.formatPickerData(endTime,this.type);
					this.datestring = this.pickerData.startTime;
				}
			},
			initDateTime() {//初始化picker-view选择的时间
				let value;
				if (this.datestring && this.datestring.length > 0) {
					if (this.type === 'year') {
						value = new Date(this.datestring, 0);
					} else if (['time','hour-minute','time-range'].includes(this.type)) {
						let date = new Date();
						let ary = this.datestring.split(':');
						ary.forEach((item, index) => {
							if (index == 0) {
								date.setHours(item)
							} else if (index == 1) {
								date.setMinutes(item)
							} else if (index == 2) {
								date.setSeconds(item)
							}
						})
						value = date;
					} else if(this.type === 'year-month'){
						value = new Date(this.datestring.replace(/-/g, '/')+'/01');
					} else {
						value = new Date(this.datestring.replace(/-/g, '/'));
					}
				} else {
					value = new Date();
				}
				let len, timeArray, index;
				let array = this.type === 'quarter' ? this.datestring.split(" ") : getTimeArray(value);
				let [year, month, day, hour, minute, second] = array;
				if(!['time','hour-minute','time-range'].includes(this.type)){
					this.getMonths(year, month);
				}

				let names = ['year', 'month', 'day', 'hour', 'minute', 'second'];
				switch (this.type) {
					case "date":
					case "time":
					case "date-range":
					case "time-range":
						len = 3;
						break;
					case "year-month":
					case "hour-minute":
					case "quarter":
						len = 2;
						break;
					case "year":
						len = 1;
						break;
					case "datetime":
					case "datetime-range":
						len = 5;
						break;
					case "datetime-all":
					case "datetime-all-range":
						len = 6;
						break;
				}
				timeArray = new Array(len).fill(0);
				if (['time','hour-minute','time-range'].includes(this.type)) {
					names = names.slice(3);
					array = array.slice(3);
				} else if (this.type === "quarter") {
					names = ["year", "quarter"];
				} else {
					names = names.slice(0,len);
					array = array.slice(0,len);
				}
				setTimeout(() => {
					timeArray = timeArray.map((item, index) => {
						const name = names[index];
						return getIndexOfArray(array[index], this[name + 's'])
					})
					this.dateTime = timeArray;
					this.lastDateTime = array;
					// this.lastDateTime = this.type === "quarter" ? array : this.type === "datetime" ? [year, month, day, hour, minute] :[year, month, day];
				},60)
			},
			initTimeData(end, start) {//设置最大最小值
				let timeArray = [];
				while (start <= end) {
					timeArray.push(start);
					start++;
				}
				return timeArray;
			},
			getMonths(year, month) {//, monthIndex
				let m = month;
				this.months = this.initTimeData(12, 1);
				if(this.type === 'quarter'){
					this.quarters = getQuarterArray(1, 12);	
				}
				if (year == this.minDate.year) {
					this.months = this.initTimeData(12, this.minDate.month/1);

					if(this.type === 'quarter'){
						//初始化季度范围
						this.quarters = getQuarterArray(this.minDate.month, 12);	
					} else if(this.months[0] > m){
						//当选择的是最小的年份，则匹配最小年份中的最小月份是否大于选中的月份
						m = this.months[0]; //则选中最小的年份最小月份
					}
				}
				if (year == this.maxDate.year) {
					this.months = this.initTimeData(this.maxDate.month/1, 1);
					
					if(this.type === 'quarter'){
						this.quarters = getQuarterArray(1, this.maxDate.month);
					} else if(this.months[this.months.length-1] < m){
						//当选择的是最大的年份，则匹配最先年份中的最大月份是否大于选中的月份
						m = this.months[this.months.length-1]; //则选中最大的年份最大月份
					}
				}
				this.$nextTick(() => {
					if (['date','datetime','datetime-all','date-range','datetime-range','datetime-all-range'].includes(this.type)) {
						this.getDays(year, m - 1);
					}
				})
			},
			getDays(year, month) {
				
				let start = 1;
				let end = getOneMonthDays(year, month);
				if (year == this.minDate.year / 1 && month + 1 == this.minDate.month / 1) {
					start = this.minDate.date;
				}
				if (year == this.maxDate.year / 1 && month + 1 == this.maxDate.month / 1) {
					end = this.maxDate.date;
				}
				this.days = this.initTimeData(end/1, start/1);
			},
			getQuarterDate(){
				let [y, q] = this.pickerData.quarter.split(" ");
				let index = getIndexOfArray(q, this.allQuarter, "name");
				let start = y + "-" + this.allQuarter[index].start;
				let end = y + "-" + this.allQuarter[index].end;
				start = this.getMinDate(start);
				end = this.getMAxDate(end);
				return [this.pickerData.quarter,start, end];
			},
			getMinDate(date){
				let minArr = [this.minDate.year, addZero(this.minDate.month), addZero(this.minDate.date)];
				let repDate=date.replace(/-/g,"/");
				let datetime=isNaN(Date.parse(repDate))?new Date().getTime():new Date(repDate).getTime();
				return datetime>new Date(minArr.join("/")).getTime()?date:minArr.join("-");
			},
			getMAxDate(date){
				let maxArr = [this.maxDate.year, addZero(this.maxDate.month), addZero(this.maxDate.date)];
				let repDate=date.replace(/-/g,"/");
				let datetime=isNaN(Date.parse(repDate))?new Date().getTime():new Date(repDate).getTime();
				return datetime<new Date(maxArr.join("/")).getTime()?date:maxArr.join("-");
			},
			//popup
			show(){
				this.$nextTick(()=>{
					this.initDefaultDate();
					this.initDateTime();
					this.showPop();					
				})
			},
			handleEvent() {
				return;
			},
			confirm() {
				let val;
				switch (this.type){
					case "date":
					case "datetime":
					case "datetime-all":
					case "time":
					case "hour-minute":
						val = this.pickerData.startTime;
						break;
					case "year":
						val = this.pickerData.year;
						break;
					case "year-month":
						val = this.pickerData.month;
						break;
					case "quarter":
						val = this.getQuarterDate();
						break;
					case "date-range":
					case "datetime-range":
					case "datetime-all-range":
					case "time-range":
						let start=this.pickerData.startTime;
						let end=this.pickerData.endTime;
						if(start>end){
							val=[end,start];
						}else{
							val=[start,end];
						}
						break;
					default:
						break;
				}
				this.$emit("change",val)
				this.close();
			},
			popChange(val){
				if(!val.show){
					this.$emit("close");
					this.showPopPicker = false;
					this.$parent.pageScrollFlag=true;
				}
			},
			formatPickerData(date,type){
				let [y, m, d, HH, MM, SS] = getTimeArray(new Date(date));
				m=addZero(m);
				d=addZero(d);
				HH=addZero(HH);
				MM=addZero(MM);
				SS=addZero(SS);
				switch (type){
					case "date":
					case "date-range":
						return y + "-" + m + "-" + d;
					case "datetime":
					case "datetime-range":
						return y + "-" + m + "-" + d + " " + HH + ":" + MM;
					case "datetime-all":
					case "datetime-all-range":
						return y + "-" + m + "-" + d + " " + HH + ":" + MM + ":" + SS;
					case "time":
					case "time-range":
						return HH + ":" + MM + ":" + SS;
					case "hour-minute":
						return HH + ":" + MM;
					default:
						return "";
						break;
				}
				
			}
		},
		computed: {
			years() {//可选的年列表
				return this.initTimeData(this.maxDate.year, this.minDate.year);
			},
			isShowYear() {
				return !['time','hour-minute','time-range'].includes(this.type);
			},
			isShowMonth() {
				return !['year','time','hour-minute','quarter','time-range'].includes(this.type);
			},
			isShowDay() {
				return ['date','datetime','datetime-all','date-range','datetime-range','datetime-all-range'].includes(this.type);
			},
			hours() {
				return this.initTimeData(23, 0);
			},
			isShowHour() {
				return !['date','year-month','year','quarter','date-range'].includes(this.type);
			},
			isShowRange() {
				return ['date-range','datetime-range','datetime-all-range','time-range'].includes(this.type);
			},
			minutes() {
				return this.initTimeData(59, 0);
			},
			isShowMinute() {
				return !['date','year-month','year','quarter','date-range'].includes(this.type);
			},
			seconds() {
				return this.initTimeData(59, 0);
			},
			isShowSecond() {
				return ['time','datetime-all','datetime-all-range','time-range'].includes(this.type);
			},
			isShowQuarter() {
				return this.type === 'quarter';
			}
		},
	}
</script>

<style lang="scss">
	// popup
	.date-time-picker {
		width: 100%;
		height: 40vh;
		border-top-right-radius: 10rpx;
		border-top-left-radius: 10rpx;
		.date-time-mask {
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: rgba($color: #000000, $alpha: .5);
			z-index: 998;
		}

		.date-time-container {
			width: 100%;
			height: 100%;
			border-top-right-radius: 10rpx;
			border-top-left-radius: 10rpx;
			box-sizing: border-box;
			padding-bottom: 20rpx;
			background-color: #f6f6f6;
			display: flex;
			flex-direction: column;

			.time-picker-tool {
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 32rpx;

				.cancel-btn {
					padding: 0 32rpx;
					box-sizing: border-box;
					color: #969799;
				}

				.tool-title {
					font-weight: 500;
					font-size: 32rpx;
					max-width: 50%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.confirm-btn {
					padding: 0 32rpx;
					box-sizing: border-box;
					color: #049bff;
				}
			}

			.picker-view {
				width: 100%;
				flex: 1;

				.item {
					font-size: 34rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}
	.picker-tab{
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: 20rpx 0;
	}
	.picker-tab-item{
		box-sizing: border-box;
		width: 260rpx;
		text-align: center;
		padding: 4rpx 30rpx;
		border:2rpx solid #666;
		border-radius: 20rpx;
		font-size: 30rpx;
	}
	
</style>
