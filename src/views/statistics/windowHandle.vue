<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-select v-model="checkItemIds" class="filter-item" multiple filterable placeholder="选择事项">
                            <el-option :key="item.id" v-for="item in itemList" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="checkDeptIds" class="filter-item" multiple filterable placeholder="选择部门"
                                   @change="reloadItemList">
                            <el-option :key="item.id" v-for="item in deptList" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="checkWindowIds" class="filter-item" multiple filterable placeholder="选择窗口"
                                   @change="reloadItemList">
                            <el-option :key="item.id" v-for="item in windowList" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="dateRange"
                                        type="datetimerange"
                                        :picker-options="pickerOptions"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        align="right"
                                        @change="dateChange" style="width:100%">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="doPlot">统计</el-button>
                        <el-button icon="el-icon-delete" @click="resetPlot">{{$t('table.clear')}}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="row">
                <div class="splitBar"></div>
                <div class="className" id="windowHandle"></div>
                <div class="splitBar"></div>
                <div class="className" id="windowWait"></div>
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
    require('echarts/lib/component/dataZoom');

    import {mapGetters} from 'vuex';
    import { getItemsByWindowAndDepartment } from '@/api/item/item';
    import { getAllWindows } from '@/api/number/window';
    import { getAllDepartments } from '@/api/admin/department';
    import { getWindowData } from '@/api/statistics/windowHandle';
    import { date } from '@/filters'

    export default {
        name: 'windowHandle',
        data() {
            return {
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
                listQuery: {
                    queryItemIds: undefined,
                    queryDeptIds: undefined,
                    queryWindowIds: undefined,
                    startDate: undefined,
                    endDate: undefined
                },
                checkItemIds: [],
                checkDeptIds: [],
                checkWindowIds: [],
                dateRange: [],
                checkStartDate: undefined,
                checkEndDate: undefined,
                itemListQuery: {
                    windowIds: '',
                    departmentIds: ''
                },
                itemList: [],
                windowList: [],
                deptList: [],
                handleWindowName: [],
                handleNum: [],
                waitWindowName: [],
                waitNum: []
            }
        },
        computed: {
            ...mapGetters([
                'permission',
                'titleMap',
                'enums',
                'closeOnClickModal',
                'searchSize',
                'btnSize'
            ]),
        },
        created() {
            this.getDeptList();
            this.getWindowList();
            this.getItemList();
            this.doPlot();
        },
        methods: {
            resetPlot() {
                this.checkItemIds = [];
                this.checkDeptIds = [];
                this.checkWindowIds = [];
                this.dateRange = [];
                this.checkStartDate = undefined;
                this.checkEndDate = undefined;
                this.listQuery = {
                    queryItemIds: undefined,
                    queryDeptIds: undefined,
                    queryWindowIds: undefined,
                    startDate: undefined,
                    endDate: undefined
                };
            },
            getDeptList() {
                getAllDepartments().then(response => {
                    if (response.status === 200) {
                        this.deptList = response.data;
                    } else {
                        this.$message.error('部门信息加载失败')
                    }
                })
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
            getItemList() {
                this.itemListQuery.windowIds = this.checkWindowIds.join();
                this.itemListQuery.departmentIds = this.checkDeptIds.join();
                getItemsByWindowAndDepartment(this.itemListQuery).then(response => {
                    if (response.status === 200) {
                        this.itemList = response.data
                    } else {
                        this.$message.error('事项信息加载失败')
                    }
                })
            },
            reloadItemList() {
                this.checkItemIds = [];
                this.getItemList();
                this.listQuery.queryItemIds = [];
            },
            doPlot() {
                this.listQuery.queryItemIds = this.checkItemIds.join();
                this.listQuery.queryDeptIds = this.checkDeptIds.join();
                this.listQuery.queryWindowIds = this.checkWindowIds.join();
                console.dir(this.listQuery);
                // 取数据
                getWindowData(this.listQuery).then(response => {
                    console.dir(response);
                    if (response.status === 200) {
                        // 窗口受理量
                        let acceptedNumber = response.data.acceptedNumber;
                        this.handleWindowName = [];
                        this.handleNum = [];
                        if (acceptedNumber) {
                            for (let handle of acceptedNumber) {
                                this.handleWindowName.push(handle.name);
                                this.handleNum.push(handle.value);
                            }
                        }
                        const echartsNumber = echarts.init(document.getElementById('windowHandle'));
                        echartsNumber.setOption({
                            title: {
                                text: '窗口受理量'
                            },
                            legend: {
                                data: ['受理量']
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
                                    data: this.handleWindowName
                                }
                            ],
                            dataZoom: [
                                {
                                    show: true,
                                    start: 0,
                                    end: 100,
                                },
                                {
                                    type: 'inside',
                                    start: 0,
                                    end: 100
                                },
                                {
                                    show: true,
                                    yAxisIndex: 0,
                                    filterMode: 'empty',
                                    width: 30,
                                    showDataShadow: false,
                                    left: '93%'
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '单位：件'
                                }
                            ],
                            series: [
                                {
                                    name: '受理量',
                                    type: 'bar',
                                    data: this.handleNum,
                                    itemStyle: {
                                        normal: {
                                            color: new echarts.graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#83bff6'},
                                                    {offset: 0.5, color: '#188df0'},
                                                    {offset: 1, color: '#188df0'}
                                                ]
                                            )
                                        },
                                        emphasis: {
                                            color: new echarts.graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#2378f7'},
                                                    {offset: 0.7, color: '#2378f7'},
                                                    {offset: 1, color: '#83bff6'}
                                                ]
                                            )
                                        }
                                    },
                                    barMaxWidth: '150'
                                }
                            ]
                        });


                        // 平均等待时长
                        let averageWaitingTime = response.data.averageWaitingTime;
                        this.waitWindowName = [];
                        this.waitNum = [];
                        if (averageWaitingTime) {
                            for (let wait of averageWaitingTime) {
                                this.waitWindowName.push(wait.name);
                                this.waitNum.push(wait.value);
                            }
                        }
                        const echartsAverage = echarts.init(document.getElementById('windowWait'));
                        echartsAverage.setOption({
                            title: {
                                text: '平均等待时长'
                            },
                            legend: {
                                data: ['等待时长']
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
                                    data: this.waitWindowName
                                }
                            ],
                            dataZoom: [
                                {
                                    show: true,
                                    start: 0,
                                    end: 100,
                                },
                                {
                                    type: 'inside',
                                    start: 0,
                                    end: 100
                                },
                                {
                                    show: true,
                                    yAxisIndex: 0,
                                    filterMode: 'empty',
                                    width: 30,
                                    showDataShadow: false,
                                    left: '93%'
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '单位：分钟'
                                }
                            ],
                            series: [
                                {
                                    name: '等待时长',
                                    type: 'bar',
                                    data: this.waitNum,
                                    itemStyle: {
                                        normal: {
                                            color: new echarts.graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#83bff6'},
                                                    {offset: 0.5, color: '#188df0'},
                                                    {offset: 1, color: '#188df0'}
                                                ]
                                            )
                                        },
                                        emphasis: {
                                            color: new echarts.graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#2378f7'},
                                                    {offset: 0.7, color: '#2378f7'},
                                                    {offset: 1, color: '#83bff6'}
                                                ]
                                            )
                                        }
                                    },
                                    barMaxWidth: '150'
                                }
                            ]
                        });
                    } else {
                        this.$message.error('数据加载失败');
                    }
                });
            },
            dateChange(v) {
                if (v == null) {
                    this.listQuery.startDate = undefined;
                    this.listQuery.endDate = undefined;
                } else {
                    this.listQuery.startDate = date(this.dateRange[0],"YYYYMMDDHHmm");
                    this.listQuery.endDate = date(this.dateRange[1],"YYYYMMDDHHmm");
                }
                console.log(this.dateRange);
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

    .splitBar {
        height: 60px;
    }
</style>
