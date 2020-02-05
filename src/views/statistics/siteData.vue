<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-date-picker
                        v-model.trim="timeFrame"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                        :size="searchSize">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search" :size="searchSize" style="margin-left:10px;" @click="getSiteCountList">统计</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="getSiteCountList"></el-button>
                </div>
            </div>
            <el-table :data="siteDataList" v-loading.body="listLoading" stripe border highlight-current-row>
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="站点名称" prop="siteName"/>
                <el-table-column align="center" label="发稿总量" prop="count"/>
                <el-table-column align="center" label="发布量" prop="pubCount"/>
                <el-table-column align="center" label="采用率" prop="rate"/>
                <el-table-column align="center" label="日平均发稿量" prop="averageDay"/>
                <el-table-column align="center" label="周平均发稿量" prop="averageWeek"/>
                <el-table-column align="center" label="月平均发稿量" prop="averageMonth"/>
            </el-table>
            <div style="margin-top:20px">
                <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
            </div>
            <div style="margin-top:20px">
                <div id="myRateChart" :style="{width: '100%', height: '400px'}"></div>
            </div>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getSiteCountList
    } from '@/api/statistics/siteData';
    import echarts from 'echarts'

    export default {
        name: 'siteData',
        data() {
            return {
                listLoading: true,
                listQuery: {
                    startTime: undefined,
                    endTime: undefined
                },
                siteDataList: undefined,
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                timeFrame: [],
            }
        },
        computed: {
            ...mapGetters([
                'permission',
                'titleMap',
                'enums',
                'closeOnClickModal',
                'searchSize',
                'btnSize',
                'dicts'
            ])
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.setCurrDate();
        },
        methods: {
            setCurrDate(){
                let nowDate = new Date();
                let date = {
                    year: nowDate.getFullYear(),
                    month: nowDate.getMonth() + 1,
                    date: nowDate.getDate(),
                }
                this.timeFrame = [date.year + '-' + 0 + date.month + '-01',date.year + '-' + 0 + date.month + '-' + 0 + date.date];
                this.getSiteCountList();
            },
            getSiteCountList() {
                this.listQuery.startTime = this.timeFrame[0]+ " 00:00:00";
                this.listQuery.endTime = this.timeFrame[1]+ " 23:59:59";
                this.listLoading = true;
                getSiteCountList(this.listQuery).then(response => {
                    this.siteDataList = response.data;
                    this.listLoading = false;
                    this.getSitePubTrendRpt();
                    this.getSiteRateTrendRpt();
                });
            },
            getSitePubTrendRpt(){
                let siteName = [];
                let count = [];
                let pubCount = [];
                let rate = [];
                let averageDay = [];
                let averageWeek = [];
                let averageMonth = [];
                for(const row of this.siteDataList){
                    siteName.push(row.siteName);
                    count.push(row.count);
                    pubCount.push(row.pubCount);
                    rate.push(row.rate);
                    averageDay.push(row.averageDay);
                    averageWeek.push(row.averageWeek);
                    averageMonth.push(row.averageMonth);
                }
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('myChart'));
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '发布量'
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: ['发稿总量', '发布量', '日平均发布量', '周平均发布量','月平均发布量']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: siteName
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '发稿总量',
                            type: 'line',
                            stack: '总量',
                            data: count
                        },
                        {
                            name: '发布量',
                            type: 'line',
                            stack: '总量',
                            data: pubCount
                        },
                        {
                            name: '日平均发布量',
                            type: 'line',
                            stack: '总量',
                            data: averageDay
                        },
                        {
                            name: '周平均发布量',
                            type: 'line',
                            stack: '总量',
                            data: averageWeek
                        },
                        {
                            name: '月平均发布量',
                            type: 'line',
                            stack: '总量',
                            data: averageMonth
                        }
                    ]
                })
            },
            getSiteRateTrendRpt(){
                let siteName = [];
                let rate = [];
                for(const row of this.siteDataList){
                    siteName.push(row.siteName);
                    rate.push(row.rate.replace("%",""));
                }
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('myRateChart'));
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '采用率'
                    },
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: '{b}<br />{a0}: {c0}%<br />'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: siteName,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '采用率',
                            type: 'bar',
                            barWidth: '60%',
                            data: rate
                        }
                    ]
                })
            }
        }
    }
</script>


