<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <el-row :span="24">
                <el-col :span="4">
                    <div class="catalog-left-Tree" ref="leftTree" v-loading.body="listLoading">
                        <div class="left-tree-title">栏目列表</div>
                        <el-tree
                            ref="catalogTree"
                            :data="catalogList"
                            :props="defaultTreeProps"
                            node-key="id"
                            highlight-current
                            :default-expand-all="false"
                            :expand-on-click-node="false"
                            @node-click="handleNoteClick">
                        </el-tree>
                    </div>
                </el-col>
                <el-col :span="20">
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
                            <el-button type="primary" :size="btnSize" style="margin-left: 10px;" @click="getCatalogCountList">统计</el-button>
                        </div>
                        <div class="deyatech-menu_right">
                            <el-button icon="el-icon-refresh" :size="btnSize" circle @click="getCatalogCountList"></el-button>
                        </div>
                    </div>
                    <el-table :data="catalogDataList" v-loading.body="listLoading" stripe border highlight-current-row>
                        <el-table-column type="selection" width="50" align="center"/>
                        <el-table-column align="center" label="栏目名称" prop="catName"/>
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
                </el-col>
            </el-row>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getCatalogCountList
    } from '@/api/statistics/catalogData';
    import {
        getCatalogTree
    } from '@/api/station/catalog';
    import echarts from 'echarts'

    export default {
        name: 'catalogData',
        data() {
            return {
                listLoading: true,
                listQuery: {
                    startTime: undefined,
                    endTime: undefined,
                    catalogId: 0,
                    siteId: this.$store.state.common.siteId
                },
                catalogDataList: undefined,
                catalogList: [],
                defaultTreeProps: {
                    children: 'children',
                    label: 'name',
                    isLeaf: 'leaf'
                },
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
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                // 获取栏目
                this.getCatalogTree();
                this.setCurrDate();
            }
        },
        methods: {
            getCatalogTree(){
                this.listLoading = true;
                getCatalogTree(this.listQuery).then(response => {
                    this.catalogList = response.data;
                    this.listLoading = false;
                })
            },
            handleNoteClick(data) {
                this.listQuery.catalogId = data.id;
                this.getCatalogCountList();
            },
            setCurrDate(){
                let nowDate = new Date();
                let date = {
                    year: nowDate.getFullYear(),
                    month: nowDate.getMonth() + 1,
                    date: nowDate.getDate(),
                }
                this.timeFrame = [date.year + '-' + 0 + date.month + '-01',date.year + '-' + 0 + date.month + '-' + 0 + date.date];
                this.getCatalogCountList();
            },
            getCatalogCountList() {
                this.listQuery.startTime = this.timeFrame[0]+ " 00:00:00";
                this.listQuery.endTime = this.timeFrame[1]+ " 23:59:59";
                this.listLoading = true;
                getCatalogCountList(this.listQuery).then(response => {
                    this.catalogDataList = response.data;
                    this.listLoading = false;
                    this.getCatalogPubTrendRpt();
                    this.getCatalogRateTrendRpt();
                });
            },
            getCatalogPubTrendRpt(){
                let catName = [];
                let count = [];
                let pubCount = [];
                let rate = [];
                let averageDay = [];
                let averageWeek = [];
                let averageMonth = [];
                for(const row of this.catalogDataList){
                    catName.push(row.catName);
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
                        data: catName
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
            getCatalogRateTrendRpt(){
                let catName = [];
                let rate = [];
                for(const row of this.catalogDataList){
                    catName.push(row.catName);
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
                            data: catName,
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
<style>
    .catalog-left-Tree {
        border:1px solid #eceef5;
        overflow: auto;
        margin-right:10px;
        padding: 14px;
        height: 600px;
    }
    .catalog-left-Tree .el-tree {
        display: inline-block;
        margin: 10px;
        min-width: 50%;
    }
    .catalog-left-Tree::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    .left-tree-title {
        color: #909399;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        border-bottom: 1px solid #EBEEF5;
        padding: 14px 0px;
    }
</style>


