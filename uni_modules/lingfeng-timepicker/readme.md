# lingfeng-timepicker

基于picker-view、uni-popup的时间选择器，支持按年、月、日、时、分、秒、周、季度选择时间或时间范围，支持配置最大、最小选择日期

## 基本用法

在 ``template`` 中使用组件

```html
<view @click="showPop()" class="show-time">选择年-月-日：{{defaultData.startTime}}</view>

<lingfeng-timepicker ref="timePop" type="date" :defaultData="defaultData" :minDate="minDate" :maxDate="maxDate"  @change="timeChange"></lingfeng-timepicker>

data(){
	return {
		defaultData:{
			startTime:'2023-02-20'
		},
		minDate:{
			year: 2020,
			month: 3,
			date: 5
		},
		maxDate:{
			year: 2025,
			month: 9,
			date: 20
		},
	}
},
methods: {
	showPop(){
		this.$refs.timePop.show();
	},
	timeChange(val){
		console.log(val); 
	}
}
```

## 组件属性

|属性名	|类型		|默认值	|说明				|
|:-:	|:-:		|:-:	|:-:				|
|type	|String		|date		|选择时间类型，详见下文 [type属性说明](#type_info)|
|minDate	|Object		|{ year: 1970, month: 1, date: 1, hour: 0, minute: 0, second: 0 } |最小可选择时间|
|maxDate	|Object		|{ year: 当前年份, month: 当前月份, date: 当前日期, hour: 23, minute: 59, second: 59 } |最大可选择时间|
|defaultData	|Object		| |默认选择时间，详见下文 [defaultData属性说明](#defaultData_info)|
|toolBarTitle	|String		|""		|组件顶部标题  	|
|toolBarTitleClass	|String		|tool-title		|组件顶部标题样式类名  	|
|cancelButtonText	|String		|取消		|组件顶部取消按钮文字  	|
|cancelButtonClass	|String		|cancel-btn		|组件顶部取消按钮文字样式类名  	|
|confirmButtonText	|String		|确定		|组件顶部确定按钮文字  	|
|confirmButtonClass	|String		|confirm-btn		|组件顶部确定按钮文字样式类名  	|
|rangeBtnStyle	|Object		|{color:'#666'}		|范围选择按钮样式  	|
|rangeBtnActiveStyle	|Object		|{color:'#049bff',borderColor:'#049bff'}		|范围选择按钮激活样式  	|
|popIindicatorStyle	|Object		|null		|选择器中间选中框的样式  	|
|safeArea	|Boolean		|true		|是否适配底部安全区(同uni-popup)  	|
|en	|Boolean		|false		|当`type="week"`时是否以国外的标准返回日期(以周日为一周的第一天) 	|
|weekType	|String		|firstWeek		|当`type="week"`时定义周的类型，详见下文 [weekType属性说明](#weekType_info) 	|


## 组件事件

|事件名	|说明			|返回值|
|:-:	|:-:			|:-:  |
|@change|点击确定按钮事件|详见下文 [type属性说明](#type_info)|
|@close|弹窗关闭事件| |

<a id="type_info"></a>

### type属性说明

|值	|时间格式		|@change返回值示例	|说明				|
|:-:	|:-:		|:-:	|:-:				|
|year	|yyyy		|"2020"	|选择年 |
|year-month	|yyyy-mm		|"2020-02"		|选择年、月 |
|date	|yyyy-mm-dd		|"2020-02-20"		|选择年、月、日 |
|datetime	|yyyy-mm-dd HH:MM		|"2020-02-20	08:30"	|选择年、月、日、时、分 |
|datetime-all	|yyyy-mm-dd HH:MM:SS		|"2020-02-20	08:30:10"	|选择年、月、日、时、分、秒 |
|time	|HH:MM:SS		|"08:30:10"	|选择时、分、秒 |
|hour-minute	|HH:MM	|"08:30" |选择时、分 |
|week	|yyyy week		|["2020 第1周", "2019-12-30", "2020-01-05"]	|选择年、周|
|quarter	|yyyy quarter		|["2020 一季度", "2020-01-01", "2020-03-31"]	|选择年、季度|
|year-range	|yyyy	|["2020", "2022"]|选择时间范围年|
|year-month-range	|yyyy-mm	|["2020-02", "2020-03"]|选择时间范围年、月|
|date-range	|yyyy-mm-dd	|["2020-02-20", "2020-03-20"]|选择时间范围年、月、日|
|datetime-range	|yyyy-mm-dd HH:MM		|["2020-02-20	08:30", "2020-03-20	08:30"]|选择时间范围年、月、日、时、分 |
|datetime-all-range	|yyyy-mm-dd HH:MM:SS	|["2020-02-20	08:30:10", "2020-03-20	08:30:10"]|选择时间范围年、月、日、时、分、秒 |
|time-range	|HH:MM:SS	|["08:30:10", "09:30:10"]|选择时间范围时、分、秒 |


<a id="defaultData_info"></a>

### defaultData属性说明

|属性名	|类型		|时间格式		|默认值	|说明				|
|:-:	|:-:		|:-:	|:-:	|:-:				|
|year	|String		| yyyy |当前年		|默认展示的年份，仅 `type="year"` 时生效|
|month	|String		| yyyy-mm |当前年月		|仅 `type="year-month"` 时生效|
|startTime	|String		| yyyy(-mm-dd) (HH:MM:SS)|当前日期(时间)		| 当`type!="year/year-month/quarter"` 时生效|
|endTime	|String		| yyyy(-mm-dd) (HH:MM:SS)		|当前日期(时间)|当 `type="year-range/year-month-range/date-range/datetime-range/datetime-all-range/time-range"` 时生效|
|week	|String		| yyyy week |最小可选择年 周		|仅 `type="week"` 时生效|
|quarter	|String		| yyyy quarter |最小可选择年 季度		|仅 `type="quarter"` 时生效|


<a id="weekType_info"></a>

### weekType属性说明

|属性值	|说明				|
|:-:	|:-:				|
|firstWeek |以当前年第一天所在的周为第一周计算，以`2023`年为例，第一周返回的日期为`['2023 第1周', '2022-12-26', '2023-01-01']`|
|fullWeek	|以当前年第一个完整周为第一周计算，以`2023`年为例，第一周返回的日期为`['2023 第1周', '2023-01-02', '2023-01-08']`|
|firstDay	|以当前年第一天为第一周的第一天计算，以`2023`年为例，第一周返回的日期为`['2023 第1周', '2023-01-01', '2023-01-07']`|


## 联系作者

QQ:1435464107
