<template>
    <basic-container>
        <div class="app-container calendar-list-container">
            <div class="filter-container">
                <el-select v-model="checkWindowIds" class="filter-item" multiple
                           filterable allow-create default-first-option placeholder="选择窗口">
                    <el-option :key="window.id" v-for="window in windowList" :label="window.name" :value="window.id">
                    </el-option>
                </el-select>
                <el-date-picker class="filter-item" v-model="listQuery.startDate" type="date" :editable="false"
                                placeholder="开始时间" :clearable="false" format="yyyy-MM-dd" clearable
                                value-format="yyyy-MM-dd" @change="checkDate">
                </el-date-picker>
                <el-date-picker class="filter-item" v-model="listQuery.endDate" type="date" :editable="false"
                                placeholder="结束时间" :clearable="false" format="yyyy-MM-dd" clearable
                                value-format="yyyy-MM-dd" @change="checkDate">
                </el-date-picker>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="doPlot">统计</el-button>
                <el-button class="filter-item" icon="el-icon-delete" @click="resetSearch">{{$t('table.clear')}}</el-button>
                <el-button class="filter-item" type="primary" icon="el-icon-download" @click="export2Excel">数据导出</el-button>
            </div>
            <div class="splitBar"></div>
            <div class="row">
                <div class="filter-container">
                </div>
                <div class="className" id="windowSatisfaction"></div>
            </div>
        </div>
    </basic-container>
</template>

<script>
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/pie');
    require('echarts/lib/chart/line');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/legend');
    require('echarts/lib/component/toolbox');
    require('echarts/lib/component/title');
    require('echarts/lib/component/visualMap');
    import {mapGetters} from 'vuex';
    import {dataPlotSatisfactionLevelByWindow} from '@/api/statistics/windowSatisfaction';
    import {getAllWindows} from '@/api/number/window';
    import {date} from '@/api/statistics/orderAndLine';

    export default {
        name: 'table_demo',
        data() {
            return {
                windowData: undefined,
                windowName: [],
                windowOneNum: [],
                windowTwoNum: [],
                windowThreeNum: [],
                windowFourNum: [],
                windowFiveNum: [],
                windowZeroNum: [],
                windowSatisfactionRates: [],
                listQuery: {
                    windowIds: undefined,
                    likeWindowIds: undefined,
                    startDate: undefined,
                    endDate: undefined
                },
                checkWindowIds: [],
                windowIdsArray: [],
                likeWindowIdsArray: [],
                windowList: []
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ])
        },
        created() {
            this.listQuery.startDate = this.getTodayStart();
            this.listQuery.endDate = this.getTodayEnd();
            this.getWindowList();
            this.doPlot();
        },
        methods: {
            checkDate() {
                if (this.listQuery.startDate > this.listQuery.endDate) {
                    alert("开始时间不得大于结束时间！")
                }
            },
            resetSearch() {
                this.checkWindowIds = [];
                this.windowIdsArray = [];
                this.likeWindowIdsArray = [];
                this.listQuery.startDate = undefined;
                this.listQuery.endDate = undefined;
            },
            getWindowList() {
                getAllWindows().then(response => {
                    if (response.status === 200) {
                        this.windowList = response.data;
                    } else {
                        this.$message.error('窗口信息加载失败')
                    }
                })
            },
            initArray() {
                for (let checkWindowId of this.checkWindowIds) {
                    const result = this.windowList.some(function(item) {
                        if (item.id == checkWindowId) {
                            return true;
                        } else {
                            return false;
                        }
                    })
                    if (result) {
                        this.windowIdsArray.push(checkWindowId);
                    } else {
                        this.likeWindowIdsArray.push(checkWindowId);
                    }
                }
                console.log("checkWindowIds" + JSON.stringify(this.checkWindowIds))
                console.log("windowIdsArray" + JSON.stringify(this.windowIdsArray))
                console.log("likeWindowIdsArray" + JSON.stringify(this.likeWindowIdsArray))
            },
            doPlot() {
                if (this.listQuery.startDate > this.listQuery.endDate) {
                    alert("开始时间不得大于结束时间！")
                    return;
                }
                this.initArray();
                this.listQuery.windowIds = this.windowIdsArray.join();
                this.listQuery.likeWindowIds = this.likeWindowIdsArray.join();
                dataPlotSatisfactionLevelByWindow(this.listQuery).then(response => {
                    if (response.status === 200) {
                        this.windowData = response.data;
                        this.windowName = [];
                        this.windowOneNum = [];
                        this.windowTwoNum = [];
                        this.windowThreeNum = [];
                        this.windowFourNum = [];
                        this.windowFiveNum = [];
                        this.windowZeroNum = [];
                        this.windowSatisfactionRates = [];
                        for (let window of this.windowData) {
                            this.windowName.push(window.windowName);
                            this.windowOneNum.push(window.onetotal);
                            this.windowTwoNum.push(window.twototal);
                            this.windowThreeNum.push(window.threetotal);
                            this.windowFourNum.push(window.fourtotal);
                            this.windowFiveNum.push(window.fivetotal);
                            this.windowZeroNum.push(window.zerototal);
                            this.windowSatisfactionRates.push(window.satisfactionRate);
                        }
                        const e = echarts.init(document.getElementById('windowSatisfaction'));
                        e.setOption({
                            title: {
                                text: '窗口满意度统计'
                            },
                            legend: {
                                data: ['非常满意', '满意', '一般', '不满意', '非常不满意', '未评价']
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    mark: {show: true},
                                    dataView: {show: true, readOnly: false},
                                    magicType: {show: true, type: ['line', 'bar']},
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    data: this.windowName
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value'
                                },
                                {
                                    type: 'value',
                                    min: 0,
                                    max: 100,
                                    interval: 10,
                                    axisLabel: {
                                        formatter: '{value}.00 %'
                                    }
                                }
                            ],
                            series: [
                                {
                                    name: '非常满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.windowFiveNum
                                },
                                {
                                    name: '满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.windowFourNum
                                },
                                {
                                    name: '一般',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.windowThreeNum
                                },
                                {
                                    name: '不满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.windowTwoNum
                                },
                                {
                                    name: '非常不满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.windowOneNum
                                },
                                {
                                    name: '未评价',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.windowZeroNum
                                },
                                {
                                    name: '满意率',
                                    type: 'line',
                                    yAxisIndex: 1,
                                    data: this.windowSatisfactionRates
                                }
                            ]
                        })
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getTodayStart() {
                return date(new Date(), 'YYYY-MM-DD');
            },
            getTodayEnd() {
                return date(new Date(), 'YYYY-MM-DD');
            },
            export2Excel() {
                require.ensure([], () => {
                    const Export2excel = require('@/excel/Export2excel');
                    //对应表格输出的title
                    const tHeader = ['窗口名称', '非常满意', '满意', '一般', '不满意', "非常不满意", '未评价', '满意率'];
                    // 对应表格输出的数据
                    const filterVal = ['windowName', 'fivetotal', 'fourtotal', 'threetotal', 'twototal', 'onetotal', 'zerototal', 'satisfactionRate'];
                    const excelData = this.formatJson(filterVal, this.windowData);
                    //对应下载文件的名字
                    Export2excel.export2Excel(tHeader, excelData, '窗口满意度excel' + new Date().toLocaleDateString().replace(/\//g,'-'));
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }

    }
</script>
<style>
    .row {
        margin-right: -15px;
        margin-left: -15px;
    }

    .className {
        width: 100%;
        height: 540px
    }

    .filter-item {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 10px;
        margin-left: 10px;
    }

    .splitBar {
        height: 60px;
    }
</style>
